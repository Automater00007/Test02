import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";

const facts = [
  { k: "Rooms", v: "25, all with a balcony" },
  { k: "Towers", v: "Two, under one roof" },
  { k: "From", v: "₹5,000 / night" },
  { k: "Altitude", v: "2,200 m" },
];

export default function Statement() {
  return (
    <section className="relative overflow-hidden bg-paper pt-16 md:pt-24" aria-labelledby="statement-heading">
      <div className="shell">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4"
          data-reveal="fade"
        >
          <span className="eyebrow text-crimson">Twin Towers by Defoy</span>
          <span className="eyebrow hidden text-stone sm:block">
            Dehwathu · Pahalgam · Jammu &amp; Kashmir
          </span>
        </div>

        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="relative md:col-span-7">
            <div className="flex items-center gap-4">
              <span
                className="index-figure block select-none text-[clamp(3rem,6vw,5.2rem)] leading-none"
                aria-hidden="true"
              >
                25
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span className="eyebrow text-stone">Rooms</span>
            </div>

            <SplitText
              text="Twenty-five rooms and one kind of room:"
              as="h2"
              id="statement-heading"
              split="chars"
              className="relative mt-5 text-[clamp(2.5rem,6vw,5.6rem)] font-bold leading-[0.94] tracking-[-0.045em]"
            />
            <p
              className="relative mt-3 max-w-[24ch] font-display text-[clamp(1.9rem,4.3vw,3.8rem)] font-semibold leading-[1] tracking-[-0.04em] text-crimson"
              data-reveal
              style={{ ["--reveal-delay" as string]: "120ms" }}
            >
              a Premium Room with a king size bed and a balcony of its own.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="body-copy" data-reveal>
              A family-run property on the road to Pahalgam — built for slow mornings,
              long views and the kind of hospitality that remembers your name.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-line pt-6">
              {facts.map((f, i) => (
                <div
                  key={f.k}
                  data-reveal="zoom"
                  style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                >
                  <dt className="eyebrow text-stone">{f.k}</dt>
                  <dd className="mt-2 text-[0.92rem] font-medium leading-snug">{f.v}</dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-stone"
              data-reveal="fade"
            >
              <span className="block h-px w-8 bg-crimson" />
              {site.coordsDisplay}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 border-y border-line md:mt-20" />
    </section>
  );
}
