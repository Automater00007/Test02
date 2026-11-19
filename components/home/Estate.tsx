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
  { k: "Rooms", v: "25 — 22 premium · 3 attic" },
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
 * The photographic collage: six cards scrub in from different sides as the
 * section crosses the viewport — a deck settling onto the page rather than a
 * static grid. Reduced-motion users get a plain 3×2 grid.
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
          data-reveal="mask"
          className={`relative ${card.aspect} overflow-hidden rounded-2xl border border-ivory/15 bg-deep shadow-[0_30px_70px_-28px_rgba(10,7,4,0.7)]`}
        >
          <Image
            src={card.src}
            alt={card.alt}
            fill
            sizes="(min-width: 768px) 34vw, 60vw"
            quality={75}
            loading="lazy"
            className="reveal-media object-cover"
          />
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ivory/10" />
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
      className="relative overflow-hidden bg-walnut py-20 text-ivory md:py-32"
      aria-labelledby="estate-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-sand" />
              <span className="eyebrow text-sand">02 — The house</span>
            </div>

            <SplitText
              text="Two halves, one roof."
              as="h2"
              id="estate-heading"
              className="mt-6 text-[clamp(2.4rem,4vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em] text-ivory"
            />

            <p className="mt-8 max-w-md text-[clamp(0.97rem,1.05vw,1.08rem)] leading-[1.72] text-ivory/75" data-reveal="fade">
              White render, red brick, black steel, a steep grey roof. Twenty-five
              rooms, each with a balcony. The lawn is the living room.
            </p>

            <dl className="mt-10 border-t border-line-light">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line-light py-3.5"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-sand">{f.k}</dt>
                  <dd className="text-[0.94rem] font-medium text-ivory">{f.v}</dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ivory/65"
              data-reveal="fade"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-sand" />
              {site.coordsDisplay}
            </p>
          </div>

          {/* Desktop: scrubbed collage — cards settle in from four sides. */}
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
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ivory/15"
                  >
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      sizes="30vw"
                      quality={75}
                      className="object-cover"
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

      {/* Mobile: full-bleed swipeable cards. */}
      <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:hidden">
        {CARDS.map((c, i) => (
          <figure
            key={c.src}
            data-reveal="mask"
            className="relative w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-ivory/15 bg-deep shadow-[0_24px_60px_-24px_rgba(10,7,4,0.7)]"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="82vw"
                quality={75}
                loading="lazy"
                className="reveal-media object-cover"
              />
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/25 to-transparent"
                aria-hidden="true"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                <span className="block text-[0.9rem] font-semibold leading-snug text-ivory">
                  {c.label}
                </span>
                <span className="mt-1 block truncate text-[0.58rem] font-medium uppercase tracking-[0.14em] text-ivory/70">
                  {c.caption}
                </span>
              </span>
              <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-deep/80 px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-ivory/85">
                {String(i + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
              </span>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
