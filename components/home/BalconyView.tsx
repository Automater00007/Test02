"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { useAutoRotate } from "@/lib/useAutoRotate";

const scenes = [
  {
    key: "sunrise",
    label: "Sunrise",
    note: "First light",
    body: "The valley wakes before the house does. The balcony is the first place the sun reaches.",
    image: "/images/twin/balcony.webp",
    wash: "from-[#b25b2a]/55 via-[#e9a15c]/20 to-transparent",
    tint: "#d98a4a",
  },
  {
    key: "midday",
    label: "Midday",
    note: "Clear light",
    body: "The pines hold still, the lawn goes bright, and the mountains sit sharply against the sky.",
    image: "/images/twin/lawn.webp",
    wash: "from-[#432911]/25 via-transparent to-transparent",
    tint: "#7b6a4f",
  },
  {
    key: "golden",
    label: "Golden hour",
    note: "Last warmth",
    body: "The light turns amber and everything on the balcony — the railing, the chair, the cup — goes warm.",
    image: "/images/twin/exterior.webp",
    wash: "from-[#9c4f1f]/60 via-[#dda04a]/22 to-transparent",
    tint: "#c47a32",
  },
  {
    key: "night",
    label: "Night",
    note: "After dark",
    body: "The valley disappears into the dark and the sky takes over. A last look before the door closes.",
    image: "/images/twin/lounge.webp",
    wash: "from-[#1b2238]/70 via-[#2a1a0e]/35 to-transparent",
    tint: "#4a5068",
  },
];

export default function BalconyView() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const {
    index: active,
    select,
    advance,
    hoverProps,
    swipeProps,
  } = useAutoRotate(scenes.length, 4200, reduce);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-4, 0, 4]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="balcony-heading"
      {...hoverProps()}
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">07 — The balcony</span>
            </div>
            <SplitText
              text="The balcony, hour by hour."
              as="h2"
              id="balcony-heading"
              className="mt-6 text-[clamp(2.1rem,3.7vw,3.7rem)] font-bold leading-[0.97] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              Every room has one. The view does the rest. Watch the same balcony
              change from first light to after dark.
            </p>

            <div className="mt-10 border-t border-line">
              {scenes.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    aria-pressed={isActive}
                    className="group flex w-full items-center gap-4 border-b border-line py-3.5 text-left"
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-colors ${
                        isActive ? "bg-crimson" : "bg-ink/20"
                      }`}
                    />
                    <span
                      className={`text-[0.95rem] font-medium transition-colors ${
                        isActive ? "text-ink" : "text-ink/55 group-hover:text-ink/80"
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="ml-auto text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-stone">
                      {s.note}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex gap-1.5" aria-hidden="true">
              {scenes.map((s, i) => (
                <span
                  key={s.key}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                    i === active ? "bg-crimson" : "bg-ink/12"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7" style={{ perspective: 1500 }}>
            <div
              className="relative touch-pan-y"
              data-reveal="mask"
              {...hoverProps(advance)}
              {...swipeProps}
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl bg-paper-2 shadow-[0_40px_100px_-40px_rgba(42,26,14,0.45)]"
                style={
                  reduce
                    ? undefined
                    : { rotateX, rotateY, transformStyle: "preserve-3d" }
                }
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.div className="absolute inset-0" style={reduce ? undefined : { y: imageY }}>
                    {scenes.map((s, i) => (
                      <motion.div
                        key={s.key}
                        className="absolute inset-0"
                        animate={{
                          opacity: i === active ? 1 : 0,
                          scale: i === active ? 1 : 1.08,
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Image
                          src={s.image}
                          alt={`${s.label} from the balcony at Twin Towers by Defoy`}
                          fill
                          sizes="(min-width: 768px) 60vw, 100vw"
                          quality={82}
                          loading={i === 0 ? "eager" : "lazy"}
                          className="object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${s.wash}`}
                          style={{ mixBlendMode: "multiply" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep/55 via-transparent to-transparent" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
                    <div>
                      <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-ivory/70">
                        {scenes[active].note}
                      </span>
                      <p className="mt-1 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-bold leading-none tracking-[-0.03em] text-ivory">
                        {scenes[active].label}
                      </p>
                    </div>
                    <span className="tabular text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory/70">
                      {String(active + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 flex items-start gap-4">
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: scenes[active].tint }}
                />
                <motion.p
                  key={scenes[active].key}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-md text-[0.95rem] leading-[1.7] text-ink/70"
                >
                  {scenes[active].body}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
