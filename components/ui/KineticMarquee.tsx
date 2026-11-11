interface Props {
  items: string[];
  className?: string;
  slow?: boolean;
  /** Separator glyph between items. */
  mark?: string;
}

/**
 * CSS-only kinetic type band. The track is duplicated once and translated
 * -50%, so the loop is seamless. Animation runs on the compositor (transform
 * only) and pauses on hover. No JS, no scroll listeners, no layout thrash.
 */
export default function KineticMarquee({
  items,
  className = "",
  slow = false,
  mark = "✳",
}: Props) {
  return (
    <div className={`marquee-host overflow-hidden ${className}`} aria-hidden="true">
      <div className={`flex w-max ${slow ? "marquee-slow" : "marquee"}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex shrink-0 items-center">
                <span className="whitespace-nowrap">{item}</span>
                <span className="mx-[clamp(1.2rem,3vw,2.6rem)] text-[0.55em] opacity-45">
                  {mark}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
