import Image from "next/image";
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

const CARDS = [
  { src: exterior.src, alt: exterior.alt, label: "The house", caption: "Against the pines" },
  { src: balcony.src, alt: balcony.alt, label: "From the balcony", caption: "Balcony in every room" },
  { src: facade.src, alt: facade.alt, label: "The twin towers", caption: "Timber and brick" },
  { src: lawn.src, alt: lawn.alt, label: "The lawn", caption: "Rope chairs and valley" },
  { src: restaurant.src, alt: restaurant.alt, label: "The kitchen", caption: "Wood fire and calm" },
  { src: lounge.src, alt: lounge.alt, label: "The lounge", caption: "Warm lighting" },
];

export default function Estate() {
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

          {/* Desktop: a calm 3×2 collage — full captions, no overlap. */}
          <div className="hidden md:col-span-6 md:col-start-7 md:block">
            <div className="grid grid-cols-2 gap-3">
              {CARDS.map((c) => (
                <figure
                  key={c.src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-ivory/15 bg-deep"
                  data-reveal="mask"
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="33vw"
                    quality={75}
                    loading="lazy"
                    className="reveal-media object-cover transition-transform duration-[1300ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/25 to-transparent"
                  />
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                    <span className="block text-[0.85rem] font-semibold leading-snug text-ivory">
                      {c.label}
                    </span>
                    <span className="mt-1 block truncate text-[0.55rem] font-medium uppercase tracking-[0.14em] text-ivory/70">
                      {c.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
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
