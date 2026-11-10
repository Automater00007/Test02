"use client";

import { useEffect, useRef } from "react";

const STAGE_COPY = [
  { eyebrow: "The Approach", title: ["A quiet road", "through the pines."], body: "Past the stone drive and the last bend of Dehwathu, the valley opens. Two timber towers rise against the pines — a hotel that feels less discovered than arrived at.", meta: ["Dehwathu · Pahalgam"], link: { href: "#estate", label: "Explore the estate" } },
  { eyebrow: "The Main Frame", title: ["Five storeys,", "framed in timber."], body: "White render meets red brick, black steel balconies and a steep grey roof. The twin towers hold 25 rooms, each with a balcony turned toward the mountains.", meta: ["25 rooms · 5 storeys · 2 towers"], link: { href: "#estate", label: "Read the architecture" } },
  { eyebrow: "The Lawn", title: ["An alpine plateau,", "held by pine forest."], body: "The lawn is the living room of the estate: chequered stone, rope chairs, glass tables and a white fence that gives way to the valley. In every direction, the mountains hold the horizon.", meta: ["360° valley · Pine forest"], link: { href: "#gallery", label: "Wander the grounds" } },
  { eyebrow: "The Attic & Suites", title: ["Warm timber,", "and the mountain", "outside."], body: "Upstairs, the day softens. King beds, warm panelling and private balconies; the attic rooms sit closest to the roof, where the light arrives early and leaves late.", meta: ["King bed · Balcony · Breakfast"], link: { href: "#suites", label: "Enter the suites" } },
];

const STAGES = [{ id: 0, start: 0, end: 0.25 }, { id: 1, start: 0.33, end: 0.58 }, { id: 2, start: 0.66, end: 0.88 }, { id: 3, start: 0.93, end: 1 }];
const TRANSITIONS = [{ start: 0.25, end: 0.33, from: 0, to: 1 }, { start: 0.58, end: 0.66, from: 1, to: 2 }, { start: 0.88, end: 0.93, from: 2, to: 3 }];

export default function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const journey = document.getElementById("journey");
    const sticky = document.querySelector<HTMLElement>(".journey-sticky");
    const canvas = document.getElementById("journey-canvas") as HTMLCanvasElement | null;
    if (!journey || !sticky || !canvas) return;

    const video = videoRef.current;
    if (!video) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let current = window.scrollY;
    let target = current;
    let animating = false;
    let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    function updateMax() { maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight); return maxScroll; }

    function onWheel(e: WheelEvent) {
      const el = e.target instanceof Element ? e.target : null;
      if (el && el.closest("[data-native-scroll], input, select, textarea, .drawer")) return;
      if (document.body.classList.contains("is-locked")) return;
      e.preventDefault();
      updateMax();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerHeight;
      target = clamp(target + delta, 0, maxScroll);
      animating = true;
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", updateMax);

    const frames: HTMLImageElement[][] = [[], [], [], []];
    const posters: HTMLImageElement[] = [1, 2, 3, 4].map((n) => {
      const img = new Image();
      img.src = `/frames/stage-${n}/001.webp`;
      return img;
    });
    const loadedStage = [false, false, false, false];
    function loadStage(s: number) {
      if (loadedStage[s]) return;
      loadedStage[s] = true;
      for (let n = 1; n <= 40; n++) {
        const img = new Image();
        img.decoding = "async";
        img.src = `/frames/stage-${s + 1}/${String(n).padStart(3, "0")}.webp`;
        frames[s][n - 1] = img;
      }
    }
    loadStage(0);
    function ensureStages(p: number) {
      const idx = stageAt(p);
      loadStage(idx);
      if (idx + 1 < 4) loadStage(idx + 1);
    }

    let dpr = 1, cw = 0, ch = 0;
    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.25 : 1.5);
      const w = Math.max(1, Math.round(sticky!.clientWidth * dpr));
      const h = Math.max(1, Math.round(sticky!.clientHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w; canvas!.height = h;
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = "medium";
      }
      cw = canvas!.width; ch = canvas!.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ready = (img: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0;
    function drawCover(img: HTMLImageElement, opts: { scale?: number; alpha?: number } = {}) {
      const scale = opts.scale || 1;
      const alpha = opts.alpha === undefined ? 1 : opts.alpha;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const cr = cw / ch, ir = iw / ih;
      let w: number, h: number;
      if (ir > cr) { h = ch; w = ch * ir; } else { w = cw; h = cw / ir; }
      w *= scale; h *= scale;
      ctx!.globalAlpha = alpha;
      ctx!.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      ctx!.globalAlpha = 1;
    }
    function drawFrameOrPoster(stage: number, index: number, opts?: { scale?: number; alpha?: number }) {
      const img = frames[stage][index];
      if (ready(img)) drawCover(img, opts);
      else if (ready(posters[stage])) drawCover(posters[stage], opts);
    }
    function resolveProgress(p: number): any {
      for (const tr of TRANSITIONS) if (p >= tr.start && p <= tr.end) return { transition: tr, t: (p - tr.start) / (tr.end - tr.start) };
      for (const st of STAGES) if (p >= st.start && p <= st.end) return { stage: st, local: (p - st.start) / (st.end - st.start) };
      if (p < STAGES[0].start) return { stage: STAGES[0], local: 0 };
      return { stage: STAGES[3], local: 1 };
    }
    function stageAt(p: number) {
      const res = resolveProgress(p);
      if (res.transition) return res.t < 0.5 ? res.transition.from : res.transition.to;
      return res.stage.id;
    }
    function drawStage(stage: number, local: number) {
      drawFrameOrPoster(stage, clamp(Math.round(local * 39), 0, 39));
    }
    function easeCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function drawTransition(tr: any, rawT: number) {
      const t = easeCubic(clamp(rawT, 0, 1));
      drawFrameOrPoster(tr.from, 39, { scale: 1 + t * 0.16 });
      ctx!.globalAlpha = t;
      drawFrameOrPoster(tr.to, 0, { scale: 1.22 - t * 0.22 });
      ctx!.globalAlpha = 1;
    }
    function drawJourney(p: number) {
      ctx!.globalAlpha = 1; ctx!.fillStyle = "#0a0806"; ctx!.fillRect(0, 0, cw, ch);
      // Draw slow-mo video frame onto canvas as the moving background
      if (video && video.readyState >= 2) ctx!.drawImage(video, 0, 0, cw, ch);
      const res = resolveProgress(p);
      if (res.transition) drawTransition(res.transition, res.t);
      else drawStage(res.stage.id, res.local);
    }

    const stageCards = Array.from(document.querySelectorAll<HTMLElement>(".stage-card"));
    const railItems = Array.from(document.querySelectorAll<HTMLElement>(".rail-item"));
    function setActiveStage(index: number) {
      stageCards.forEach((card, i) => {
        const on = i === index;
        card.classList.toggle("is-active", on);
        card.setAttribute("aria-hidden", String(!on));
      });
      railItems.forEach((item, i) => item.classList.toggle("is-active", i === index));
    }

    const scrub = document.getElementById("scrub") as HTMLInputElement | null;
    const scrubValue = document.getElementById("scrub-value");
    let lastScrub = -1;
    function updateProgressUI(p: number) {
      const pct = p * 100;
      if (Math.abs(pct - lastScrub) > 0.05) {
        if (scrub) scrub.value = String(Math.round(p * 1000));
        if (scrub) scrub.style.setProperty("--p", `${pct}%`);
        if (scrubValue) scrubValue.textContent = `${Math.round(pct)}%`;
        lastScrub = pct;
      }
      const cue = document.getElementById("scroll-cue");
      if (cue) cue.classList.toggle("is-hidden", p > 0.015);
    }

    document.querySelectorAll<HTMLElement>("[data-jump]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pp = Number(btn.dataset.jump);
        target = clamp(journey!.offsetTop + pp * (journey!.offsetHeight - window.innerHeight), 0, maxScroll);
        animating = true;
      });
    });

    let displayProgress = 0;
    let lastFrame = performance.now();
    function tick(now: number) {
      const dt = Math.min(80, now - lastFrame);
      lastFrame = now;
      if (animating) {
        const diff = target - current;
        current += diff * 0.11;
        if (Math.abs(diff) < 0.35) { current = target; animating = false; }
        window.scrollTo(0, current);
      }
      const rect = journey!.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!visible) {
        requestAnimationFrame(tick);
        return;
      }
      const distance = Math.max(1, journey!.offsetHeight - window.innerHeight);
      const stateP = clamp(-rect.top / distance, 0, 1);
      displayProgress = lerp(displayProgress, stateP, 0.15);
      if (Math.abs(displayProgress - stateP) < 0.00004) displayProgress = stateP;
      ensureStages(displayProgress);
      drawJourney(displayProgress);
      setActiveStage(stageAt(displayProgress));
      updateProgressUI(displayProgress);
      const header = document.getElementById("site-header");
      if (header) header.classList.toggle("is-scrolled", current > 30);
      requestAnimationFrame(tick);
    }
    displayProgress = clamp(-journey!.getBoundingClientRect().top / Math.max(1, journey!.offsetHeight - window.innerHeight), 0, 1);
    setActiveStage(stageAt(displayProgress));
    drawJourney(displayProgress);
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", updateMax);
      window.removeEventListener("resize", resizeCanvas);
      video.pause();
      video.src = "";
    };
  }, []);

  return (
    <section id="journey" className="journey" aria-label="A scroll film through the hotel">
      <div className="journey-sticky">
        <video
          ref={videoRef}
          src="/video/film-720.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <canvas id="journey-canvas" aria-hidden="true" className="absolute inset-0 w-full h-full" />
        <div className="journey-editorial">
          <div className="stage-cards">
            {STAGE_COPY.map((s, i) => (
              <article key={i} className={`stage-card ${i === 0 ? "is-active" : ""}`} data-stage={i} aria-hidden={i !== 0}>
                <span className="stage-ghost" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <p className="stage-eyebrow"><span />{s.eyebrow}</p>
                <h1 className="stage-title">
                  {s.title.map((line, li) => (
                    <span className="line" key={li}>
                      <span style={{ "--d": `${0.06 + li * 0.08}s` } as React.CSSProperties}>{line}</span>
                    </span>
                  ))}
                </h1>
                <p className="stage-body">{s.body}</p>
                <div className="stage-meta"><span>{s.meta[0]}</span></div>
                <a className="stage-link" href={s.link.href}><span>{s.link.label}</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              </article>
            ))}
          </div>
        </div>
        <nav className="stage-rail" aria-label="Jump to a stage">
          {["Approach", "Facade", "Lawn", "Suites"].map((name, i) => (
            <button key={name} className={`rail-item ${i === 0 ? "is-active" : ""}`} type="button" data-jump={[0.01, 0.34, 0.67, 0.94][i]}>
              <span className="rail-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="rail-name">{name}</span>
              <span className="rail-dot" />
            </button>
          ))}
        </nav>
        <div className="scroll-cue" id="scroll-cue"><span>Scroll to travel</span><i /></div>
      </div>
    </section>
  );
}
