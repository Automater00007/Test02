import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/ui/CountUp";
import { site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { twinImg } from "@/lib/testImages";

export const metadata: Metadata = {
  title: "The Hotel",
  description:
    "Twin Towers by Defoy — a 25-room hotel in Dehwathu, Pahalgam. Architecture, amenities and the story of the house.",
  alternates: { canonical: "/twin-towers/hotel" },
};

const amenities = [
  "Breakfast included",
  "Wi-Fi",
  "On-site parking",
  "Room service",
  "Central heating",
  "Doctor on call",
  "Balcony in every room",
  "King size bed",
  "Extra bed available",
  "Hot water",
];

const numbers = [
  { value: 25, suffix: "", k: "Rooms", note: "One category only" },
  { value: 5, suffix: "", k: "Floors", note: "Ground plus four" },
  { value: 2, suffix: "", k: "Towers", note: "Under one roof" },
  { value: 360, suffix: "°", k: "Views", note: "Lawn and valley" },
];

export default function HotelPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/twin-towers" },
          { name: "The Hotel", path: "/twin-towers/hotel" },
        ])}
      />
      <PageHeader
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
        eyebrow="The hotel · Story and numbers"
        title={
          <>
            Two towers, one roof, <em>twenty-five rooms.</em>
          </>
        }
        intro="A family-run property on the road to Pahalgam — built for slow mornings, long views and the kind of hospitality that remembers your name."
      />

      <section className="relative overflow-hidden bg-paper py-16 md:py-24" aria-labelledby="story-heading">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">The story</span>
              </div>
              <h2
                id="story-heading"
                className="mt-5 max-w-[16ch] text-[clamp(2rem,3.4vw,3.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
                data-reveal="tilt"
              >
                Built as a house first, <em className="text-clay">a hotel second.</em>
              </h2>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <p className="body-copy" data-reveal="fade">
                Twin Towers began as two family wings sharing a single steep roof.
                The stone drive, the glass canopy and the long balconies were added
                slowly, one season at a time — which is why the house still feels
                lived in rather than designed for a photograph.
              </p>
              <p
                className="mt-6 body-copy"
                data-reveal="fade"
                style={{ ["--reveal-delay" as string]: "120ms" }}
              >
                Every room is the same category: a Premium Room with a king size
                bed, space for an extra bed, and a balcony of its own. No suites,
                no upgrade ladder — just twenty-five rooms that all get the view.
              </p>

              <div
                className="mt-10 border-l-2 border-crimson pl-6"
                data-reveal="left"
                style={{ ["--reveal-delay" as string]: "180ms" }}
              >
                <p className="font-display text-[clamp(1.3rem,2vw,1.7rem)] font-medium leading-[1.35] tracking-[-0.02em]">
                  “The mountain does not change for you. That is the point of
                  coming here.”
                </p>
                <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone">
                  The Defoy family
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-paper-2 py-14 md:py-20" aria-label="The hotel in numbers">
        <div className="shell">
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-6">
            {numbers.map((f, i) => (
              <div
                key={f.k}
                className="md:border-l md:border-line md:pl-6 md:first:border-l-0 md:first:pl-0"
                data-reveal="card"
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              >
                <p className="tabular font-display text-[clamp(2.4rem,4vw,3.8rem)] font-bold leading-none tracking-[-0.05em] text-crimson">
                  <CountUp value={f.value} suffix={f.suffix} />
                </p>
                <p className="mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-ink/70">
                  {f.k}
                </p>
                <p className="mt-1 text-[0.8rem] text-stone">{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24" aria-labelledby="amenities-heading">
        <div className="shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">Part of every stay</span>
              </div>
              <h2
                id="amenities-heading"
                className="mt-5 text-[clamp(2rem,3.4vw,3.4rem)] font-bold leading-[1] tracking-[-0.04em]"
                data-reveal="tilt"
              >
                Small things, <em className="text-clay">already included.</em>
              </h2>
            </div>
            <p className="max-w-xs text-[0.9rem] leading-[1.7] text-ink/65" data-reveal="fade">
              Nothing here is an add-on. It is simply how the house runs.
            </p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a, i) => (
              <li
                key={a}
                className="group flex items-center gap-3 border border-line bg-paper-2 px-4 py-3.5 text-[0.95rem] font-medium transition-colors duration-300 hover:border-crimson/40 hover:bg-ivory"
                data-reveal="fade"
                style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}
              >
                <span className="block h-1.5 w-1.5 rounded-full bg-crimson transition-transform duration-300 group-hover:scale-150" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper pb-16 md:pb-24" aria-label="The house">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-3">
            {["exterior", "facade", "lawn"].map((name, i) => (
              <figure
                key={name}
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-2 sm:aspect-[4/3]"
                data-reveal="mask"
                style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
              >
                <Image
                  src={twinImg(name)}
                  alt={`Twin Towers by Defoy — ${name}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="reveal-media object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep/70 to-transparent p-4 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ivory/90">
                  {name === "exterior" ? "The two towers" : name === "facade" ? "The shared roof" : "The lawn"}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4" data-reveal="fade">
            <Link href="/contact" className="btn">
              Reserve directly
            </Link>
            <Link href="/stay" className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson">
              See the rooms →
            </Link>
            <a
              href={site.phoneHref}
              className="link-line ml-auto text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone hover:text-crimson"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
