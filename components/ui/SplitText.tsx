"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  id?: string;
}

export default function SplitText({ text, className, as = "h2", delay = 0, id }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  if (reduce) {
    return <Tag className={className} id={id}>{text}</Tag>;
  }

  return (
    <Tag className={className} id={id} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: "0.25em" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "112%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
