"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { gallery } from "@/lib/content";

export default function StackCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 40%"],
  });
  const n = gallery.length;
  const center = (n - 1) / 2;

  return (
    <section className="relative py-24 md:py-32" aria-labelledby="stack-heading">
      <div className="shell">
        <div className="mb-14 flex items-end justify-between gap-4">
          <span className="eyebrow text-ink/65" data-reveal>
            The details
          </span>
          <h2 id="stack-heading" className="text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]" data-reveal>
            A closer look
          </h2>
        </div>

        <div ref={ref} className="relative h-[82vh] md:h-[92vh] w-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {gallery.map((g, i) => {
            const offset = i - center;
            const x = useTransform(scrollYProgress, [0, 1], [`${offset * -22}px`, `${offset * 190}px`]);
            const y = useTransform(scrollYProgress, [0, 1], [`${Math.abs(offset) * 12}px`, "0px"]);
            const rotate = useTransform(scrollYProgress, [0, 1], [`${offset * 6}deg`, "0deg"]);
            const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
            const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
            const zIndex = n - i;

            return (
              <motion.div
                key={i}
                className="relative shrink-0 overflow-hidden border border-line bg-paper-2 shadow-[0_20px_60px_rgba(20,14,8,0.15)]"
                style={{
                  x,
                  y,
                  rotate,
                  scale,
                  opacity,
                  zIndex,
                  width: reduce ? "clamp(300px, 85vw, 640px)" : "clamp(260px, 42vw, 520px)",
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute bottom-0 left-0 p-6 w-full text-paper">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/60 block mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(1rem,1.6vw,1.25rem)] leading-tight">{g.alt}</span>
                </figcaption>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
