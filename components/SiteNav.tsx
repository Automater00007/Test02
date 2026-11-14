"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * The phone menu is deliberately short. Everything else lives in the footer —
 * a long scroll inside an overlay just buries the two links people want
 * (Stay and Contact).
 */
const mobileNav = [
  { label: "Home", href: "/" },
  { label: "The hotel", href: "/hotel" },
  { label: "Stay", href: "/stay" },
  { label: "Dining", href: "/dining" },
  { label: "Gallery", href: "/gallery" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false); // kept for type compat; never hidden
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);
  const [imageHeader, setImageHeader] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setAtTop(y < 24);
    if (open) return;
    // Navbar stays visible at all times; only its background changes.
  });

  useEffect(() => {
    setOpen(false);
    setAtTop(window.scrollY < 24);
    // Pages with a photographic header (hotel, dining) need light nav text at
    // the top, exactly like the homepage hero.
    const id = window.requestAnimationFrame(() => {
      setImageHeader(Boolean(document.querySelector(".page-header-image")));
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-lock", open);
    return () => document.documentElement.classList.remove("menu-lock");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isHome = pathname === "/";
  const overHero = (isHome || imageHeader) && atTop;

  return (
    <>
      <motion.header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-[105] isolate border-b transition-[background-color,border-color,color,backdrop-filter] duration-500",
          atTop
            ? overHero
              ? "border-transparent text-paper before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-[160%] before:bg-gradient-to-b before:from-[#1d1208]/85 before:via-[#1d1208]/40 before:to-transparent [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_18px_rgba(0,0,0,0.55)]"
              : "border-transparent bg-transparent text-ink"
            : "border-line bg-paper/95 text-ink backdrop-blur-md",
        )}
        initial={false}
        animate={{ y: hidden ? "-101%" : "0%" }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6 md:h-[80px]">
          <Link
            href="/"
            className="group flex items-baseline gap-2.5"
          >
            <span className="font-display text-[1.35rem] font-bold leading-none tracking-[-0.04em] md:text-[1.55rem]">
              Twin<span className={overHero ? "text-paper/60" : "text-clay"}>.</span>Towers
            </span>
            <span className={cn("eyebrow hidden pb-[2px] text-[9px] lg:block", overHero ? "text-paper/80" : "text-ink/65")}>
              by Defoy
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "site-nav-link link-line text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors",
                    active
                      ? overHero
                        ? "text-paper after:scale-x-100"
                        : "text-walnut"
                      : overHero
                        ? "text-paper/90 hover:text-paper"
                        : "text-ink/65 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={cn(
                "site-nav-cta btn hidden !py-3 !px-5 sm:inline-flex",
                overHero ? "!border-paper/70 !text-paper" : "btn-clay",
              )}
            >
              Reserve directly
              <Arrow />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="site-hamburger group relative h-11 w-11 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span className="absolute right-0 top-1/2 flex w-7 -translate-y-1/2 flex-col items-end gap-[5px]">
                <span className={cn("block h-px w-7 transition-all duration-500 group-hover:w-5", overHero ? "bg-paper" : "bg-charcoal")} />
                <span className={cn("block h-px w-5 transition-all duration-500 group-hover:w-7", overHero ? "bg-paper" : "bg-charcoal")} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[115] flex flex-col bg-forest text-paper"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div className="shell flex h-[68px] items-center justify-between md:h-[80px]">
              <span className="font-display text-[1.35rem] font-bold leading-none tracking-[-0.04em]">
                Twin<span className="text-paper/60">.</span>Towers
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative h-11 w-11"
                aria-label="Close menu"
              >
                <span className="absolute right-0 top-1/2 block h-4 w-6 -translate-y-1/2">
                  <span className="absolute left-0 top-1/2 block h-px w-6 rotate-45 bg-paper" />
                  <span className="absolute left-0 top-1/2 block h-px w-6 -rotate-45 bg-paper" />
                </span>
              </button>
            </div>

            <div className="shell flex flex-1 flex-col justify-center pb-10">
              <nav aria-label="Mobile" className="flex flex-col">
                {mobileNav.map((item, i) => (
                    <div key={item.href} className="overflow-hidden border-b border-line-light">
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.8,
                          ease: EASE,
                          delay: 0.22 + i * 0.06,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline justify-between py-[clamp(0.7rem,2vw,1.1rem)]"
                        >
                          <span className="font-display text-[clamp(2.2rem,7vw,4rem)] font-bold leading-[1.02] tracking-[-0.04em] transition-colors group-hover:text-clay">
                            {item.label}
                          </span>
                          <span className="tabular text-[10px] font-semibold tracking-[0.2em] text-paper/65">
                            0{i + 1}
                          </span>
                        </Link>
                      </motion.div>
                    </div>
                  ))}
              </nav>

              <motion.div
                className="mt-10 flex flex-wrap items-end justify-between gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="eyebrow leading-[1.9] text-paper/65">
                  Pahalgam, Jammu &amp; Kashmir
                  <br />
                  {site.coordsDisplay}
                </div>
                <div className="text-right">
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    className="link-line font-display text-xl font-semibold text-paper"
                  >
                    {site.phone}
                  </a>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/65">
                    Direct bookings only
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="arrow-static"
    >
      <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
