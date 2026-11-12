"use client";

import { motion, useReducedMotion } from "framer-motion";
import ParallaxImage from "@/components/ui/ParallaxImage";
import ZoomThrough from "@/components/ui/ZoomThrough";
import PerspectiveEntrance from "@/components/ui/PerspectiveEntrance";
import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";
import { imagePool, pickImages } from "@/lib/imagePool";

const facts = [
  { k: "Rooms", v: "25, one category" },
  { k: "Floors", v: "Ground + 4" },
  { k: "Check-in", v: "2:00 PM" },
  { k: "Check-out", v: "12:00 noon" },
];

const exterior = imagePool.find((i) => i.src.endsWith("exterior.webp")) ?? imagePool[0];
const balcony = imagePool.find((i) => i.src.endsWith("balcony.webp")) ?? imagePool[6];
const extras = pickImages(31, 4).filter(
  (i) => i.src !== exterior.src && i.src !== balcony.src,
);
const shots = [exterior, balcony, ...extras].slice(0, 4);

export default function Estate() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="estate-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">02 — The house</span>
            </div>

            <SplitText
              text="A house of two halves, held together by the roof."
              as="h2"
              id="estate-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />

            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              White render meets red brick, black steel balconies and a steep grey
              roof. The twin towers hold 25 rooms, each with a balcony turned toward
              the mountains. The lawn in front is the living room of the estate.
            </p>

            <dl className="mt-10 border-t border-line">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-3.5"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone">{f.k}</dt>
                  <dd className="text-[0.94rem] font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-stone"
              data-reveal="fade"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-crimson" />
              {site.coordsDisplay}
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7" style={{ perspective: 1500 }}>
            <div className="relative">
              {/* The main photograph grows from a small card into the full panel. */}
              <ZoomThrough
                from={0.72}
                radiusFrom="2rem"
                radiusTo="1.25rem"
                rotateXFrom={10}
                yFrom={34}
                className="relative overflow-hidden rounded-2xl bg-paper-2 shadow-[0_30px_80px_-40px_rgba(42,26,14,0.4)]"
              >
                <ParallaxImage
                  src={shots[0].src}
                  alt={shots[0].alt}
                  width={1600}
                  height={1067}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  speed={0.07}
                  className="aspect-[4/3]"
                />
              </ZoomThrough>
              <span className="absolute -left-px top-6 hidden bg-crimson px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory md:block">
                Dehwathu · 2,200 m
              </span>

              <motion.div
                className="absolute -bottom-6 -right-6 hidden h-40 w-40 overflow-hidden rounded-2xl border-4 border-paper shadow-[0_20px_60px_rgba(42,26,14,0.25)] md:block"
                style={{ transformStyle: "preserve-3d" }}
                animate={
                  reduce
                    ? undefined
                    : { rotateY: [-12, 12], rotateZ: [-1.5, 1.5], y: [0, -10, 0] }
                }
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ParallaxImage
                  src={shots[1].src}
                  alt={shots[1].alt}
                  width={320}
                  height={320}
                  sizes="160px"
                  speed={0.05}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5">
              <PerspectiveEntrance distance={60} rotateX={12}>
                <div className="relative overflow-hidden rounded-2xl bg-paper-2" data-reveal="mask">
                  <ParallaxImage
                    src={shots[2].src}
                    alt={shots[2].alt}
                    width={800}
                    height={600}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    speed={0.1}
                    className="reveal-media aspect-[4/3]"
                  />
                </div>
              </PerspectiveEntrance>
              <PerspectiveEntrance distance={60} rotateX={12}>
                <div className="relative overflow-hidden rounded-2xl bg-paper-2" data-reveal="mask">
                  <ParallaxImage
                    src={shots[3].src}
                    alt={shots[3].alt}
                    width={800}
                    height={600}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    speed={0.1}
                    className="reveal-media aspect-[4/3]"
                  />
                </div>
              </PerspectiveEntrance>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
