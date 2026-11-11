import Link from "next/link";
import { faqs } from "@/lib/content";
import SplitText from "@/components/ui/SplitText";

export default function HomeFaq() {
  const items = faqs.slice(0, 5);

  return (
    <section
      className="relative bg-paper-2 py-20 md:py-32"
      aria-labelledby="home-faq-heading"
    >
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4 md:sticky md:top-28 md:self-start">
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">13 — Questions guests ask</span>
            </div>
            <SplitText
              text="Everything, plainly."
              as="h2"
              id="home-faq-heading"
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em]"
            />
            <p className="body-copy mt-8 max-w-sm" data-reveal>
              The same answers we give on the phone. If yours isn&rsquo;t here, ask us
              directly.
            </p>
            <Link href="/faq" className="link-line mt-6 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson" data-reveal="fade">
              All questions →
            </Link>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <ul className="divide-y divide-line border-y border-line">
              {items.map((f, i) => (
                <li key={f.q} data-reveal="fade" style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left">
                      <span className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em]">
                        {f.q}
                      </span>
                      <span className="mt-1 shrink-0 text-crimson transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[60ch] text-[0.93rem] leading-[1.7] text-ink/70">
                      {f.a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
