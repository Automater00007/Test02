"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { gallery } from "@/lib/content";

/**
 * Stacking cards. Each card is sticky at the same top offset, so the next
 * card slides over the previous one. The previous card recedes (scale +
 * fade) as the next arrives — depth without any layout thrash.
 */
export default function StackCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative overflow-hidden bg-deep py-20 text-ivory md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-ivory/50" />
              <span className="eyebrow text-ivory/75">03 — The details</span>
            </div>
            <h2
              className="mt-5 text-[clamp(2.2rem,5vw,4.6rem)] font-bold leading-[0.96] tracking-[-0.04em]"
              data-reveal
            >
              A closer look.
            </h2>
          </div>
          <p className="max-w-xs text-[0.92rem] leading-relaxed text-ivory/70" data-reveal="fade">
            Eight frames from the drive, the lawn and the rooms above it.
          </p>
        </div>

        <div ref={ref} className="relative mt-12 md:mt-16">
          {gallery.map((g, i) => (
            <div
              key={i}
              className="sticky top-[9vh] mb-[5vh] md:top-[15vh]"
              style={{ zIndex: i + 1 }}
            >
              <StackCard
                index={i}
                total={gallery.length}
                progress={scrollYProgress}
                reduce={!!reduce}
                src={g.src}
                alt={g.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackCard({
  index,
  total,
  progress,
  reduce,
  src,
  alt,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
  src: string;
  alt: string;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const scale = useTransform(progress, [start, end], [1, 0.9]);
  const y = useTransform(progress, [start, end], ["0%", "-4%"]);

  return (
    <motion.figure
      style={reduce ? undefined : { scale, y }}
      className="relative h-[62vh] origin-top overflow-hidden border border-ivory/15 bg-deep md:h-[66vh]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 90vw, 100vw"
        className="object-cover"
        loading={index < 2 ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-transparent to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
        <span className="bg-ivory px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-deep">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ivory/70 md:block">
          Twin Towers by Defoy
        </span>
      </div>

      <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        <p className="max-w-[24ch] font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
          {alt}
        </p>
      </figcaption>
    </motion.figure>
  );
}
