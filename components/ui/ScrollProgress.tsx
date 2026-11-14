"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A 2px reading-progress line pinned to the very top of the viewport. It is
 * transform-only, so it costs nothing on a phone, and it gives long mobile
 * scrolls a sense of place between the bigger section reveals.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[112] h-[2px] origin-left bg-crimson/80"
      style={{ scaleX }}
    />
  );
}
