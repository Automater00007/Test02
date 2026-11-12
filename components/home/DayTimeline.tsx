"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import SplitText from "@/components/ui/SplitText";

const steps = [
  {
    label: "First",
    title: "Arrive",
    image: "/images/twin/exterior.webp",
    body: "The drive ends at the stone gate. Someone is already at the door with a key and a cup of kahwa. The room is warm. The balcony is waiting.",
  },
  {
    label: "Then",
    title: "Unwind",
    image: "/images/twin/lawn.webp",
    body: "Rope chairs, glass tables, a pot of kahwa. The afternoon is yours; the mountain does not mind if you do nothing at all.",
  },
  {
    label: "Later",
    title: "Dine",
    image: "/images/twin/restaurant.webp",
    body: "The restaurant opens for the evening. Ask the team what is fresh from the valley. The dining room is small, so it feels like a house.",
  },
  {
    label: "Last",
    title: "Explore",
    image: "/images/twin/balcony.webp",
    body: "Back upstairs, the timber warms the room. A last look at the balcony before the stars take over the sky.",
  },
];

export default function DayTimeline() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section className="relative overflow-x-clip bg-paper-2" aria-labelledby="day-heading">
      <div className="shell py-20 md:pt-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">09 — Your first day</span>
            </div>
            <SplitText
              text="Arrive. Exhale. Let the valley set the pace."
              as="h2"
              id="day-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
          </div>
          <p className="body-copy md:col-span-4 md:col-start-9" data-reveal="fade">
            A day at Twin Towers by Defoy, from the moment the drive ends to the last
            look at the balcony. Nothing is scheduled; everything is suggested.
          </p>
        </div>
      </div>

      {reduce ? (
        <div className="shell grid gap-5 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <article key={s.title} className="overflow-hidden rounded-3xl bg-paper">
              <div className="relative aspect-[4/5]">
                <Image src={s.image} alt={`${s.title} at Twin Towers by Defoy`} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="eyebrow text-crimson">{s.label}</p>
                <h3 className="mt-2 text-[1.4rem] font-bold leading-tight">{s.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-[1.7] text-ink/70">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div ref={stageRef} className="relative hidden h-[320vh] md:block">
            <div className="sticky top-0 flex h-svh items-center overflow-hidden">
              {/* full-bleed scene backgrounds */}
              <div className="absolute inset-0" aria-hidden="true">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.title}
                    className="absolute inset-0"
                    animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image src={s.image} alt="" fill sizes="100vw" className="object-cover opacity-25" />
                  </motion.div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-paper-2/92 via-paper-2/78 to-paper-2" />
              </div>

              <div className="shell relative z-10 w-full">
                <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
                  <div className="md:col-span-5">
                    <div className="flex items-center gap-3">
                      <span className="tabular text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-crimson">
                        0{active + 1} / 04
                      </span>
                      <span className="h-px w-8 bg-crimson/40" />
                      <span className="eyebrow text-stone">{steps[active].label}</span>
                    </div>
                    <motion.h3
                      key={steps[active].title}
                      initial={{ opacity: 0, y: 16, rotateX: -20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-5 font-display text-[clamp(3rem,6vw,5.4rem)] font-bold leading-[0.9] tracking-[-0.05em]"
                    >
                      {steps[active].title}
                    </motion.h3>
                    <motion.p
                      key={`${steps[active].title}-body`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 max-w-[42ch] text-[0.98rem] leading-[1.75] text-ink/70"
                    >
                      {steps[active].body}
                    </motion.p>

                    <div className="mt-9 flex gap-1.5" aria-hidden="true">
                      {steps.map((s, i) => (
                        <span
                          key={s.title}
                          className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                            i <= active ? "bg-crimson" : "bg-ink/12"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-6 md:col-start-7" style={{ perspective: 1600 }}>
                    <div className="relative h-[clamp(340px,42vw,520px)]">
                      {steps.map((s, i) => {
                        const isActive = i === active;
                        return (
                          <motion.figure
                            key={s.title}
                            onMouseEnter={() => setActive(i)}
                            className="absolute inset-0 overflow-hidden rounded-[26px] bg-paper shadow-[0_40px_100px_-40px_rgba(42,26,14,0.5)]"
                            style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                            animate={{
                              opacity: isActive ? 1 : 0,
                              z: isActive ? 0 : -220,
                              rotateY: isActive ? 0 : i < active ? -24 : 24,
                              y: isActive ? 0 : 50,
                              scale: isActive ? 1 : 0.86,
                            }}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Image
                              src={s.image}
                              alt={`${s.title} at Twin Towers by Defoy`}
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              quality={82}
                              loading={i === 0 ? "eager" : "lazy"}
                              className="object-cover"
                            />
                            <span className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-ivory/20" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/70 via-deep/10 to-transparent p-6 pt-16">
                              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-ivory/70">
                                {s.label}
                              </span>
                              <p className="mt-1 font-display text-[1.5rem] font-bold leading-none tracking-[-0.03em] text-ivory">
                                {s.title}
                              </p>
                            </div>
                          </motion.figure>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 px-5 pb-20 md:hidden">
            {steps.map((s, i) => (
              <article
                key={s.title}
                className="overflow-hidden rounded-3xl bg-paper"
                data-reveal="card"
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={s.image} alt={`${s.title} at Twin Towers by Defoy`} fill sizes="100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="eyebrow text-crimson">{s.label}</p>
                  <h3 className="mt-2 text-[1.4rem] font-bold leading-tight">{s.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-[1.7] text-ink/70">{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
