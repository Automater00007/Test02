"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * Cinematic image expansion: a full-width photograph expands from a narrow
 * band into a full panel as the section scrolls into view, sitting behind the
 * booking content.
 */
export default function CtaBackground() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 35%"],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });
  const scale = useTransform(eased, [0, 1], [1.35, 1]);
  const scaleX = useTransform(eased, [0, 1], [0.6, 1]);
  const opacity = useTransform(eased, [0, 0.4, 1], [0, 0.8, 0.55]);
  const radius = useTransform(eased, [0, 1], ["1rem", "2rem"]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { scale, scaleX, opacity, borderRadius: radius } as any}
      >
        <Image
          src="/images/twin/exterior.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-paper-2/85" />
      </motion.div>
    </div>
  );
}
