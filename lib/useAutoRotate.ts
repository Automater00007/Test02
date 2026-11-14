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

  /**
   * Swipe handlers for phones. A horizontal drag past a short threshold moves
   * the deck one step and holds it; a vertical drag is left to the page scroll.
   */
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swipeProps = {
    onPointerDown: (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") return;
      swipeStart.current = { x: event.clientX, y: event.clientY };
    },
    onPointerUp: (event: ReactPointerEvent) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        advance(dx < 0 ? 1 : -1);
      }
    },
    onPointerCancel: () => {
      swipeStart.current = null;
    },
  };

  return { index, select, advance, paused, setPaused, hoverProps, swipeProps };
}
