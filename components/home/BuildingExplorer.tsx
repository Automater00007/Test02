"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { useAutoRotate } from "@/lib/useAutoRotate";
import { photo } from "@/lib/photos";

/* One photograph per floor, from the arrival up to the attic rooms. */
const floorShots = [
  photo("entrance"),
  photo("suite-king-1"),
  photo("balcony"),
  photo("suite-attic-3"),
  photo("suite-attic-1"),
];

const floors = [
  {
    label: "Ground",
    title: "Arrival",
    body: "The stone drive, the glass canopy, reception and the dining room. The lawn opens immediately behind the house.",
    image: floorShots[0],
  },
  {
    label: "First",
    title: "The first rooms",
    body: "The first of the room floors. King beds, warm timber and balconies turned toward the lawn or the valley.",
    image: floorShots[1],
  },
  {
    label: "Second",
    title: "The long view",
    body: "Mid-house, where the balconies sit level with the pines and the light arrives across the roof of the neighbouring wing.",
    image: floorShots[2],
  },
  {
    label: "Third",
    title: "Above the lawn",
    body: "The upper rooms look over the garden, the rope chairs and the road that folds away toward Pahalgam.",
    image: floorShots[3],
  },
  {
    label: "Fourth",
    title: "Under the roof",
    body: "The three attic rooms sit closest to the roof, where the light arrives early and leaves late. Quiet, timber-lined, private.",
    image: floorShots[4],
  },
];

export default function BuildingExplorer() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const {
    index: active,
    select,
    advance,
    hoverProps,
    swipeProps,
  } = useAutoRotate(floors.length, 4200, reduce);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="building-heading"
      {...hoverProps()}
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
              className="mt-6 text-[clamp(2.1rem,3.9vw,3.9rem)] font-bold leading-[0.96] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              Walk the stack from the stone drive to the attic rooms.
            </p>

            <div className="mt-10 border-t border-line">
              {floors.map((f, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
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
                        isActive ? "text-ink" : "text-ink/65 group-hover:text-ink/80"
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
                className="max-w-md text-[0.95rem] leading-[1.7] text-ink/85"
              >
                {floors[active].body}
              </motion.p>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-deep sm:aspect-[16/10] md:aspect-auto md:h-full md:min-h-[640px]"
              data-reveal="mask"
              {...hoverProps(advance)}
              {...swipeProps}
            >
              {floors.map((f, i) => (
                <motion.div
                  key={f.label}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    scale: i === active ? 1 : 1.06,
                  }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={f.image}
                    alt={`${f.label} floor — ${f.title}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    loading={i === 0 ? "eager" : "lazy"}
                    className="reveal-media object-cover"
                  />
                </motion.div>
              ))}
              {/* Legibility wash — photographic, never opaque */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 sm:p-7">
                <div>
                  <p className="eyebrow text-ivory/75">
                    {String(active + 1).padStart(2, "0")} — {floors[active].label} floor
                  </p>
                  <p className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-bold leading-[1.02] text-ivory">
                    {floors[active].title}
                  </p>
                </div>
                <span className="tabular shrink-0 pb-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ivory/70">
                  {String(active + 1).padStart(2, "0")} / {String(floors.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Slim floor ticks — a tap jumps straight to a floor */}
            <div className="mt-3 flex items-center gap-1.5">
              {floors.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Show the ${f.label} floor`}
                  aria-current={i === active}
                  className="grid h-10 flex-1 place-items-center rounded-full transition-colors hover:bg-ink/5"
                >
                  <span
                    className={`h-1 w-full rounded-full transition-colors duration-500 ${
                      i === active ? "bg-crimson" : "bg-ink/15"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
