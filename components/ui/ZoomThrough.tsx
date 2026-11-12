"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Starting scale. Values below 1 grow the panel from small to full size. */
  from?: number;
  to?: number;
  radiusFrom?: string;
  radiusTo?: string;
  rotateXFrom?: number;
  yFrom?: number;
}

/**
 * Zoom-through reveal with a morphing rounded container.
 *
 * The panel can either start zoomed in (`from > 1`) or, as the house section
 * uses, start as a smaller card (`from < 1`) and grow until it fits its column
 * exactly. The border radius eases from soft to the site's standard rounding
 * at the same time.
 */
export default function ZoomThrough({
  children,
  className,
  from = 1.16,
  to = 1,
  radiusFrom = "2rem",
  radiusTo = "1.25rem",
  rotateXFrom = 8,
  yFrom = 26,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 48%"],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 72, damping: 22 });
  const scale = useTransform(eased, [0, 1], [from, to]);
  const radius = useTransform(eased, [0, 1], [radiusFrom, radiusTo]);
  const rotateX = useTransform(eased, [0, 1], [rotateXFrom, 0]);
  const y = useTransform(eased, [0, 1], [yFrom, 0]);
  const opacity = useTransform(eased, [0, 0.22, 1], [0, 1, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        reduce
          ? undefined
          : ({
              opacity,
              scale,
              borderRadius: radius,
              rotateX,
              y,
              transformPerspective: 1300,
              transformOrigin: "center center",
            } as never)
      }
    >
      {children}
    </motion.div>
  );
}
