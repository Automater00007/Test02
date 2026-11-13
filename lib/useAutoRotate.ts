"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Small shared controller for the auto-advancing homepage scenes.
 *
 * It keeps two behaviours from fighting each other:
 *  - the scene advances on a timer while it is idle;
 *  - a hover/click advances it immediately, then holds it still until the
 *    pointer leaves.
 *
 * `lastChange` is a cooldown guard: if the timer and a hover fire in the same
 * tick, the timer backs off instead of advancing a second time.
 */
export function useAutoRotate(
  length: number,
  interval: number,
  reduce: boolean | null,
) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastChange = useRef(0);

  const select = useCallback((next: number) => {
    if (length < 1) return;
    lastChange.current = performance.now();
    setIndex(((next % length) + length) % length);
  }, [length]);

  const advance = useCallback(
    (dir = 1) => {
      if (length < 1) return;
      lastChange.current = performance.now();
      setIndex((current) => (current + dir + length) % length);
    },
    [length],
  );

  useEffect(() => {
    if (reduce || paused || length < 2) return;
    const id = window.setInterval(() => {
      // A manual change just happened — skip this beat.
      if (performance.now() - lastChange.current < interval * 0.55) return;
      lastChange.current = performance.now();
      setIndex((current) => (current + 1) % length);
    }, interval);
    return () => window.clearInterval(id);
  }, [reduce, paused, length, interval]);

  /**
   * Hover handlers that ignore touch input. On a phone a tap can synthesise
   * `mouseenter` and never fire `mouseleave`, which would freeze the scene.
   */
  const hoverProps = useCallback(
    (onEnter?: () => void) => ({
      onPointerEnter: (event: ReactPointerEvent) => {
        if (event.pointerType === "touch") return;
        setPaused(true);
        onEnter?.();
      },
      onPointerLeave: (event: ReactPointerEvent) => {
        if (event.pointerType === "touch") return;
        setPaused(false);
      },
    }),
    [],
  );

  return { index, select, advance, paused, setPaused, hoverProps };
}
