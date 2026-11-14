"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

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
 * from below, tilted slightly in 3D, with a soft expo ease.
 *
 * A single `useInView` observer on the heading itself drives every unit, so the
 * animation can never be missed because an inner, translated span reports zero
 * visible area. A short safety timer reveals the copy if the observer has not
 * fired by the time the page settles.
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
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -5% 0px",
  });
  const [force, setForce] = useState(false);
  const Tag = as;

  useEffect(() => {
    const t = window.setTimeout(() => setForce(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} id={id}>
        {text}
      </Plain>
    );
  }

  const show = inView || force;

  if (split === "words") {
    return (
      <Tag
        ref={ref as never}
        className={className}
        id={id}
        aria-label={text}
      >
        {text.split(" ").map((word, i) => (
          <Unit key={i} index={i} delay={delay} stagger={0.055} show={show} gap>
            {word}
          </Unit>
        ))}
      </Tag>
    );
  }

  let charIndex = 0;

  return (
    <Tag
      ref={ref as never}
      className={className}
      id={id}
      aria-label={text}
    >
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
              <Unit
                key={ci}
                index={index}
                delay={delay}
                stagger={0.018}
                show={show}
              >
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
  show,
  gap = false,
}: {
  children: React.ReactNode;
  index: number;
  delay: number;
  stagger: number;
  show: boolean;
  gap?: boolean;
}) {
  const at = delay + index * stagger;

  return (
    <motion.span
      aria-hidden="true"
      className="inline-block overflow-hidden align-bottom"
      style={{
        marginRight: gap ? "0.24em" : undefined,
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
        perspective: 900,
      }}
      initial="hidden"
      animate={show ? "show" : "hidden"}
    >
      <motion.span
        className="inline-block will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
        variants={{
          hidden: { y: "118%", opacity: 0, rotateX: -42 },
          show: {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            transition: {
              duration: 0.95,
              ease: [0.16, 1, 0.3, 1],
              delay: at,
            },
            transitionEnd: {
              willChange: "auto",
            },
          },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
