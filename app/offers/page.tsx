import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Offers & Packages",
  description:
    "Seasonal packages and offers at Twin Towers by Defoy, Pahalgam. Direct bookings only, no OTAs.",
  alternates: { canonical: "/twin-towers/offers" },
};

export default function OffersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/twin-towers" },
          { name: "Offers", path: "/twin-towers/offers" },
        ])}
      />
      <PageHeader
        eyebrow="Offers · Packages"
        title={
          <>
            Honest offers, when they{" "}
            <em className="text-clay">exist.</em>
          </>
        }
        intro="We do not run permanent discounts. When a seasonal package is available, it appears here — otherwise, the best rate is always the direct one."
      />

      <section className="shell pb-24">
        <div className="border border-line bg-paper-2 p-10 md:p-16">
          <p className="eyebrow text-ink/65">No packages right now</p>
          <p className="mt-6 max-w-[40ch] text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
            Nothing on offer at the moment.
          </p>
          <p className="mt-4 max-w-[46ch] text-[0.95rem] leading-[1.75] text-ink/70">
            Rates start at ₹5,000 per night for a Premium Room with Balcony. For the
            best available rate, message us directly — there is no cheaper channel.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn">
              Reserve directly
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson"
            >
              WhatsApp us →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
