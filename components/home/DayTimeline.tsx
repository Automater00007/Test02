"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import SplitText from "@/components/ui/SplitText";

const steps = [
  {
    time: "2:00 PM",
    title: "Arrive",
    body: "The drive ends at the stone gate. Someone is already at the door with a key and a cup of kahwa. The room is warm. The balcony is waiting.",
  },
  {
    time: "4:30 PM",
    title: "Unwind",
    body: "Rope chairs, glass tables, a pot of kahwa. The afternoon is yours; the mountain does not mind if you do nothing at all.",
  },
  {
    time: "7:30 PM",
    title: "Dine",
    body: "The restaurant opens for the evening. Ask the team what is fresh from the valley. The dining room is small, so it feels like a house.",
  },
  {
    time: "9:00 PM",
    title: "Explore",
    body: "Back upstairs, the timber warms the room. A last look at the balcony before the stars take over the sky.",
  },
];

export default function DayTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 55%"],
  });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const height = useTransform(draw, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative bg-paper-2 py-20 md:py-32" aria-labelledby="day-heading">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">05 — Your first day</span>
            </div>
            <SplitText
              text="Arrive. Exhale. Let the valley set the pace."
              as="h2"
              id="day-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal>
              A day at Twin Towers by Defoy, from the moment the drive ends to the last
              look at the balcony. Nothing is scheduled; everything is suggested.
            </p>
            <p
              className="mt-8 inline-flex items-center gap-3 bg-blush px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-crimson"
              data-reveal="zoom"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-crimson" />
              Check-in 2:00 PM · Check-out 12:00 noon
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7" ref={ref}>
            <div className="relative pl-9 md:pl-12">
              <div className="absolute bottom-2 left-[5px] top-2 w-px bg-mist md:left-[7px]" />
              <motion.div
                className="absolute left-[5px] top-2 w-px origin-top bg-crimson md:left-[7px]"
                style={{ height: reduce ? "100%" : height }}
              />

              <ol className="space-y-5 md:space-y-6">
                {steps.map((s, i) => (
                  <li
                    key={s.time}
                    className="group relative"
                    data-reveal="card"
                    style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
                  >
                    <span className="absolute -left-9 top-6 h-3 w-3 rounded-full border-2 border-crimson bg-paper-2 transition-colors duration-300 group-hover:bg-crimson md:-left-12 md:h-[15px] md:w-[15px]" />

                    <div className="border border-transparent bg-paper p-5 transition-[border-color,transform] duration-500 group-hover:-translate-y-1 group-hover:border-mist md:p-7">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="tabular font-display text-[1.5rem] font-bold leading-none text-crimson md:text-[1.9rem]">
                          {s.time}
                        </span>
                        <span className="tabular text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone">
                          0{i + 1} / 04
                        </span>
                      </div>
                      <h3 className="mt-4 text-[1.35rem] font-bold leading-tight tracking-[-0.02em] md:text-[1.6rem]">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 max-w-[46ch] text-[0.93rem] leading-[1.7] text-ink/70">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
