import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import RoomShowcase from "@/components/rooms/RoomShowcase";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { rooms, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Stay",
  description:
    "Twenty-five rooms at Twin Towers by Defoy, Pahalgam — all Premium Rooms with a king size bed and a private balcony. Direct booking only.",
  alternates: { canonical: "/twin-towers/stay" },
};

export default function StayPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/twin-towers" },
          { name: "Stay", path: "/twin-towers/stay" },
        ])}
      />
      <PageHeader
        eyebrow="Stay · 25 rooms"
        title={
          <>
            Twenty-five rooms.
            <br />
            One kind of <em className="text-clay">room.</em>
          </>
        }
        intro="Every room is a Premium Room with a king size bed and a balcony of its own — a private place to watch the lawn, the pines and the light change."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="eyebrow text-ink/65">From</p>
              <p className="mt-1 font-display text-[1.9rem] leading-none">₹5,000</p>
            </div>
            <Link href="/contact" className="link-line font-mono text-[10px] uppercase tracking-[0.2em]">
              Check dates →
            </Link>
          </div>
        }
      />
      <RoomShowcase />

      <section className="bg-forest py-16 text-paper md:py-20" data-reveal="zoom">
        <div className="shell grid gap-10 md:grid-cols-12 md:items-center">
          <p className="font-display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.05] md:col-span-7" data-reveal>
            Not sure which room? Tell us who is coming and we will{" "}
            <em className="text-sand">place you properly.</em>
          </p>
          <div className="flex flex-wrap gap-4 md:col-span-5 md:justify-end" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "100ms" }}>
            <Link href="/contact" className="btn border-paper/30 text-paper">
              Reserve directly
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line self-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70"
            >
              WhatsApp us →
            </a>
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {rooms.map((room, i) => (
            <div
              key={room.slug}
              className="border-t border-line pt-4"
              data-reveal="zoom"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <p className="eyebrow text-ink/65">{room.count}</p>
              <p className="mt-2 text-[0.95rem]">{room.name}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
