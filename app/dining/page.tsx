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
        eyebrow="Dining · The house kitchen"
        title={
          <>
            A small dining room that feels like a{" "}
            <em className="text-clay">house.</em>
          </>
        }
        intro="Ask the team what is fresh from the valley. The kitchen cooks for the house, not for a crowd — and it shows."
      />

      <section className="shell pb-20">
        <div className="relative overflow-hidden bg-paper-2" data-reveal="zoom">
          <Image
            src="/images/twin/restaurant.webp"
            alt="The restaurant at Twin Towers by Defoy"
            width={1600}
            height={900}
            sizes="100vw"
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="shell pb-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-ink/65">Timings</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {timings.map((t) => (
                <li key={t.meal} className="flex items-baseline justify-between py-4">
                  <span className="text-[1.05rem] font-semibold">{t.meal}</span>
                  <span className="font-mono text-[11px] tracking-tight text-ink/70">{t.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="eyebrow text-ink/65">Cuisine</p>
            <p className="mt-6 max-w-[46ch] text-[1rem] leading-[1.75] text-ink/75">
              Kashmiri and Indian, cooked with what the valley gives — fresh breads,
              slow-cooked gravies, and kahwa to finish. Vegetarian options are always
              available; tell us your preferences when you book.
            </p>
            <p className="mt-8 text-[0.9rem] leading-[1.7] text-ink/65">
              A menu PDF will be added here once finalised with the kitchen.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="btn">
                Reserve a table
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello Twin Towers by Defoy, I would like to ask about dining.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson"
              >
                Ask on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
