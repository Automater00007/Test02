"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, useReducedMotion, motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";

const steps = [
  { time: "2:00 PM", title: "Arrival", body: "The drive ends at the stone gate. Someone is already at the door with a key and a cup of kahwa. The room is warm. The balcony is waiting." },
  { time: "4:30 PM", title: "The lawn", body: "Rope chairs, glass tables, a pot of kahwa. The afternoon is yours; the mountain does not mind if you do nothing at all." },
  { time: "7:30 PM", title: "Dinner", body: "The restaurant opens for the evening. Ask the team what is fresh from the valley. The dining room is small, so it feels like a house." },
  { time: "9:00 PM", title: "The night", body: "Back upstairs, the timber warms the room. A last look at the balcony before the stars take over the sky." },
];

export default function DayTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 40%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const height = useTransform(draw, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative py-20 md:py-32" aria-labelledby="day-heading">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/65" data-reveal>
              Your first day
            </span>
            <SplitText
              text="Arrive. Exhale. Let the valley set the pace."
              as="h2"
              id="day-heading"
              className="mt-4 text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal>
              A day at Twin Towers by Defoy, from the moment the drive ends to the last look at the
              balcony. Nothing is scheduled; everything is suggested.
            </p>
          </div>

          <div className="md:col-span-7 md:col-start-6" ref={ref}>
            <div className="relative pl-10">
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-line" />
              <motion.div
                className="absolute left-[9px] top-2 w-px bg-clay"
                style={{ height: reduce ? "100%" : height }}
              />
              <ol className="space-y-10">
                {steps.map((s, i) => (
                  <li key={s.time} className="relative" data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                    <span className="absolute -left-10 top-1 h-[19px] w-[19px] rounded-full border border-line bg-paper" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">{s.time}</p>
                    <h3 className="mt-2 text-[1.5rem] leading-tight tracking-[-0.02em]">{s.title}</h3>
                    <p className="mt-3 max-w-[44ch] text-[0.95rem] leading-[1.7] text-ink/75">{s.body}</p>
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
