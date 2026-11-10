"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { gallery } from "@/lib/content";

export default function GalleryHorizontal() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <section
      ref={ref}
      className="relative h-[220vh] md:h-[260vh]"
      aria-labelledby="gallery-heading"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16 md:py-24">
        <div className="shell mb-8 flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow text-ink/65" data-reveal>
              The grounds
            </span>
            <h2
              id="gallery-heading"
              className="mt-4 text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]"
              data-reveal
            >
              A walk through <em className="text-clay">the house.</em>
            </h2>
          </div>
          <Link href="/gallery" className="link-line hidden font-mono text-[10px] uppercase tracking-[0.2em] md:inline-flex">
            All photographs →
          </Link>
        </div>

        {/* Desktop: scroll-driven horizontal track */}
        <div className="hidden md:block">
          <motion.div
            style={reduce ? undefined : { x }}
            className="flex gap-6 pl-6 pr-6 will-change-transform"
          >
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="relative shrink-0 overflow-hidden border border-line bg-paper-2"
                style={{ width: "clamp(320px, 38vw, 560px)" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 80vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/65">
                    {String(i + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                  </span>
                  <span className="text-[0.85rem] text-ink/80">{g.alt}</span>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        {/* Mobile: horizontal snap scroll */}
        <div className="md:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="relative shrink-0 snap-start overflow-hidden border border-line bg-paper-2"
                style={{ width: "82vw" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="82vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between gap-4 border-t border-line px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/65">
                    {String(i + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                  </span>
                  <span className="text-[0.85rem] text-ink/80">{g.alt}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
