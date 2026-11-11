import Link from "next/link";
import { site } from "@/lib/content";
import KineticMarquee from "@/components/ui/KineticMarquee";
import SplitText from "@/components/ui/SplitText";

export default function ClosingCTA() {
  return (
    <section
      className="relative overflow-hidden bg-deep text-ivory"
      aria-labelledby="cta-heading"
    >
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:items-end">
          <div className="relative md:col-span-7">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-ivory/50" />
              <span className="eyebrow text-ivory/65">14 — Ready to arrive?</span>
            </div>

            <SplitText
              text="Ready to arrive?"
              as="h2"
              id="cta-heading"
              split="chars"
              className="mt-6 text-[clamp(3.4rem,11vw,10rem)] font-bold leading-[0.86] tracking-[-0.055em]"
            />

            <p
              className="mt-8 max-w-[34ch] text-[1rem] leading-[1.7] text-ivory/70"
              data-reveal="fade"
            >
              Twenty-five rooms. One valley. A direct line to the people who actually
              run the place — no booking engines in between.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal="zoom">
              <Link href="/contact" className="btn btn-ivory">
                Reserve directly
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost border-ivory/40 text-ivory hover:border-ivory"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="relative hidden md:block md:col-span-5" data-reveal="fade">
            {/* Building line drawing */}
            <svg
              viewBox="0 0 260 200"
              className="w-full opacity-70"
              fill="none"
              aria-hidden="true"
            >
              <line x1="20" y1="180" x2="240" y2="180" stroke="#F5EFE6" strokeWidth="1" />
              {/* left tower */}
              <rect x="40" y="40" width="60" height="140" stroke="#F5EFE6" strokeWidth="1" />
              <line x1="40" y1="70" x2="100" y2="70" stroke="#F5EFE6" strokeWidth="0.6" />
              <line x1="40" y1="100" x2="100" y2="100" stroke="#F5EFE6" strokeWidth="0.6" />
              <line x1="40" y1="130" x2="100" y2="130" stroke="#F5EFE6" strokeWidth="0.6" />
              {/* right tower */}
              <rect x="130" y="55" width="70" height="125" stroke="#F5EFE6" strokeWidth="1" />
              <line x1="130" y1="85" x2="200" y2="85" stroke="#F5EFE6" strokeWidth="0.6" />
              <line x1="130" y1="115" x2="200" y2="115" stroke="#F5EFE6" strokeWidth="0.6" />
              <line x1="130" y1="145" x2="200" y2="145" stroke="#F5EFE6" strokeWidth="0.6" />
              {/* shared roof */}
              <path d="M30 40 L110 28 L210 42" stroke="#F5EFE6" strokeWidth="1" />
              <text x="130" y="196" fill="#F5EFE6" fillOpacity="0.6" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="3">
                TWIN TOWERS · DEHWATHU
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="border-y border-ivory/15">
        <KineticMarquee
          items={["Reserve directly", "WhatsApp us", site.phone, "Dehwathu · Pahalgam"]}
          className="py-4 text-[clamp(1rem,2vw,1.6rem)] font-display font-bold uppercase tracking-[0.02em] text-ivory/80 md:py-5"
          mark="·"
        />
      </div>

      <div className="shell flex flex-col gap-3 py-5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ivory/75 sm:flex-row sm:items-center sm:justify-between">
        <span>{site.address}</span>
        <span>Direct bookings only — no OTAs</span>
        <a href={`https://wa.me/${site.whatsapp}`} className="link-line hover:text-ivory">
          WhatsApp us
        </a>
      </div>
    </section>
  );
}
