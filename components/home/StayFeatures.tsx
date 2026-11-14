"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { pickImages } from "@/lib/imagePool";
import { useAutoRotate } from "@/lib/useAutoRotate";

const features = [
  { title: "Breakfast", body: "A warm breakfast included with every stay, served in the dining room or on your balcony." },
  { title: "Wi-Fi", body: "Reliable connectivity in every room and across the property." },
  { title: "Parking", body: "Complimentary on-site parking for guests arriving by road." },
  { title: "Room service", body: "Meals and kahwa brought to your room, any hour you ask." },
  { title: "Heating", body: "Warm rooms through the cold months — central heating in every room." },
  { title: "Doctor on call", body: "Medical assistance available on request, around the clock." },
];

const floats = pickImages(7, 2);

export default function StayFeatures() {
  const reduce = useReducedMotion();
  const {
    index: active,
    select,
    advance,
    hoverProps,
    swipeProps,
  } = useAutoRotate(features.length, 3400, reduce);

  return (
    <section
      className="relative overflow-x-clip bg-paper-2 py-20 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">05 — Part of every stay</span>
            </div>
            <SplitText
              text="Six small things, done properly."
              as="h2"
              id="features-heading"
              className="mt-6 text-[clamp(2.1rem,3.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              The details you stop noticing after a day — because they simply work.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink/12">
                <motion.div
                  className="h-px bg-crimson"
                  animate={{ width: `${((active + 1) / features.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="tabular text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-stone">
                {String(active + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7" style={{ perspective: 1600 }}>
            <div
              className="relative h-[360px] w-full touch-pan-y md:h-[420px]"
              data-reveal="zoom"
              {...hoverProps(advance)}
              {...swipeProps}
            >
              {/* floating depth layers behind the deck */}
              <motion.div
                className="pointer-events-none absolute -left-6 top-2 hidden h-28 w-36 overflow-hidden rounded-2xl border-4 border-paper shadow-[0_20px_50px_-20px_rgba(42,26,14,0.35)] md:block"
                animate={reduce ? undefined : { y: [0, -12, 0], rotateZ: [-3, -1, -3] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image src={floats[0].src} alt="" fill sizes="144px" className="object-cover opacity-70" />
              </motion.div>
              <motion.div
                className="pointer-events-none absolute -right-4 bottom-4 hidden h-24 w-32 overflow-hidden rounded-2xl border-4 border-paper shadow-[0_20px_50px_-20px_rgba(42,26,14,0.35)] md:block"
                animate={reduce ? undefined : { y: [0, 10, 0], rotateZ: [3, 1, 3] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image src={floats[1].src} alt="" fill sizes="128px" className="object-cover opacity-70" />
              </motion.div>

              {features.map((f, i) => {
                const offset = (i - active + features.length) % features.length;
                const hidden = offset > 4;
                return (
                  <motion.div
                    key={f.title}
                    className="absolute inset-x-0 top-0 mx-auto w-[min(92%,420px)] origin-top rounded-3xl border border-line bg-paper p-7 shadow-[0_24px_70px_rgba(42,26,14,0.12)]"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                      opacity: hidden ? 0 : 1 - offset * 0.15,
                      y: offset * 16,
                      x: offset * 9,
                      z: -offset * 72,
                      scale: 1 - offset * 0.055,
                      rotateX: offset * 3.2,
                      rotateY: -offset * 5,
                      rotateZ: offset * 1.2 * (offset % 2 === 0 ? 1 : -1),
                      zIndex: hidden ? 0 : features.length - offset,
                    }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="index-figure block text-[2.2rem] opacity-60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`mt-1 h-1.5 w-1.5 rounded-full transition-colors ${
                          offset === 0 ? "bg-crimson" : "bg-ink/15"
                        }`}
                      />
                    </div>
                    <h3 className="mt-3 text-[1.25rem] font-bold leading-tight tracking-[-0.02em]">
                      {f.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9rem] leading-[1.7] text-ink/70">{f.body}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {features.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Show ${f.title}`}
                  aria-current={i === active}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? "w-7 bg-crimson" : "w-1.5 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
