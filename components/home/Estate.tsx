import ParallaxImage from "@/components/ui/ParallaxImage";
import SplitText from "@/components/ui/SplitText";
import { site } from "@/lib/content";

export default function Estate() {
  return (
    <section className="relative py-20 md:py-32" aria-labelledby="estate-heading">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/65" data-reveal>
              The house
            </span>
            <SplitText
              text="A house of two halves, held together by the roof."
              as="h2"
              id="estate-heading"
              className="mt-4 text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal>
              White render meets red brick, black steel balconies and a steep grey roof. The twin
              towers hold 25 rooms, each with a balcony turned toward the mountains. The lawn in
              front is the living room of the estate.
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

          <div className="md:col-span-6 md:col-start-7" data-reveal="zoom">
            <ParallaxImage
              src="/images/twin/exterior.webp"
              alt="Twin Towers by Defoy exterior against the pines"
              width={1600}
              height={1067}
              sizes="(min-width: 768px) 50vw, 100vw"
              speed={0.08}
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden border border-line bg-paper-2" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "80ms" }}>
                <ParallaxImage
                  src="/images/twin/facade.webp"
                  alt="Five storeys framed in timber and brick"
                  width={800}
                  height={600}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  speed={0.1}
                />
              </div>
              <div className="relative overflow-hidden border border-line bg-paper-2" data-reveal="zoom" style={{ ["--reveal-delay" as string]: "160ms" }}>
                <ParallaxImage
                  src="/images/twin/lawn.webp"
                  alt="The lawn with rope chairs and the valley"
                  width={800}
                  height={600}
                  sizes="(min-width: 768px) 25vw, 50vw"
                  speed={0.1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
