import ParallaxImage from "@/components/ui/ParallaxImage";
import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";

const facts = [
  { k: "Rooms", v: "25, one category" },
  { k: "Floors", v: "Ground + 4" },
  { k: "Check-in", v: "2:00 PM" },
  { k: "Check-out", v: "12:00 noon" },
];

export default function Estate() {
  return (
    <section
      className="relative overflow-hidden bg-paper py-20 md:py-32"
      aria-labelledby="estate-heading"
    >
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">01 — The house</span>
            </div>

            <SplitText
              text="A house of two halves, held together by the roof."
              as="h2"
              id="estate-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />

            <p className="body-copy mt-8 max-w-md" data-reveal>
              White render meets red brick, black steel balconies and a steep grey roof.
              The twin towers hold 25 rooms, each with a balcony turned toward the
              mountains. The lawn in front is the living room of the estate.
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
                  <dd className="text-[0.94rem] font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>

            <p
              className="mt-8 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-stone"
              data-reveal="fade"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-crimson" />
              {site.coordsDisplay}
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="relative" data-reveal="mask">
              <div className="relative overflow-hidden bg-paper-2">
                <ParallaxImage
                  src="/images/twin/exterior.webp"
                  alt="Twin Towers by Defoy exterior against the pines"
                  width={1600}
                  height={1067}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  speed={0.07}
                  className="reveal-media aspect-[4/3]"
                />
              </div>
              <span className="absolute -left-px top-6 hidden bg-crimson px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory md:block">
                Dehwathu · 2,200 m
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5">
              <div className="relative overflow-hidden bg-paper-2" data-reveal="mask">
                <ParallaxImage
                  src="/images/twin/facade.webp"
                  alt="Five storeys framed in timber and brick"
                  width={800}
                  height={600}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  speed={0.1}
                  className="reveal-media aspect-[4/3]"
                />
              </div>
              <div
                className="relative overflow-hidden bg-paper-2"
                data-reveal="mask"
                style={{ ["--reveal-delay" as string]: "90ms" }}
              >
                <ParallaxImage
                  src="/images/twin/lawn.webp"
                  alt="The lawn with rope chairs and the valley"
                  width={800}
                  height={600}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  speed={0.1}
                  className="reveal-media aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
