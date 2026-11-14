"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { rooms, site } from "@/lib/content";
import SplitText from "@/components/ui/SplitText";

const suiteImages: Record<string, string[]> = {
  "premium-balcony-room": [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
  ],
  "attic-room": [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=80",
  ],
};

export default function Suites() {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastChange = useRef(0);
  const room = rooms[active];
  const images = suiteImages[room.slug] ?? [room.image];

  const goSlide = useCallback(
    (dir: number) => {
      lastChange.current = performance.now();
      setSlide((s) => (s + dir + images.length) % images.length);
    },
    [images.length],
  );
  const next = () => goSlide(1);
  const prev = () => goSlide(-1);

  const paraRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // automatic image choreography
  useEffect(() => {
    if (reduce || paused || images.length < 2) return;
    const id = setInterval(() => {
      // If the pointer just changed the slide, let that change land first.
      if (performance.now() - lastChange.current < 2500) return;
      lastChange.current = performance.now();
      setSlide((sl) => (sl + 1) % images.length);
    }, 4500);
    return () => clearInterval(id);
  }, [images.length, reduce, paused]);
  const { scrollYProgress } = useScroll({
    target: paraRef,
    offset: ["start end", "end start"],
  });
  const paraY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const tiltY = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

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
              className="mt-6 text-[clamp(2.1rem,3.7vw,3.7rem)] font-bold leading-[0.98] tracking-[-0.04em]"
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
                lastChange.current = performance.now();
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
            <motion.div
              ref={paraRef}
              className="relative overflow-hidden rounded-2xl bg-paper-2"
              data-reveal="zoom"
              onPointerEnter={(e) => {
                if (e.pointerType === "touch") return;
                setPaused(true);
                next();
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "touch") return;
                setPaused(false);
              }}
              style={
                reduce
                  ? { perspective: 1400, transformStyle: "preserve-3d" }
                  : { perspective: 1400, transformStyle: "preserve-3d", rotateY: tiltY }
              }
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.div
                  style={reduce ? undefined : { y: paraY, scale: 1.06 }}
                  className="absolute inset-0"
                >
                  {images.map((src, i) => (
                    <motion.div
                      key={`${room.slug}-${src}`}
                      initial={false}
                      animate={{
                        opacity: i === slide ? 1 : 0,
                        scale: i === slide ? 1 : 1.08,
                        rotateY: i === slide ? 0 : 4,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={src}
                        alt={`${room.name} at Twin Towers by Defoy`}
                        width={1600}
                        height={900}
                        sizes="(min-width: 768px) 700px, 100vw"
                        quality={82}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </motion.div>
                  ))}
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
            </motion.div>
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

              <Link href={`/stay/${room.slug}`} className="btn mt-6 w-full justify-between">
                View this room
                <Arrow />
              </Link>
              <Link
                href="/contact"
                className="btn btn-ghost mt-3 w-full justify-between border-line text-crimson hover:border-crimson"
              >
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
