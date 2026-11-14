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

/* TEMP: internet test images for the floor cards. Swap back to the local
   property library (`imagePool`) once the user is done testing. */
const floorShots = [
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
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
    body: "The attic rooms sit closest to the roof, where the light arrives early and leaves late. Quiet, timber-lined, private.",
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
  } = useAutoRotate(floors.length, 3600, reduce);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-12, 0, 12]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);
  const floatY = useTransform(scrollYProgress, [0, 1], [18, -18]);

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

          <div className="md:col-span-6 md:col-start-7" style={{ perspective: 1600 }}>
            <div
              className="relative flex min-h-[440px] touch-pan-y items-center justify-center md:min-h-[640px]"
              data-reveal="zoom"
              {...hoverProps(advance)}
              {...swipeProps}
            >
              {/* soft floor shadow */}
              <div className="absolute bottom-10 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-ink/10 blur-2xl" />

              <motion.div
                className="relative w-full max-w-[560px]"
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
                        onClick={() => select(i)}
                        aria-label={`Explore the ${f.label} floor`}
                        className="relative mx-auto block w-[88%] overflow-hidden rounded-xl border border-line bg-paper text-left"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{
                          z: isActive ? 120 : 0,
                          x: isActive ? 28 : 0,
                          rotateY: isActive ? -7 : 0,
                          scale: isActive ? 1.035 : 1,
                          opacity: 1,
                        }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="relative h-[68px] md:h-[116px]">
                          <Image
                            src={f.image}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 560px, 88vw"
                            loading="lazy"
                            className="object-cover"
                          />
                          {/* Small translucent chip keeps the label legible
                              without washing the photograph. */}
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="flex items-center gap-3 rounded-lg bg-paper/90 px-3 py-2 shadow-[0_2px_12px_rgba(42,26,14,0.18)] backdrop-blur-[3px]">
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
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                  isActive ? "bg-crimson" : "bg-ink/20"
                                }`}
                              />
                            </span>
                          </div>
                        </div>
                        {/* thin slab edge */}
                        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
                      </motion.button>
                    );
                  })}
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
