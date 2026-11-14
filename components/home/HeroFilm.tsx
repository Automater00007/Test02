"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/content";
import HeroLens from "@/components/home/HeroLens";

/**
 * Hero — a single full-viewport stage with the site navigation over it.
 *
 * The background is the image-cycling circular lens reveal; the layout and
 * copy stay as they were: eyebrow and coordinates on top, the headline and
 * Reserve button along the bottom, and a quiet scroll cue.
 */
export default function HeroFilm() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      id="journey"
      className={`journey ${ready ? "is-ready" : ""}`}
      aria-label="Twin Towers by Defoy"
    >
      <div className="journey-sticky">
        <HeroLens />
        <div className="journey-scrim" aria-hidden="true" />

        <div className="absolute inset-x-0 top-[68px] z-10 flex items-start justify-between p-[clamp(1rem,2.4vw,2rem)] md:top-[80px]">
          <span className="hero-fade eyebrow text-paper/85" style={{ ["--hero-delay" as string]: "60ms" }}>
            The property · Pahalgam
          </span>
          <span
            className="hero-fade eyebrow hidden text-right leading-[1.9] text-paper/75 sm:block"
            style={{ ["--hero-delay" as string]: "140ms" }}
          >
            {site.latDisplay}
            <br />
            {site.lngDisplay}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start justify-start gap-6 p-[clamp(1rem,2.6vw,2.4rem)] pb-[clamp(1.4rem,3vw,2.6rem)] lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h1
            className="text-paper"
            style={{ fontSize: "clamp(2.8rem, 7.4vw, 6.8rem)", lineHeight: 0.9 }}
          >
            <span className="line-mask inline-block">
              <span className="line-inner" style={{ transitionDelay: "140ms" }}>
                Life,
              </span>
            </span>
            <span className="line-mask inline-block">
              <span className="line-inner" style={{ transitionDelay: "230ms" }}>
                <em className="font-light text-paper/90">slowed by</em>
              </span>
            </span>
            <span className="line-mask inline-block">
              <span className="line-inner" style={{ transitionDelay: "320ms" }}>
                the valley.
                <span className="ml-[0.06em] inline-block h-[0.11em] w-[0.11em] translate-y-[-0.72em] bg-copper" />
              </span>
            </span>
          </h1>

          <div
            className="hero-fade w-fit self-start mr-[clamp(2.5rem,7vw,5rem)] lg:mb-12 lg:self-end"
            style={{ ["--hero-delay" as string]: "520ms" }}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-walnut px-6 py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-walnut-brown"
              style={{ width: "fit-content" }}
            >
              Reserve
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="arrow-static"
              >
                <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 hidden items-end justify-between px-[clamp(1rem,2.6vw,2.4rem)] pb-4 pr-[5.5rem] lg:flex">
          <span
            className="hero-fade eyebrow text-paper/65"
            style={{ ["--hero-delay" as string]: "760ms" }}
          >
            Scroll
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-paper/25">
            <span className="hero-scroll-cue absolute left-0 top-0 h-5 w-px bg-copper" />
          </span>
        </div>
      </div>
    </section>
  );
}
