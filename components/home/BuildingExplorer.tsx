"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import SplitText from "@/components/ui/SplitText";

const floors = [
  {
    label: "Ground",
    title: "Arrival",
    body: "The stone drive, the glass canopy, reception and the dining room. The lawn opens immediately behind the house.",
    image: "/images/twin/entrance.webp",
  },
  {
    label: "First",
    title: "The first rooms",
    body: "The first of the room floors. King beds, warm timber and balconies turned toward the lawn or the valley.",
    image: "/images/twin/suite-king-1.webp",
  },
  {
    label: "Second",
    title: "The long view",
    body: "Mid-house, where the balconies sit level with the pines and the light arrives across the roof of the neighbouring wing.",
    image: "/images/twin/suite-king-2.webp",
  },
  {
    label: "Third",
    title: "Above the lawn",
    body: "The upper rooms look over the garden, the rope chairs and the road that folds away toward Pahalgam.",
    image: "/images/twin/suite-king-3.webp",
  },
  {
    label: "Fourth",
    title: "Under the roof",
    body: "The attic rooms sit closest to the roof, where the light arrives early and leaves late. Quiet, timber-lined, private.",
    image: "/images/twin/suite-attic-1.webp",
  },
];

export default function BuildingExplorer() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-12, 0, 12]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);
  const floatY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % floors.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [reduce, paused]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="building-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">01 — The building</span>
            </div>
            <SplitText
              text="Five floors, one roof."
              as="h2"
              id="building-heading"
              className="mt-6 text-[clamp(2.3rem,5vw,4.8rem)] font-bold leading-[0.96] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              Two towers share a single steep roof. Walk the stack from the stone
              drive to the attic rooms and see how the house is put together.
            </p>

            <div className="mt-10 border-t border-line">
              {floors.map((f, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    aria-pressed={isActive}
                    className="group flex w-full items-baseline gap-4 border-b border-line py-3.5 text-left"
                  >
                    <span
                      className={`tabular text-[0.62rem] font-semibold transition-colors ${
                        isActive ? "text-crimson" : "text-stone"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-[0.95rem] font-medium transition-colors ${
                        isActive ? "text-ink" : "text-ink/55 group-hover:text-ink/80"
                      }`}
                    >
                      {f.label} floor · {f.title}
                    </span>
                    <span
                      className={`ml-auto h-px transition-all duration-500 ${
                        isActive ? "w-10 bg-crimson" : "w-4 bg-ink/15"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-7 min-h-[92px]">
              <motion.p
                key={floors[active].title}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md text-[0.95rem] leading-[1.7] text-ink/70"
              >
                {floors[active].body}
              </motion.p>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7" style={{ perspective: 1600 }}>
            <div
              className="relative flex min-h-[420px] items-center justify-center md:min-h-[560px]"
              data-reveal="zoom"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* soft floor shadow */}
              <div className="absolute bottom-10 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-ink/10 blur-2xl" />

              <motion.div
                className="relative w-full max-w-[430px]"
                style={
                  reduce
                    ? { transformStyle: "preserve-3d" }
                    : { rotateY, rotateX, y: floatY, transformStyle: "preserve-3d" }
                }
              >
                {/* shared roof sits above the top floor */}
                <div className="mx-auto mb-1 h-2 w-[92%] rounded-full bg-ink/15" />
                <div className="mx-auto mb-2 h-1 w-[70%] rounded-full bg-ink/10" />

                <div className="flex flex-col-reverse gap-1.5">
                  {floors.map((f, i) => {
                    const isActive = i === active;
                    return (
                      <motion.button
                        key={f.label}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Explore the ${f.label} floor`}
                        className="relative mx-auto block w-[82%] overflow-hidden rounded-xl border border-line bg-paper text-left"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{
                          z: isActive ? 80 : 0,
                          x: isActive ? 26 : 0,
                          rotateY: isActive ? -7 : 0,
                          scale: isActive ? 1.035 : 1,
                          opacity: isActive ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="relative h-[58px] md:h-[66px]">
                          <Image
                            src={f.image}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 360px, 80vw"
                            loading="lazy"
                            className="object-cover"
                          />
                          <div
                            className={`absolute inset-0 transition-colors duration-500 ${
                              isActive ? "bg-paper/55" : "bg-paper/82"
                            }`}
                          />
                          <div className="absolute inset-0 flex items-center gap-3 px-4">
                            <span
                              className={`tabular text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${
                                isActive ? "text-crimson" : "text-stone"
                              }`}
                            >
                              {f.label}
                            </span>
                            <span className="text-[0.78rem] font-semibold tracking-[-0.01em] text-ink">
                              {f.title}
                            </span>
                            <span
                              className={`ml-auto h-1.5 w-1.5 rounded-full transition-colors ${
                                isActive ? "bg-crimson" : "bg-ink/20"
                              }`}
                            />
                          </div>
                        </div>
                        {/* thin slab edge */}
                        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
                      </motion.button>
                    );
                  })}
                </div>

              </motion.div>

              {/* floating current-floor photograph */}
              <div className="pointer-events-none absolute -bottom-2 -right-1 hidden h-28 w-40 rotate-3 overflow-hidden rounded-xl border-4 border-paper shadow-[0_24px_60px_-20px_rgba(42,26,14,0.45)] md:block">
                {floors.map((f, i) => (
                  <motion.div
                    key={f.label}
                    className="absolute inset-0"
                    animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.08 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={f.image}
                      alt=""
                      fill
                      sizes="160px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
