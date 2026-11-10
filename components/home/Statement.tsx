import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";

export default function Statement() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/65" data-reveal>
              The estate
            </span>
            <SplitText
              text="Twenty-five rooms. One valley. A hotel quiet enough to hear the pines."
              as="h2"
              id="statement-heading"
              className="mt-4 text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.04em]"
            />
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="body-copy max-w-[52ch]" data-reveal>
              Twin Towers by Defoy is a family-run property on the road to Pahalgam — built for slow
              mornings, long views and the kind of hospitality that remembers your name.
            </p>
            <p
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/65"
              data-reveal
              style={{ ["--reveal-delay" as string]: "80ms" }}
            >
              Dehwathu · on the road to Pahalgam
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8">
              <div data-reveal="zoom">
                <dt className="eyebrow text-ink/65">Rooms</dt>
                <dd className="mt-2 text-[0.95rem]">25 Premium Rooms with Balcony</dd>
              </div>
              <div data-reveal="zoom" style={{ ["--reveal-delay" as string]: "60ms" }}>
                <dt className="eyebrow text-ink/65">Storeys</dt>
                <dd className="mt-2 text-[0.95rem]">5 storeys · 2 towers</dd>
              </div>
              <div data-reveal="zoom" style={{ ["--reveal-delay" as string]: "120ms" }}>
                <dt className="eyebrow text-ink/65">From</dt>
                <dd className="mt-2 text-[0.95rem]">INR 5,000 per night</dd>
              </div>
              <div data-reveal="zoom" style={{ ["--reveal-delay" as string]: "180ms" }}>
                <dt className="eyebrow text-ink/65">Coordinates</dt>
                <dd className="mt-2 font-mono text-[0.8rem] tracking-tight">{site.coords}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
