"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { stats } from "@/lib/content";
import type { Review } from "@/lib/googleReviews";
import CountUp from "@/components/ui/CountUp";
import ReviewText from "@/components/ReviewText";
import { useAutoRotate } from "@/lib/useAutoRotate";

export default function GuestNotes({
  reviews,
  googleMapsUrl,
}: {
  reviews: Review[];
  googleMapsUrl?: string | null;
}) {
  const reduce = useReducedMotion();
  const list = reviews.length > 0 ? reviews : [];
  const {
    index: active,
    select,
    advance,
    setPaused,
    hoverProps,
    swipeProps,
  } = useAutoRotate(list.length, 4800, reduce);

  return (
    <section
      className="relative overflow-hidden bg-paper-2 py-16 text-ink md:py-20"
      aria-labelledby="reviews-heading"
    >
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">10 — Guest notes</span>
            </div>
            <h2
              id="reviews-heading"
              className="mt-5 text-[clamp(1.9rem,3vw,3.1rem)] font-bold leading-[0.96] tracking-[-0.04em]"
              data-reveal
            >
              Small numbers. <span className="text-ink/70">That&rsquo;s the point.</span>
            </h2>
          </div>
          <p
            className="max-w-sm text-[0.98rem] leading-[1.75] text-ink/70 md:col-span-4 md:col-start-9"
            data-reveal="fade"
          >
            Twenty-five rooms, a handful of staff, and guests who tend to stay longer
            than they planned. These are their notes.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-y-8 border-y border-line py-8 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="md:border-l md:border-line md:pl-6 md:first:border-l-0 md:first:pl-0"
              data-reveal="zoom"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <p className="tabular font-display text-[clamp(1.9rem,2.7vw,2.7rem)] font-bold leading-none tracking-[-0.04em] text-crimson">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* 3D testimonial deck */}
        <div
          className="relative mx-auto mt-10 h-[330px] w-full max-w-[480px] touch-pan-y"
          style={{ perspective: 1600 }}
          aria-live="polite"
          data-reveal="zoom"
          {...hoverProps(advance)}
          {...swipeProps}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {list.length === 0 ? (
            <div className="mx-auto w-[min(92vw,440px)] rounded-2xl border border-line bg-paper p-6 text-center shadow-[0_20px_60px_rgba(42,26,14,0.12)]">
              <p className="font-display text-[1.25rem] font-bold tracking-[-0.02em]">
                Guest notes are being collected.
              </p>
              <p className="mt-3 text-[0.9rem] leading-[1.7] text-ink/65">
                Stay with us and leave the first one.
              </p>
            </div>
          ) : (
            list.map((review, i) => {
              const offset = (i - active + list.length) % list.length;
              const hidden = offset > 3;
              return (
                <motion.article
                  key={`${review.name}-${i}`}
                  className="absolute inset-x-0 top-0 mx-auto w-[min(92vw,440px)] origin-top rounded-2xl border border-line bg-paper p-6 shadow-[0_26px_70px_rgba(42,26,14,0.16)]"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    opacity: hidden ? 0 : 1 - offset * 0.15,
                    y: offset * 15,
                    x: offset * 8,
                    scale: 1 - offset * 0.055,
                    rotateX: offset * 3.6,
                    rotateY: -offset * 4.2,
                    rotateZ: offset * 1.1 * (offset % 2 === 0 ? 1 : -1),
                    z: -offset * 70,
                    zIndex: hidden ? 0 : list.length - offset,
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[13px] tracking-[0.18em] text-crimson"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {"★".repeat(review.rating)}
                      <span className="text-ink/15">{"★".repeat(5 - review.rating)}</span>
                    </span>
                    <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                      {review.date}
                    </span>
                  </div>
                  {review.title ? (
                    <h3 className="mt-4 font-display text-[1.12rem] font-bold leading-[1.15] tracking-[-0.03em]">
                      {review.title}
                    </h3>
                  ) : null}
                  <ReviewText
                    body={review.body}
                    className={`${review.title ? "mt-3" : "mt-4"} text-[0.86rem] leading-[1.65] text-ink/70`}
                  />
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                    <p className="text-[0.82rem] font-medium">{review.name}</p>
                    {review.from ? (
                      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-stone">
                        {review.from}
                      </p>
                    ) : null}
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        {list.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {list.map((review, i) => (
              <button
                key={`${review.name}-dot-${i}`}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show review ${i + 1}`}
                aria-current={i === active}
                className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${
                  i === active ? "" : "hover:bg-ink/5"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? "w-7 bg-crimson" : "w-1.5 bg-ink/20"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="max-w-md text-[0.6rem] font-semibold uppercase leading-[1.9] tracking-[0.14em] text-stone">
            Notes left by guests who stayed with us.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-crimson"
              >
                Reviews from Google ↗
              </a>
            ) : null}
            <Link
              href="/reviews"
              className="link-line text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-crimson"
            >
              All reviews
            </Link>
            <Link
              href="/reviews#write"
              className="link-line text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-crimson"
            >
              Leave a note →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
