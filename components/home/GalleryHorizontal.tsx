"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gallery } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GalleryHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth - window.innerWidth;
      section.style.minHeight = (scrollWidth + window.innerHeight) + 'px';
      const tween = gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // zoom-through expansion on each image as it approaches center
      const cards = track.querySelectorAll<HTMLElement>(".gallery-card");
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>(".gallery-img");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.35, borderRadius: "2rem" },
          {
            scale: 1,
            borderRadius: "1.25rem",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 90%",
              end: "left 30%",
              scrub: 1,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-paper-2"
      aria-labelledby="gallery-heading"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-14 md:py-20">
        <div className="shell mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">02 — The grounds</span>
            </div>
            <h2
              id="gallery-heading"
              className="mt-5 text-[clamp(2.2rem,5vw,4.8rem)] font-bold leading-[0.96] tracking-[-0.04em]"
              data-reveal
            >
              A walk through <em>the house.</em>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="link-line hidden text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-crimson md:inline-flex"
            data-reveal="fade"
          >
            All photographs →
          </Link>
        </div>

        <div ref={trackRef} className="flex gap-5 pl-[clamp(1.15rem,4.2vw,5rem)] pr-[clamp(1.15rem,4.2vw,5rem)] will-change-transform">
          {gallery.map((g, i) => (
            <figure
              key={i}
              className="gallery-card group relative shrink-0 overflow-hidden rounded-2xl bg-paper"
              style={{ width: "clamp(320px, 36vw, 540px)" }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 768px) 36vw, 80vw"
                  className="gallery-img object-cover"
                />
                <span className="absolute left-4 top-4 bg-crimson px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ivory">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <figcaption className="flex items-center justify-between gap-4 border-t border-line bg-paper px-4 py-3.5">
                <span className="text-[0.85rem] font-medium text-ink">{g.alt}</span>
                <span className="tabular shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-stone">
                  {String(i + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Mobile: snap rail */}
        <div className="md:hidden">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="relative w-[82vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-paper"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image src={g.src} alt={g.alt} fill sizes="82vw" className="object-cover" />
                </div>
                <figcaption className="flex items-center justify-between gap-4 border-t border-line bg-paper px-4 py-3">
                  <span className="text-[0.82rem] font-medium text-ink">{g.alt}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
