import Image from "next/image";
import Link from "next/link";
import ParallaxImage from "@/components/ui/ParallaxImage";
import SplitText from "@/components/ui/SplitText";

const timings = [
  { k: "Breakfast", v: "7:30 – 10:00 AM" },
  { k: "Lunch", v: "12:30 – 3:00 PM" },
  { k: "Dinner", v: "7:00 – 10:00 PM" },
];

export default function Restaurant() {
  return (
    <section
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="restaurant-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6" data-reveal="mask">
            <div className="relative overflow-hidden bg-paper-2">
              <ParallaxImage
                src="/images/twin/restaurant.webp"
                alt="The restaurant at Twin Towers by Defoy"
                width={1600}
                height={900}
                sizes="(min-width: 768px) 50vw, 100vw"
                speed={0.08}
                className="reveal-media aspect-[4/3]"
              />
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">07 — Dining</span>
            </div>
            <SplitText
              text="A small dining room that feels like a house."
              as="h2"
              id="restaurant-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal>
              Ask the team what is fresh from the valley. The kitchen cooks for the
              house, not for a crowd — and it shows.
            </p>

            <dl className="mt-10 border-t border-line">
              {timings.map((t, i) => (
                <div
                  key={t.k}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-line py-3.5"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone">{t.k}</dt>
                  <dd className="text-[0.94rem] font-medium">{t.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-5" data-reveal="zoom">
              <Link href="/dining" className="btn btn-ghost">
                See the dining page
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                  <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
