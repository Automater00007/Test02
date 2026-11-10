"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { rooms, site } from "@/lib/content";
import SplitText from "@/components/ui/SplitText";

const suiteImages: Record<string, string[]> = {
  "premium-balcony-room": [
    "/images/twin/poster-1.webp",
    "/images/twin/balcony.webp",
    "/images/twin/corridor.webp",
    "/images/twin/lounge.webp",
  ],
  "attic-room": [
    "/images/twin/poster-1.webp",
    "/images/twin/balcony.webp",
    "/images/twin/corridor.webp",
  ],
};

export default function Suites() {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const room = rooms[active];
  const images = suiteImages[room.slug] ?? [room.image];

  const next = () => setSlide((s) => (s + 1) % images.length);
  const prev = () => setSlide((s) => (s - 1 + images.length) % images.length);

  return (
    <section className="relative py-20 md:py-32" aria-labelledby="suites-heading">
      <div className="shell">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow text-ink/65" data-reveal>
              Stay
            </span>
            <SplitText
              text="One category. Every room with a balcony."
              as="h2"
              id="suites-heading"
              className="mt-4 text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]"
            />
            <p className="body-copy mt-6 max-w-[60ch]" data-reveal>
              All 25 rooms are Premium Rooms with Balcony — a king bed, space for an extra bed and a
              private view of the lawn or the valley. The attic rooms sit on the fourth floor,
              closest to the roof.
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-8 border-b border-line" role="tablist" aria-label="Room type">
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
              className={`relative pb-4 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                i === active ? "text-ink" : "text-ink/70 hover:text-ink"
              }`}
            >
              {r.name}
              <span
                className={`absolute bottom-[-1px] left-0 h-px bg-clay transition-all duration-500 ${
                  i === active ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70">
              {room.short === "Premium" ? "King bed · Sleeps 2 · Private balcony" : "Fourth floor · King bed · Private balcony"}
            </p>
            <h3 className="mt-3 text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.05] tracking-[-0.035em]">
              {room.name}
            </h3>
            <p className="mt-4 text-[0.95rem] leading-[1.75] text-ink/75">{room.description}</p>
            <ul className="mt-6 space-y-2 border-t border-line pt-6">
              {room.amenities.map((a) => (
                <li key={a} className="flex items-baseline gap-3 text-[0.9rem]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/55">·</span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 bg-ink px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-walnut-brown"
              >
                Reserve this room
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hello Twin Towers by Defoy, I would like to ask about the ${room.name}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line font-mono text-[10px] uppercase tracking-[0.18em]"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative overflow-hidden border border-line bg-paper-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={images[slide]}
                  alt={`${room.name} at Twin Towers by Defoy`}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-paper/40 bg-ink/40 text-paper backdrop-blur transition hover:bg-ink/70"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M14.5 6 8.5 12l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-paper/40 bg-ink/40 text-paper backdrop-blur transition hover:bg-ink/70"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m9.5 6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper">
                    {String(slide + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70">
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
                    className={`relative aspect-[1.45/1] flex-1 overflow-hidden border transition ${
                      i === slide ? "border-clay opacity-100" : "border-transparent opacity-45 hover:opacity-80"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
