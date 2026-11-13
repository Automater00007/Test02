import Link from "next/link";
import { site } from "@/lib/content";
import Magnetic from "@/components/ui/Magnetic";
import SplitText from "@/components/ui/SplitText";

export default function ClosingCTA() {
  return (
    <section
      className="relative overflow-hidden bg-ivory text-ink"
      aria-labelledby="cta-heading"
    >
      <div className="shell relative z-10 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="relative md:col-span-7">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson/40" />
              <span className="eyebrow text-stone">14 — Ready to arrive?</span>
            </div>

            <SplitText
              text="Ready to arrive?"
              as="h2"
              id="cta-heading"
              split="chars"
              className="mt-6 text-[clamp(3.4rem,11vw,10rem)] font-bold leading-[0.86] tracking-[-0.055em]"
            />

            <p
              className="mt-8 max-w-[34ch] text-[1rem] leading-[1.7] text-ink/70"
              data-reveal="fade"
            >
              Twenty-five rooms. One valley. A direct line to the people who actually
              run the place — no booking engines in between.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal="zoom">
              <Magnetic>
                <Link href="/contact" className="btn">
                  Reserve directly
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </Link>
              </Magnetic>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost border-line text-crimson hover:border-crimson"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="md:col-span-4 md:col-start-9" data-reveal="fade">
            <div className="border-t border-line pt-6">
              <p className="eyebrow text-stone">Direct line</p>
              <a
                href={site.phoneHref}
                className="link-line mt-3 block font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-bold leading-tight tracking-[-0.03em] text-crimson"
              >
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="link-line mt-2 block text-[0.92rem] font-medium text-ink/75"
              >
                {site.email}
              </a>
              <p className="mt-5 max-w-[26ch] text-[0.8rem] leading-[1.7] text-stone">
                A real person replies — usually within the hour.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-line py-5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone sm:flex-row sm:items-center sm:justify-between">
        <span>{site.address}</span>
        <span>Direct bookings only — no OTAs</span>
        <a href={`https://wa.me/${site.whatsapp}`} className="link-line hover:text-ink">
          WhatsApp us
        </a>
      </div>
    </section>
  );
}
