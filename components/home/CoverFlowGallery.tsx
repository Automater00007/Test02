"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { gallery } from "@/lib/content";

/**
 * 3D curved cover-flow.
 *
 * Five cards sit on the inside of a cylinder: the active card is flat and
 * sharp, its neighbours rotate toward the centre and recede, and the outer
 * cards fall further back into blur and fade. It loops forever, advances
 * automatically, and can be driven by click, drag, swipe or the arrow keys.
 */
export default function CoverFlowGallery() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ x: 0, active: false });
  const lastChange = useRef(0);
  const count = gallery.length;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = useCallback(
    (dir: number) => {
      lastChange.current = performance.now();
      setActive((a) => (a + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const id = window.setInterval(() => {
      // A hover/drag just moved the reel — let that transition finish.
      if (performance.now() - lastChange.current < 2800) return;
      lastChange.current = performance.now();
      setActive((a) => (a + 1) % count);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduce, paused, count]);

  if (reduce) {
    return (
      <section className="relative bg-paper-2 py-20 md:py-28" aria-labelledby="gallery-heading">
        <div className="shell">
          <GalleryHeader />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) => (
              <figure key={g.src} className="overflow-hidden rounded-3xl bg-paper">
                <div className="relative aspect-[4/5]">
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="px-5 py-4 text-[0.85rem] font-medium">{g.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const maxVisible = compact ? 1 : 2;

  return (
    <section
      className="relative overflow-hidden bg-paper-2 py-20 md:py-28"
      aria-labelledby="gallery-heading"
    >
      <div className="shell">
        <GalleryHeader />
      </div>

      <div
        className="relative mx-auto mt-12 w-full max-w-[1400px] outline-none"
        style={{ perspective: 1800 }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Gallery photographs"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            go(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(-1);
          }
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "touch") return;
          setPaused(true);
          go(1);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "touch") return;
          setPaused(false);
        }}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, active: true };
          setPaused(true);
        }}
        onPointerUp={(e) => {
          if (!drag.current.active) return;
          const dx = e.clientX - drag.current.x;
          drag.current.active = false;
          if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
          setPaused(false);
        }}
        onPointerCancel={() => {
          drag.current.active = false;
          setPaused(false);
        }}
      >
        <div
          className="relative mx-auto flex items-center justify-center"
          style={{
            height: compact ? "clamp(380px, 88vw, 540px)" : "clamp(470px, 44vw, 700px)",
            touchAction: "pan-y",
          }}
        >
          {gallery.map((g, i) => {
            let d = i - active;
            if (d > count / 2) d -= count;
            if (d < -count / 2) d += count;

            const abs = Math.abs(d);
            const visible = abs <= maxVisible;
            const isActive = d === 0;

            return (
              <div
                key={g.src}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: compact ? "clamp(190px, 62vw, 320px)" : "clamp(210px, 27vw, 400px)",
                  zIndex: 20 - abs,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
              <motion.figure
                className="origin-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  // Every card moves along the same linear path, so the reel
                  // reads as one continuous motion instead of cards drifting
                  // at different speeds.
                  x: `${d * (compact ? 58 : 56)}%`,
                  y: `${abs * (compact ? 6 : 10)}px`,
                  rotateY: d * (compact ? 12 : 24),
                  scale: 1 - abs * (compact ? 0.1 : 0.12),
                  opacity: !visible ? 0 : isActive ? 1 : abs === 1 ? 0.62 : 0.24,
                }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => {
                    lastChange.current = performance.now();
                    setActive(i);
                  }}
                  aria-label={isActive ? `Showing: ${g.alt}` : `Show ${g.alt}`}
                  aria-current={isActive}
                  className={`group block w-full text-left ${isActive ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div
                    className={`relative aspect-[4/5] overflow-hidden rounded-[24px] bg-paper ${
                      isActive
                        ? "shadow-[0_36px_90px_-30px_rgba(42,26,14,0.55)]"
                        : "shadow-[0_20px_50px_-24px_rgba(42,26,14,0.45)]"
                    }`}
                  >
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes={compact ? "62vw" : "(min-width: 768px) 27vw, 62vw"}
                      quality={82}
                      loading={abs <= 1 ? "eager" : "lazy"}
                      className="object-cover"
                    />
                    <span className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-ink/10" />
                    {isActive && (
                      <span className="absolute left-4 top-4 rounded-full bg-crimson px-2.5 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-ivory">
                        {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <figcaption
                    className={`mt-4 px-1 text-center transition-all duration-500 ${
                      isActive
                        ? "text-ink opacity-100"
                        : "pointer-events-none text-ink/55 opacity-0"
                    }`}
                    aria-hidden={!isActive}
                  >
                    <span className={`block ${isActive ? "text-[0.95rem] font-semibold" : "text-[0.85rem] font-medium"}`}>
                      {g.alt}
                    </span>
                    <span className="mt-1 block text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-stone">
                      {isActive ? "Twin Towers by Defoy" : "Tap to bring forward"}
                    </span>
                  </figcaption>
                </button>
              </motion.figure>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2.5">
          {gallery.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => {
                lastChange.current = performance.now();
                setActive(i);
              }}
              aria-label={`Go to image ${i + 1}: ${g.alt}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-crimson" : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>

        <p className="mt-5 text-center text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-stone">
          Drag, swipe or use ← →
        </p>
      </div>
    </section>
  );
}

function GalleryHeader() {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex items-center gap-3" data-reveal="fade">
          <span className="block h-px w-10 bg-crimson" />
          <span className="eyebrow text-crimson">03 — The grounds</span>
        </div>
        <h2
          id="gallery-heading"
          className="mt-5 max-w-[18ch] text-[clamp(2.2rem,5vw,4.8rem)] font-bold leading-[0.96] tracking-[-0.04em]"
          data-reveal="tilt"
        >
          A walk through <em>the house.</em>
        </h2>
      </div>
      <div className="flex items-end gap-6">
        <p className="hidden max-w-xs text-[0.92rem] leading-relaxed text-ink/70 md:block" data-reveal="fade">
          A curved reel of the drive, the lawn, the rooms and the light that moves
          through them.
        </p>
        <Link
          href="/gallery"
          className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson"
          data-reveal="fade"
        >
          All photographs →
        </Link>
      </div>
    </div>
  );
}
