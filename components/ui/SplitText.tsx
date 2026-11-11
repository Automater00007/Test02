"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  id?: string;
  /** Words lift as whole units (default) or characters cascade. */
  split?: "words" | "chars";
}

/**
 * Kinetic headline. Each unit sits inside an overflow-hidden mask and lifts
 * from below with a soft expo ease.
 *
 * Character mode groups letters into words so a line can never break
 * mid-word. The viewport trigger lives on the outer mask span — the inner
 * span is translated outside the clip, so observing the inner element would
 * report zero visible area and never fire.
 */
export default function SplitText({
  text,
  className,
  as = "h2",
  delay = 0,
  id,
  split = "words",
}: Props) {
  const reduce = useReducedMotion();
  const Tag = as;

  if (reduce) {
    return (
      <Tag className={className} id={id}>
        {text}
      </Tag>
    );
  }

  if (split === "words") {
    return (
      <Tag className={className} id={id} aria-label={text}>
        {text.split(" ").map((word, i) => (
          <Unit key={i} index={i} delay={delay} stagger={0.055} gap>
            {word}
          </Unit>
        ))}
      </Tag>
    );
  }

  let charIndex = 0;

  return (
    <Tag className={className} id={id} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span
          key={wi}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
          style={{ marginRight: "0.24em" }}
        >
          {Array.from(word).map((char, ci) => {
            const index = charIndex++;
            return (
              <Unit key={ci} index={index} delay={delay} stagger={0.02}>
                {char}
              </Unit>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

function Unit({
  children,
  index,
  delay,
  stagger,
  gap = false,
}: {
  children: React.ReactNode;
  index: number;
  delay: number;
  stagger: number;
  gap?: boolean;
}) {
  const at = delay + index * stagger;

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block overflow-hidden align-bottom"
      style={{ marginRight: gap ? "0.24em" : undefined }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.span
        className="inline-block"
        variants={{
          hidden: { y: "115%", opacity: 0 },
          show: {
            y: "0%",
            opacity: 1,
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: at },
          },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
