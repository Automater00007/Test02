"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import ParallaxImage from "@/components/ui/ParallaxImage";
import SplitText from "@/components/ui/SplitText";

const timings = [
  { k: "Breakfast", v: "7:30 – 10:00 AM" },
  { k: "Lunch", v: "12:30 – 3:00 PM" },
  { k: "Dinner", v: "7:00 – 10:00 PM" },
];

export default function Restaurant() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 42%"] });
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const clipPath = useTransform(
    eased,
    [0, 1],
    ["circle(8% at 50% 50%)", "circle(140% at 50% 50%)"],
  );
  const scale = useTransform(eased, [0, 1], [1.24, 1]);
  const rotateY = useTransform(eased, [0, 1], [-9, 0]);
  const radius = useTransform(eased, [0, 1], ["2rem", "1.5rem"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="restaurant-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6" style={{ perspective: 1200 }}>
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-paper-2 shadow-[0_30px_80px_-40px_rgba(42,26,14,0.4)]"
              style={
                reduce
                  ? undefined
                  : ({ clipPath, scale, rotateY, borderRadius: radius, transformPerspective: 1300 } as never)
              }
            >
                <ParallaxImage
                  src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=80"
                  alt="The restaurant at Twin Towers by Defoy"
                  width={1600}
                  height={900}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  speed={0.08}
                  className="reveal-media aspect-[4/3]"
                />
                <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-ivory/20" />
            </motion.div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">06 — Dining</span>
            </div>
            <SplitText
              text="A small dining room that feels like a house."
              as="h2"
              id="restaurant-heading"
              className="mt-6 text-[clamp(2.1rem,3.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal>
              Ask the team what is fresh from the valley. The kitchen cooks for the
              house, not for a crowd — and it shows.
            </p>

            <dl className="mt-10 border-t border-line">
              {timings.map((t, i) => (
                <div
                  key={t.k}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-3.5"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone">{t.k}</dt>
                  <dd className="text-[0.94rem] font-medium">{t.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-5" data-reveal="zoom">
              <Link href="/dining" className="btn btn-ghost">
                See the dining page
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
