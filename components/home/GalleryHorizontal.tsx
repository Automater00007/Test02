"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { gallery } from "@/lib/content";

export default function GalleryHorizontal() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const x = useTransform(eased, [0, 1], ["0%", "-64%"]);
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  return (
    <section
      ref={ref}
      className="relative h-auto bg-paper-2 md:h-[270vh]"
      aria-labelledby="gallery-heading"
    >
      <div className="relative flex flex-col justify-center overflow-hidden py-16 md:sticky md:top-0 md:h-svh md:pt-28 md:pb-16">
        <div className="shell mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">02 — The grounds</span>
            </div>
            <h2
              id="gallery-heading"
              className="mt-5 text-[clamp(2.2rem,5vw,4.8rem)] font-bold leading-[0.96] tracking-[-0.04em]"
              data-reveal
            >
              A walk through <em>the house.</em>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="link-line hidden text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-crimson md:inline-flex"
            data-reveal="fade"
          >
            All photographs →
          </Link>
        </div>

        {/* Desktop: scroll-driven horizontal track */}
        <div className="hidden md:block">
          <motion.div
            style={reduce ? undefined : { x }}
            className="flex gap-5 pl-[clamp(1.15rem,4.2vw,5rem)] pr-[clamp(1.15rem,4.2vw,5rem)] will-change-transform"
          >
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="group relative shrink-0 overflow-hidden bg-paper"
                style={{ width: "clamp(320px, 36vw, 540px)" }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 768px) 36vw, 80vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 bg-crimson px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ivory">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="flex items-center justify-between gap-4 border-t border-mist/70 bg-paper px-4 py-3.5">
                  <span className="text-[0.85rem] font-medium text-ink">{g.alt}</span>
                  <span className="tabular shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone">
                    {String(i + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        {/* Mobile: horizontal snap rail */}
        <div className="md:hidden">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="relative w-[82vw] shrink-0 snap-start overflow-hidden bg-paper"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={g.src} alt={g.alt} fill sizes="82vw" className="object-cover" />
                  <span className="absolute left-4 top-4 bg-crimson px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ivory">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption className="flex items-center justify-between gap-4 border-t border-mist/70 bg-paper px-4 py-3">
                  <span className="text-[0.82rem] font-medium text-ink">{g.alt}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Scroll progress */}
        <div className="shell mt-8 hidden md:block">
          <div className="h-px w-full bg-mist/70">
            <motion.div
              className="h-px origin-left bg-crimson"
              style={{ scaleX: reduce ? 1 : bar }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-stone">
              Scroll to wander
            </span>
            <span className="tabular text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-crimson">
              {String(gallery.length).padStart(2, "0")} photographs
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
