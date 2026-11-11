"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { rooms, site } from "@/lib/content";
import SplitText from "@/components/ui/SplitText";

const suiteImages: Record<string, string[]> = {
  "premium-balcony-room": [
    "/images/twin/suite-king-1.webp",
    "/images/twin/suite-king-2.webp",
    "/images/twin/suite-king-3.webp",
    "/images/twin/suite-king-4.webp",
  ],
  "attic-room": [
    "/images/twin/suite-attic-1.webp",
    "/images/twin/suite-attic-2.webp",
    "/images/twin/suite-attic-3.webp",
  ],
};

export default function Suites() {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const room = rooms[active];
  const images = suiteImages[room.slug] ?? [room.image];

  const next = () => setSlide((s) => (s + 1) % images.length);
  const prev = () => setSlide((s) => (s - 1 + images.length) % images.length);

  const paraRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: paraRef,
    offset: ["start end", "end start"],
  });
  const paraY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="relative bg-paper py-20 md:py-32" aria-labelledby="suites-heading">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">04 — Stay</span>
            </div>
            <SplitText
              text="One category. Every room with a balcony."
              as="h2"
              id="suites-heading"
              className="mt-6 text-[clamp(2.2rem,4.8vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
          </div>
          <p className="body-copy md:col-span-4 md:col-start-9" data-reveal="fade">
            All 25 rooms are Premium Rooms with Balcony — a king bed, space for an extra
            bed and a private view of the lawn or the valley.
          </p>
        </div>

        {/* Room switcher */}
        <div
          className="mt-10 flex w-full flex-col gap-1 bg-blush p-1 sm:inline-flex sm:w-auto sm:flex-row sm:flex-wrap"
          role="tablist"
          aria-label="Room type"
          data-reveal="fade"
        >
          {rooms.map((r, i) => (
            <button
              key={r.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => {
                setActive(i);
                setSlide(0);
              }}
              className={`relative w-full px-5 py-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:w-auto ${
                i === active
                  ? "bg-crimson text-ivory"
                  : "text-crimson/70 hover:text-crimson"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <div ref={paraRef} className="relative overflow-hidden bg-paper-2" data-reveal="zoom">
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.div
                  style={reduce ? undefined : { y: paraY, scale: 1.06 }}
                  className="absolute inset-0"
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                      key={`${room.slug}-${slide}`}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[slide]}
                        alt={`${room.name} at Twin Towers by Defoy`}
                        width={1600}
                        height={900}
                        sizes="(min-width: 768px) 700px, 100vw"
                        quality={82}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-deep/45 via-transparent to-transparent" />

                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/90 text-deep backdrop-blur transition hover:bg-ivory"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14.5 6 8.5 12l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/90 text-deep backdrop-blur transition hover:bg-ivory"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <span className="tabular bg-deep/70 px-2.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ivory backdrop-blur">
                    {String(slide + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ivory/80">
                    {room.name}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 p-3">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === slide}
                    className={`relative aspect-[1.5/1] flex-1 overflow-hidden transition ${
                      i === slide
                        ? "ring-2 ring-crimson"
                        : "opacity-45 hover:opacity-80"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="140px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="card-ivory p-6 md:p-8" data-reveal="zoom">
              <p className="eyebrow text-crimson">
                {room.short === "Premium"
                  ? "King bed · Sleeps 2 · Balcony"
                  : "Fourth floor · King bed · Balcony"}
              </p>
              <h3 className="mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
                {room.name}
              </h3>
              <p className="mt-4 text-[0.93rem] leading-[1.7] text-ink/70">
                {room.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
                {room.amenities.map((a) => (
                  <li
                    key={a}
                    className="bg-paper px-2.5 py-1.5 text-[0.72rem] font-medium text-ink/80"
                  >
                    {a}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-end justify-between border-t border-line pt-6">
                <div>
                  <p className="eyebrow text-stone">From</p>
                  <p className="tabular mt-1 font-display text-[2rem] font-bold leading-none text-crimson">
                    ₹{room.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="text-[0.72rem] font-medium text-stone">per night</p>
              </div>

              <Link href="/contact" className="btn mt-6 w-full justify-between">
                Reserve this room
                <Arrow />
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hello Twin Towers by Defoy, I would like to ask about the ${room.name}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line mt-5 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-crimson"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
      <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
