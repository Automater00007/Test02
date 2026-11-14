"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling on desktop only.
 *
 * Phones felt worse with Lenis doing synchronous touch smoothing — image
 * decks stopped swiping cleanly and pages felt heavier. Phones use native
 * scroll (which is excellent); desktop keeps the glide.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");

    let lenis: Lenis | null = null;
    let frame = 0;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lenis?.destroy();
      lenis = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };

    const start = () => {
      if (lenis || reduce.matches || !desktop.matches) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        syncTouch: false,
        touchMultiplier: 2,
        lerp: 0.085,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    start();

    const onChange = () => {
      stop();
      start();
    };

    reduce.addEventListener("change", onChange);
    desktop.addEventListener("change", onChange);

    return () => {
      reduce.removeEventListener("change", onChange);
      desktop.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}
