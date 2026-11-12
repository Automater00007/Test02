"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero background — a WebGL circular lens reveal.
 *
 * Every 3.5s a small, sharp-edged disc appears near the centre of the hero.
 * Inside it the next photograph is magnified and softly blurred. The disc then
 * expands quickly to fill the frame (drifting up and right), the magnification
 * and blur ease to zero, and the new image settles with a slow 1.06 → 1.0 zoom.
 *
 * The shader does all of the work on the GPU: two textures, a circular mask,
 * a 9-tap blur, an edge highlight and a cover-fit sample. Reduced-motion users
 * get a plain crossfade instead.
 */

const HERO_IMAGES = [
  "/images/twin/exterior.webp",
  "/images/twin/facade.webp",
  "/images/twin/lawn.webp",
  "/images/twin/balcony.webp",
  "/images/twin/restaurant.webp",
  "/images/twin/lounge.webp",
  "/images/twin/entrance.webp",
];

const CYCLE = 7000;
const HOLD = 1200;
const EXPAND = 900;
const SETTLE = 1200;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform vec2 uDrift;
uniform float uTexAspect;
uniform float uReveal;
uniform float uSettle;
uniform float uBlur;
uniform float uMag;
uniform float uGlow;
uniform float uEdge;

vec2 coverUv(vec2 uv, float canvasAspect, float texAspect) {
  vec2 s = vec2(1.0);
  if (canvasAspect > texAspect) {
    s.y = texAspect / canvasAspect;
  } else {
    s.x = canvasAspect / texAspect;
  }
  return (uv - 0.5) * s + 0.5;
}

vec3 blur9(sampler2D tex, vec2 uv, float radius) {
  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      float w = exp(-float(i * i + j * j) * 0.7);
      vec2 o = vec2(float(i), float(j)) * radius;
      sum += texture2D(tex, clamp(uv + o, 0.001, 0.999)).rgb * w;
      wsum += w;
    }
  }
  return sum / wsum;
}

void main() {
  float canvasAspect = uRes.x / max(uRes.y, 1.0);
  vec2 uvA = coverUv(vUv, canvasAspect, uTexAspect);
  vec3 colA = texture2D(uTexA, uvA).rgb;

  vec2 center = uCenter + uDrift * uReveal;
  vec2 p = (vUv - center) * vec2(canvasAspect, 1.0);
  float d = length(p);

  // A gentle angular wobble gives the expanding disc a soft, liquid edge.
  float angle = atan(p.y, p.x);
  float wobble = 1.0 + 0.07 * sin(angle * 7.0 + uReveal * 10.0);
  float radius = mix(0.055, 2.35, uReveal) * wobble;
  float mask = 1.0 - smoothstep(radius - uEdge, radius + uEdge, d);

  vec2 dir = vUv - center;
  vec2 uvB = center + dir / max(uMag, 0.001);
  float settleScale = mix(1.06, 1.0, uSettle);
  uvB = (uvB - 0.5) / settleScale + 0.5;
  uvB = coverUv(uvB, canvasAspect, uTexAspect);
  vec3 colB = blur9(uTexB, uvB, 0.024 * uBlur);

  float ring = exp(-pow((d - radius) / 0.022, 2.0));
  vec3 glow = vec3(1.0, 0.95, 0.85) * ring * uGlow * 0.9;

  vec3 col = mix(colA, colB, mask) + glow * mask;

  float vig = smoothstep(0.55, 1.35, length((vUv - 0.5) * vec2(canvasAspect, 1.0)));
  col *= 1.0 - 0.12 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroLens() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) {
      canvas.style.display = "none";
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uTexA: gl.getUniformLocation(program, "uTexA"),
      uTexB: gl.getUniformLocation(program, "uTexB"),
      uRes: gl.getUniformLocation(program, "uRes"),
      uCenter: gl.getUniformLocation(program, "uCenter"),
      uDrift: gl.getUniformLocation(program, "uDrift"),
      uTexAspect: gl.getUniformLocation(program, "uTexAspect"),
      uReveal: gl.getUniformLocation(program, "uReveal"),
      uSettle: gl.getUniformLocation(program, "uSettle"),
      uBlur: gl.getUniformLocation(program, "uBlur"),
      uMag: gl.getUniformLocation(program, "uMag"),
      uGlow: gl.getUniformLocation(program, "uGlow"),
      uEdge: gl.getUniformLocation(program, "uEdge"),
    };

    gl.uniform1i(uniforms.uTexA, 0);
    gl.uniform1i(uniforms.uTexB, 1);
    gl.uniform1f(uniforms.uEdge, 0.006);
    gl.uniform2f(uniforms.uCenter, 0.5, 0.48);
    gl.uniform2f(uniforms.uDrift, 0.055, 0.045);

    const textures: (WebGLTexture | null)[] = new Array(HERO_IMAGES.length).fill(null);
    let loaded = 0;
    let disposed = false;
    let current = 0;
    let raf = 0;
    const start = performance.now();
    let lastCycle = -1;

    const upload = (index: number, img: HTMLImageElement) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      textures[index] = tex;
      loaded += 1;
    };

    HERO_IMAGES.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        upload(i, img);
      };
      img.src = src;
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uniforms.uRes, w, h);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const frame = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);

      if (loaded < 2) return;

      const elapsed = now - start;
      const cycle = Math.floor(elapsed / CYCLE);
      const t = elapsed % CYCLE;

      if (cycle !== lastCycle) {
        lastCycle = cycle;
        if (cycle > 0) current = (current + 1) % HERO_IMAGES.length;
      }

      const next = (current + 1) % HERO_IMAGES.length;

      let reveal = 0;
      let blur = 1;
      let mag = 1.7;
      let glow = 0;
      let settle = 0;

      if (t < HOLD) {
        reveal = 0;
        blur = 1;
        mag = 1.7;
        glow = 0;
        settle = 0;
      } else if (t < HOLD + EXPAND) {
        const p = (t - HOLD) / EXPAND;
        const e = 1 - Math.pow(1 - p, 3);
        reveal = e;
        blur = 1 - e * 0.85;
        mag = 1.7 - 0.7 * e;
        glow = Math.min(1, p * 1.6);
        settle = 0;
      } else if (t < HOLD + EXPAND + SETTLE) {
        const p = (t - HOLD - EXPAND) / SETTLE;
        reveal = 1;
        blur = 0;
        mag = 1;
        settle = 1 - Math.pow(1 - p, 3);
        glow = Math.max(0, 1 - p * 1.5);
      } else {
        reveal = 1;
        blur = 0;
        mag = 1;
        settle = 1;
        glow = 0;
      }

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[current]);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[next]);

      gl.uniform1f(uniforms.uTexAspect, 16 / 9);
      gl.uniform1f(uniforms.uReveal, reveal);
      gl.uniform1f(uniforms.uSettle, settle);
      gl.uniform1f(uniforms.uBlur, blur);
      gl.uniform1f(uniforms.uMag, mag);
      gl.uniform1f(uniforms.uGlow, glow);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      textures.forEach((tex) => {
        if (tex) gl.deleteTexture(tex);
      });
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [reduce]);

  if (reduce) {
    return <CrossfadeHero />;
  }

  return (
    <div className="absolute inset-0">
      {/* Poster fallback. The canvas paints over this whenever WebGL is
          available, so the hero never falls back to a bare gradient on a
          device that cannot create a context. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGES[0]}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      {/* Dark left-to-right wash keeps the navigation and any overlaid copy legible. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1d1208]/80 via-[#2a1a0e]/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1d1208]/80 via-[#2a1a0e]/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a1a0e]/40 via-transparent to-transparent"
        aria-hidden="true"
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGES[0]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </noscript>
    </div>
  );
}

/** Reduced-motion fallback: a quiet, CSS crossfade between the same images. */
function CrossfadeHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-deep">
      {HERO_IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1d1208]/80 via-[#2a1a0e]/35 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
