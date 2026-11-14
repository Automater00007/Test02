"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling on every device.
 *
 * Phones were leaving it off because touch momentum already feels "native",
 * which is exactly why the page read as static — the reveal animations were
 * the only motion on screen. Lenis now runs on touch too (syncTouch) with
 * deliberately gentle values so the page glides instead of jump-scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");

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
      if (lenis || reduce.matches) return;

      const desktop = fine.matches;
      lenis = new Lenis({
        duration: desktop ? 1.2 : 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: desktop,
        wheelMultiplier: 0.85,
        // Phones: light synchronous touch smoothing. Momentum still feels
        // native, but the page glides instead of snapping.
        syncTouch: !desktop,
        touchMultiplier: 1.25,
        lerp: desktop ? 0.085 : 0.12,
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
    fine.addEventListener("change", onChange);

    return () => {
      reduce.removeEventListener("change", onChange);
      fine.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}
