import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";

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
        eyebrow="The hotel · Story and numbers"
        title={
          <>
            Two towers, one roof, <em className="text-clay">twenty-five rooms.</em>
          </>
        }
        intro="A family-run property on the road to Pahalgam — built for slow mornings, long views and the kind of hospitality that remembers your name."
      />

      <section className="shell pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Rooms", v: "25" },
            { k: "Floors", v: "Ground + 4" },
            { k: "Towers", v: "2" },
            { k: "From", v: "₹5,000" },
          ].map((f) => (
            <div key={f.k} className="border border-line bg-paper-2 p-6">
              <p className="eyebrow text-ink/65">{f.k}</p>
              <p className="mt-3 font-display text-[2.4rem] font-bold leading-none tracking-[-0.03em] text-crimson">
                {f.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell pb-20">
        <p className="eyebrow text-ink/65">All amenities</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {amenities.map((a) => (
            <li key={a} className="flex items-center gap-3 border border-line bg-paper-2 px-4 py-3 text-[0.95rem] font-medium">
              <span className="block h-1.5 w-1.5 rounded-full bg-crimson" />
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {["exterior", "facade", "lawn"].map((name) => (
            <div key={name} className="relative aspect-[4/3] overflow-hidden bg-paper-2">
              <Image
                src={`/images/twin/${name}.webp`}
                alt={`Twin Towers by Defoy — ${name}`}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="shell pb-24">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/contact" className="btn">
            Reserve directly
          </Link>
          <Link href="/rooms" className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson">
            See the rooms →
          </Link>
        </div>
      </section>
    </>
  );
}
