"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  rotateX?: number;
  distance?: number;
  delay?: number;
}

/**
 * 3D perspective entrance: content starts far away and rotated, then settles
 * into place. Runs once, on first viewport entry.
 */
export default function PerspectiveEntrance({
  children,
  className,
  rotateX = 14,
  distance = 80,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 60%"],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });
  const z = useTransform(eased, [0, 1], [-distance, 0]);
  const rx = useTransform(eased, [0, 1], [rotateX, 0]);
  const opacity = useTransform(eased, [0, 0.35, 1], [0, 1, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        reduce
          ? undefined
          : { opacity, z, rotateX: rx, transformPerspective: 1200, transformStyle: "preserve-3d" }
      }
    >
      {children}
    </motion.div>
  );
}
