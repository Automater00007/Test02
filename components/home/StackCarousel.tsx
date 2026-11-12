"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { pickImages } from "@/lib/imagePool";

const cards = pickImages(11, 6);

export default function StackCarousel() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      className="relative overflow-x-clip bg-paper-2"
      aria-labelledby="stack-heading"
    >
      <div className="shell pt-20 md:pt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">04 — In layers</span>
            </div>
            <h2
              id="stack-heading"
              className="mt-5 max-w-[18ch] text-[clamp(2.2rem,5vw,4.8rem)] font-bold leading-[0.96] tracking-[-0.04em]"
              data-reveal="tilt"
            >
              The house, <em>in layers.</em>
            </h2>
          </div>
          <p className="max-w-sm text-[0.95rem] leading-[1.7] text-ink/70" data-reveal="fade">
            Scroll and the photographs arrive one by one, each settling a little
            further back than the last. A deck of rooms, grounds and light.
          </p>
        </div>
      </div>

      {reduce ? (
        <div className="shell grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <figure key={c.src} className="overflow-hidden rounded-3xl bg-paper">
              <div className="relative aspect-[4/5]">
                <Image src={c.src} alt={c.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="px-5 py-4 text-[0.85rem] font-medium">{c.alt}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <>
          <div ref={stageRef} className="relative mt-12 hidden h-[260vh] md:block">
            <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
              <div
                className="relative h-full w-full"
                style={{ perspective: 1800, transformStyle: "preserve-3d" }}
              >
                {cards.map((c, i) => (
                  <StackCard
                    key={c.src}
                    card={c}
                    index={i}
                    count={cards.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>

              <div className="absolute bottom-8 left-1/2 w-[min(78vw,520px)] -translate-x-1/2">
                <div className="h-px w-full bg-ink/12">
                  <motion.div className="h-px bg-crimson" style={{ width: progress }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-stone">
                  <span>Ground floor</span>
                  <span>Under the roof</span>
                </div>
              </div>
            </div>
          </div>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-20 pt-12 md:hidden">
            {cards.map((c) => (
              <figure key={c.src} className="w-[82vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-paper">
                <div className="relative aspect-[4/5]">
                  <Image src={c.src} alt={c.alt} fill sizes="82vw" className="object-cover" />
                </div>
                <figcaption className="px-4 py-3 text-[0.82rem] font-medium">{c.alt}</figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function StackCard({
  card,
  index,
  count,
  scrollYProgress,
}: {
  card: { src: string; alt: string };
  index: number;
  count: number;
  scrollYProgress: MotionValue<number>;
}) {
  const first = index === 0;
  const start = first ? 0 : 0.06 + index * 0.105;
  const end = start + 0.4;
  const local = useTransform(scrollYProgress, [start, end], [0, 1], { clamp: true });

  const mid = (count - 1) / 2;
  const finalX = (index - mid) * 13;
  const finalY = (index - mid) * 7;
  const finalZ = -index * 28;
  const finalRotY = (index - mid) * 2.2;
  const finalRotZ = (index - mid) * 0.8;

  // The first card is already on stage when the sticky scene locks, so the
  // viewer never meets an empty screen before the scroll begins.
  const x = useTransform(local, [0, 1], [first ? finalX : index % 2 === 0 ? -220 : 220, finalX]);
  const y = useTransform(local, [0, 1], [first ? finalY : 150, finalY]);
  const z = useTransform(local, [0, 1], [first ? finalZ : -520, finalZ]);
  const rotateY = useTransform(local, [0, 1], [first ? finalRotY : index % 2 === 0 ? 26 : -26, finalRotY]);
  const rotateZ = useTransform(local, [0, 1], [first ? finalRotZ : index % 2 === 0 ? -5 : 5, finalRotZ]);
  const scale = useTransform(local, [0, 1], [first ? 1 : 0.72, 1 - index * 0.018]);
  const opacity = useTransform(local, [0, first ? 0 : 0.18, 1], [first ? 1 : 0, 1, 1]);

  return (
    <div
      className="absolute left-1/2 top-1/2 w-[clamp(250px,30vw,400px)] -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: index + 1 }}
    >
      <motion.figure
        style={{
          x,
          y,
          z,
          rotateY,
          rotateZ,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-paper shadow-[0_36px_90px_-30px_rgba(42,26,14,0.5)]">
          <Image
            src={card.src}
            alt={card.alt}
            fill
            sizes="(min-width: 768px) 30vw, 82vw"
            loading="eager"
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-ink/10" />
          <span className="absolute left-4 top-4 rounded-full bg-crimson px-2.5 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-ivory">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep/75 via-deep/20 to-transparent p-5 pt-16">
            <p className="text-[0.9rem] font-medium leading-snug text-ivory">
              {card.alt}
            </p>
          </div>
        </div>
      </motion.figure>
    </div>
  );
}
