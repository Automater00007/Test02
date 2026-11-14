"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";
import { imagePool } from "@/lib/imagePool";

const facts = [
  { k: "Rooms", v: "25, one category" },
  { k: "Floors", v: "Ground + 4" },
  { k: "Check-in", v: "2:00 PM" },
  { k: "Check-out", v: "12:00 noon" },
];

const exterior = imagePool.find((i) => i.src.endsWith("exterior.webp")) ?? imagePool[0];
const balcony = imagePool.find((i) => i.src.endsWith("balcony.webp")) ?? imagePool[6];
const facade = imagePool.find((i) => i.src.endsWith("facade.webp")) ?? imagePool[1];
const lawn = imagePool.find((i) => i.src.endsWith("lawn.webp")) ?? imagePool[3];
const restaurant = imagePool.find((i) => i.src.endsWith("restaurant.webp")) ?? imagePool[7];
const lounge = imagePool.find((i) => i.src.endsWith("lounge.webp")) ?? imagePool[4];

const shots = [exterior, balcony, facade, lawn, restaurant, lounge];

/**
 * Final layout of the photographic collage, and the direction each card
 * flies in from. The user asked for the "04 Layers" stacked-card feeling to
 * live here on The House, so the photographs scrub in from four sides as the
 * section crosses the viewport — a deck settling onto the page rather than a
 * static grid.
 */
const CARDS = [
  {
    src: shots[0].src,
    alt: shots[0].alt,
    label: "The house",
    caption: "Against the pines",
    left: "0%",
    top: "2%",
    width: "48%",
    aspect: "aspect-[4/3]",
    rotate: -2,
    z: 10,
    from: { x: -150, y: 60, rotate: -14 },
    window: [0, 0.5] as const,
  },
  {
    src: shots[1].src,
    alt: shots[1].alt,
    label: "From the balcony",
    caption: "Balcony in every room",
    left: "52%",
    top: "2%",
    width: "48%",
    aspect: "aspect-[4/3]",
    rotate: 2.5,
    z: 20,
    from: { x: 0, y: -160, rotate: 12 },
    window: [0.08, 0.58] as const,
  },
  {
    src: shots[2].src,
    alt: shots[2].alt,
    label: "The twin towers",
    caption: "Timber and brick",
    left: "0%",
    top: "35%",
    width: "48%",
    aspect: "aspect-[4/3]",
    rotate: 2,
    z: 30,
    from: { x: 0, y: 150, rotate: 10 },
    window: [0.18, 0.66] as const,
  },
  {
    src: shots[3].src,
    alt: shots[3].alt,
    label: "The lawn",
    caption: "Rope chairs and valley",
    left: "52%",
    top: "35%",
    width: "48%",
    aspect: "aspect-[4/3]",
    rotate: -1.5,
    z: 40,
    from: { x: 150, y: 60, rotate: 11 },
    window: [0.28, 0.76] as const,
  },
  {
    src: shots[4].src,
    alt: shots[4].alt,
    label: "The kitchen",
    caption: "Wood fire and calm",
    left: "0%",
    top: "68%",
    width: "48%",
    aspect: "aspect-[4/3]",
    rotate: -1.5,
    z: 50,
    from: { x: -150, y: 70, rotate: -12 },
    window: [0.4, 0.88] as const,
  },
  {
    src: shots[5].src,
    alt: shots[5].alt,
    label: "The lounge",
    caption: "Warm lighting",
    left: "52%",
    top: "68%",
    width: "48%",
    aspect: "aspect-[4/3]",
    rotate: 2,
    z: 60,
    from: { x: 150, y: 70, rotate: 12 },
    window: [0.5, 0.95] as const,
  },
];

function FanCard({
  card,
  progress,
}: {
  card: (typeof CARDS)[number];
  progress: MotionValue<number>;
}) {
  const local = useTransform(
    progress,
    [card.window[0], card.window[1]],
    [0, 1],
    { clamp: true },
  );
  const x = useTransform(local, [0, 1], [card.from.x, 0]);
  const y = useTransform(local, [0, 1], [card.from.y, 0]);
  const rotate = useTransform(local, [0, 1], [card.from.rotate, card.rotate]);
  const scale = useTransform(local, [0, 1], [0.72, 1]);
  const opacity = useTransform(local, [0, 0.35], [0, 1]);

  return (
    <div
      className="absolute"
      style={{ left: card.left, top: card.top, width: card.width, zIndex: card.z }}
    >
      <motion.figure
        style={{
          x,
          y,
          rotate,
          scale,
          opacity,
          willChange: "transform, opacity",
        }}
        className="relative"
      >
        <div
          className={`relative ${card.aspect} overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-[0_30px_70px_-28px_rgba(42,26,14,0.5)]`}
        >
          <Image
            src={card.src}
            alt={card.alt}
            fill
            sizes="(min-width: 768px) 34vw, 60vw"
            quality={82}
            loading="lazy"
            className="object-cover "
          />
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/10" />
          <span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep/85 via-deep/30 to-transparent p-4 pt-14">
            <span className="block text-[0.8rem] font-semibold leading-snug text-ivory">
              {card.label}
            </span>
            <span className="mt-0.5 block truncate text-[0.58rem] font-medium uppercase tracking-[0.14em] text-ivory/70">
              {card.caption}
            </span>
          </span>
        </div>
      </motion.figure>
    </div>
  );
}

export default function Estate() {
  const reduce = useReducedMotion();
  const fanRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: fanRef,
    offset: ["start 90%", "end 55%"],
  });

  return (
    <section
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="estate-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">02 — The house</span>
            </div>

            <SplitText
              text="A house of two halves, held together by the roof."
              as="h2"
              id="estate-heading"
              className="mt-6 text-[clamp(2.1rem,3.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />

            <p className="body-copy mt-8 max-w-md" data-reveal="fade">
              White render meets red brick, black steel balconies and a steep grey
              roof. The twin towers hold 25 rooms, each with a balcony turned toward
              the mountains. The lawn in front is the living room of the estate.
            </p>

            <dl className="mt-10 border-t border-line">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-3.5"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone">{f.k}</dt>
                  <dd className="text-[0.94rem] font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-stone"
              data-reveal="fade"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-crimson" />
              {site.coordsDisplay}
            </p>
          </div>

          {/* Desktop: scrubbed "cards settling onto the page" collage. */}
          <div
            ref={fanRef}
            className="relative hidden h-[640px] md:col-span-6 md:col-start-7 md:block"
            style={{ perspective: 1500 }}
          >
            {reduce ? (
              <div className="grid h-full grid-cols-3 content-center gap-3">
                {CARDS.map((c) => (
                  <figure
                    key={c.src}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line"
                  >
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      sizes="30vw"
                      className="object-cover "
                    />
                  </figure>
                ))}
              </div>
            ) : (
              CARDS.map((card) => (
                <FanCard key={card.src} card={card} progress={scrollYProgress} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile: swipeable photo strip instead of the scrubbed collage. */}
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:hidden">
        {CARDS.map((c) => (
          <figure
            key={c.src}
            className="w-[76vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-line bg-paper-2"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="76vw"
                quality={82}
                loading="lazy"
                className="object-cover "
              />
            </div>
            <figcaption className="px-4 py-3 text-[0.82rem] font-medium">
              {c.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
