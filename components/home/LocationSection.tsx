"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { site } from "@/lib/content";
import { mapsHref } from "@/lib/utils";
import Magnetic from "@/components/ui/Magnetic";

const attractions = ["Aru Valley", "Betaab Valley", "Chandanwari"];

const facts = [
  { k: "Airport", v: "Srinagar · 95 km" },
  { k: "Drive", v: "2.5 – 3 hours" },
  { k: "Altitude", v: "2,200 m" },
  { k: "Address", v: site.address },
];

export default function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const draw = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const mapRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2.5, 0, -1.5]);
  const mapRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2]);
  const mapScale = useTransform(scrollYProgress, [0, 1], [0.965, 1]);

  return (
    <section
      className="relative overflow-x-clip bg-paper py-20 md:py-32"
      aria-labelledby="location-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">07 — Location</span>
            </div>
            <h2
              id="location-heading"
              className="mt-6 text-[clamp(2.2rem,4.8vw,4.6rem)] font-bold leading-[0.96] tracking-[-0.04em]"
              data-reveal
            >
              The road ends. <em>The valley opens.</em>
            </h2>

            <p className="body-copy mt-8 max-w-md" data-reveal>
              Pahalgam sits at 2,200 metres on the road to the valley. Srinagar Airport is
              95 km away — roughly two and a half to three hours by road, and a different
              world by the time you arrive.
            </p>

            <dl className="mt-10 border-t border-line">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-3.5"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone">{f.k}</dt>
                  <dd className="text-[0.92rem] font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div
              className="mt-8 flex flex-wrap items-center gap-5"
              data-reveal="zoom"
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              <Magnetic>
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="btn">
                  Get directions
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                    <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </a>
              </Magnetic>
              <Link
                href="/location"
                className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson"
              >
                More on location →
              </Link>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7" ref={ref}>
            <motion.div
              className="location-map relative overflow-hidden rounded-3xl bg-sand p-4 md:p-6"
              style={
                reduce
                  ? undefined
                  : {
                      rotateX: mapRotateX,
                      rotateY: mapRotateY,
                      scale: mapScale,
                      transformPerspective: 1600,
                      transformOrigin: "center center",
                    }
              }
            >
              <div className="flex items-center justify-between pb-4">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink/75">
                  Route sketch
                </span>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink/75">
                  Not to scale
                </span>
              </div>

              <svg
                viewBox="0 0 560 520"
                className="w-full"
                fill="none"
                role="img"
                aria-label="Sketch of the route from Srinagar Airport to Pahalgam, where Twin Towers by Defoy sits"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <path
                    key={i}
                    d={`M-20 ${120 + i * 74} C 120 ${60 + i * 80}, 220 ${230 + i * 60}, 360 ${150 + i * 74} S 520 ${90 + i * 86}, 600 ${160 + i * 82}`}
                    stroke="#211C1C"
                    strokeOpacity={0.09}
                    strokeWidth="1"
                  />
                ))}

                <path
                  d="M-20 476 C 110 458, 210 486, 330 456 S 500 432, 590 458"
                  stroke="#211C1C"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />

                <path
                  d="M70 430 C 150 395, 165 340, 250 318 S 365 285, 410 230"
                  stroke="#211C1C"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                  strokeDasharray="2 8"
                />

                <motion.path
                  d="M70 430 C 150 395, 165 340, 250 318 S 365 285, 410 230"
                  stroke="#432911"
                  strokeWidth="1.8"
                  style={{ pathLength: reduce ? 1 : draw }}
                />

                <circle
                  cx="410"
                  cy="230"
                  r="54"
                  stroke="#211C1C"
                  strokeOpacity="0.22"
                  strokeDasharray="2 6"
                />
                <path
                  d="M410 230 L438 206"
                  stroke="#432911"
                  strokeWidth="1.4"
                  strokeDasharray="2 4"
                />

                <circle cx="70" cy="430" r="4" fill="#211C1C" />
                <circle cx="70" cy="430" r="11" stroke="#211C1C" strokeOpacity="0.2" />

                <circle cx="410" cy="230" r="4" fill="#211C1C" />
                <circle cx="410" cy="230" r="11" stroke="#211C1C" strokeOpacity="0.2" />

                <circle cx="438" cy="206" r="5" fill="#432911" />
                <motion.circle
                  cx="438"
                  cy="206"
                  r="10"
                  stroke="#432911"
                  strokeOpacity="0.5"
                  initial={false}
                  animate={reduce ? {} : { r: [10, 24], opacity: [0.6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                />

                <text x="58" y="468" fill="#211C1C" fillOpacity="0.65" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="2">
                  SRINAGAR AIRPORT
                </text>
                <text x="300" y="306" fill="#211C1C" fillOpacity="0.65" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="2">
                  PAHALGAM
                </text>
                <text x="300" y="320" fill="#211C1C" fillOpacity="0.5" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="1.5">
                  2,200 M
                </text>
                <text x="410" y="168" fill="#432911" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="2">
                  TWIN TOWERS
                </text>
                <text x="410" y="182" fill="#211C1C" fillOpacity="0.55" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="1.5">
                  DEHWATHU · PAHALGAM
                </text>
                <text x="72" y="492" fill="#211C1C" fillOpacity="0.45" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="1.5">
                  95 KM · 2.5–3 HRS
                </text>
              </svg>

              <div className="flex items-end justify-between border-t border-ink/10 pt-4">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink/75">
                    Exact location
                  </p>
                  <p className="tabular mt-1 text-[0.72rem] font-medium tracking-tight">
                    {site.coords}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center border border-ink/15">
                  <span className="block h-2 w-2 bg-crimson" />
                </span>
              </div>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-1">
              {attractions.map((a, i) => (
                <div
                  key={a}
                  className="flex items-baseline gap-3 border-b border-line py-3"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
                >
                  <span className="tabular text-[0.62rem] font-semibold text-crimson">
                    0{i + 1}
                  </span>
                  <span className="text-[0.9rem] font-medium">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
