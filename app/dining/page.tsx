import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Dining",
  description:
    "The restaurant at Twin Towers by Defoy, Pahalgam — valley-fresh cooking, small dining room, timings and reservations.",
  alternates: { canonical: "/twin-towers/dining" },
};

const timings = [
  { meal: "Breakfast", time: "7:30 – 10:00 AM" },
  { meal: "Lunch", time: "12:30 – 3:00 PM" },
  { meal: "Dinner", time: "7:00 – 10:00 PM" },
];

export default function DiningPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/twin-towers" },
          { name: "Dining", path: "/twin-towers/dining" },
        ])}
      />
      <PageHeader
        image="/images/twin/restaurant.webp"
        fullViewport
        eyebrow="Dining · The house kitchen"
        title={
          <>
            A small dining room that feels like a <em>house.</em>
          </>
        }
        intro="Ask the team what is fresh from the valley. The kitchen cooks for the house, not for a crowd — and it shows."
      />

      <section className="relative bg-paper py-16 md:py-24" aria-labelledby="dining-details">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">Timings</span>
              </div>
              <h2
                id="dining-details"
                className="mt-5 text-[clamp(1.9rem,3.2vw,3.2rem)] font-bold leading-[1] tracking-[-0.04em]"
                data-reveal="tilt"
              >
                Three sittings, <em className="text-clay">one kitchen.</em>
              </h2>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {timings.map((t, i) => (
                  <li
                    key={t.meal}
                    className="flex items-baseline justify-between gap-4 py-4"
                    data-reveal="fade"
                    style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                  >
                    <span className="text-[1.05rem] font-semibold">{t.meal}</span>
                    <span className="tabular text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
                      {t.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">The cooking</span>
              </div>
              <p className="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-ink/75" data-reveal="fade">
                Kashmiri and Indian, cooked with what the valley gives — fresh
                breads, slow-cooked gravies, and kahwa to finish. Vegetarian
                options are always available; tell us your preferences when you
                book.
              </p>
              <p
                className="mt-5 max-w-[44ch] text-[0.92rem] leading-[1.7] text-ink/60"
                data-reveal="fade"
                style={{ ["--reveal-delay" as string]: "120ms" }}
              >
                Breakfast is included with every room and can be served in the
                dining room or on your balcony.
              </p>
              <div className="mt-9 flex flex-wrap gap-4" data-reveal="fade">
                <Link href="/contact" className="btn">
                  Reserve a table
                </Link>
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello Twin Towers by Defoy, I would like to ask about dining.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost border-line text-crimson hover:border-crimson"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-14 md:py-20" aria-label="The dining room">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-3">
            {["restaurant", "lounge", "reception"].map((name, i) => (
              <figure
                key={name}
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper sm:aspect-[4/3]"
                data-reveal="mask"
                style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}
              >
                <Image
                  src={`/images/twin/${name}.webp`}
                  alt={`The ${name} at Twin Towers by Defoy`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="reveal-media object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
