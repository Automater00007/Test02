import SplitText from "@/components/ui/SplitText";

const features = [
  { title: "Breakfast", body: "A warm breakfast included with every stay, served in the dining room or on your balcony." },
  { title: "Wi-Fi", body: "Reliable connectivity in every room and across the property." },
  { title: "Parking", body: "Complimentary on-site parking for guests arriving by road." },
  { title: "Room service", body: "Meals and kahwa brought to your room, any hour you ask." },
  { title: "Heating", body: "Warm rooms through the cold months — central heating in every room." },
  { title: "Doctor on call", body: "Medical assistance available on request, around the clock." },
];

export default function StayFeatures() {
  return (
    <section
      className="relative bg-paper-2 py-20 md:py-32"
      aria-labelledby="features-heading"
    >
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">06 — Part of every stay</span>
            </div>
            <SplitText
              text="Six small things, done properly."
              as="h2"
              id="features-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-md" data-reveal>
              The details you stop noticing after a day — because they simply work.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ul className="grid gap-px bg-mist/60 sm:grid-cols-2">
              {features.map((f, i) => (
                <li
                  key={f.title}
                  className="bg-paper p-6 md:p-7"
                  data-reveal="card"
                  style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
                >
                  <span className="index-figure block text-[2.6rem] opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[1.25rem] font-bold leading-tight tracking-[-0.02em]">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-[1.7] text-ink/70">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
