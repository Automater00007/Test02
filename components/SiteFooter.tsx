import Link from "next/link";
import { site } from "@/lib/content";

const explore = [
  { label: "Stay", href: "/stay" },
  { label: "Experiences", href: "/experiences" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
];

const practical = [
  { label: "Location", href: "/location" },
  { label: "Policies", href: "/policies" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Book directly", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-sand text-ink">
      <div className="shell pt-20 pb-8 md:pt-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-10 lg:grid-cols-12 lg:gap-14">
          <div className="md:col-span-2 lg:col-span-5" data-reveal>
            <span className="eyebrow text-crimson">Twin Towers</span>
            <p className="mt-6 max-w-[20ch] font-display text-[clamp(2.1rem,3.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]">
              Life, slowed by the <span className="text-crimson">valley.</span>
            </p>
            <p className="mt-8 max-w-sm text-[0.62rem] font-semibold uppercase leading-[2.1] tracking-[0.14em] text-stone">
              {site.address}
              <br />
              {site.coords}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-1 lg:col-span-4 lg:col-start-7" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "90ms" }}>
            <nav aria-label="Explore">
              <p className="eyebrow mb-6 text-stone">Explore</p>
              <ul className="space-y-3.5">
                {explore.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-line inline-flex min-h-[44px] items-center text-[0.95rem] text-ink/70 transition-colors hover:text-crimson"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Practical">
              <p className="eyebrow mb-6 text-stone">Practical</p>
              <ul className="space-y-3.5">
                {practical.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="link-line inline-flex min-h-[44px] items-center text-[0.95rem] text-ink/70 transition-colors hover:text-crimson"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="md:col-span-1 lg:col-span-2 lg:col-start-11" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "160ms" }}>
            <div className="eyebrow mb-6 text-stone">Direct</div>
            <ul className="space-y-6">
              <li>
                <a
                  href={site.phoneHref}
                  className="link-line inline-flex min-h-[44px] items-center text-[0.95rem] text-ink/75 hover:text-crimson"
                >
                  {site.phone}
                </a>
                <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                  Phone &amp; WhatsApp
                </p>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-line inline-flex min-h-[44px] items-center text-[0.95rem] text-ink/75 hover:text-crimson"
                >
                  {site.email}
                </a>
                <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                  Direct enquiries
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone sm:flex-row sm:items-center sm:justify-between" data-reveal="fade">
          <p>© {new Date().getFullYear()} Defoy Hotels &amp; Resorts. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/policies" className="inline-flex min-h-[44px] items-center hover:text-ink">
              Cancellation &amp; stay
            </Link>
            <span>Direct booking only — no OTAs</span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden"
        style={{ marginBottom: "-0.16em" }}
      >
        <p
          className="whitespace-nowrap text-center font-display text-[clamp(3.5rem,14.5vw,19rem)] font-bold leading-[0.8] tracking-[-0.055em]"
          style={{ color: "transparent", WebkitTextStroke: "1px rgba(67,41,17,0.22)" }}
        >
          Twin Towers
        </p>
      </div>
    </footer>
  );
}
