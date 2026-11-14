"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { faqs } from "@/lib/content";
import SplitText from "@/components/ui/SplitText";

export default function HomeFaq() {
  const reduce = useReducedMotion();
  const items = faqs.slice(0, 5);
  const [open, setOpen] = useState<number | null>(0);

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
              <span className="eyebrow text-crimson">12 — Questions guests ask</span>
            </div>
            <SplitText
              text="Everything, plainly."
              as="h2"
              id="home-faq-heading"
              className="mt-6 text-[clamp(2.1rem,3.5vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.04em]"
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
            <div className="relative overflow-hidden rounded-2xl border border-line bg-paper">
              <span className="absolute bottom-8 left-[21px] top-8 w-px bg-line" aria-hidden="true" />
              {items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q} className="relative border-b border-line last:border-b-0">
                    <motion.span
                      className="absolute left-[15px] top-[26px] z-10 h-2.5 w-2.5 rounded-full border-2"
                      animate={{
                        backgroundColor: isOpen ? "#432911" : "#fbf8f3",
                        borderColor: isOpen ? "#432911" : "#ded5cc",
                        scale: isOpen ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-6 py-5 pl-12 pr-6 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`home-faq-panel-${i}`}
                    >
                      <span className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em]">
                        {f.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-1 shrink-0 text-crimson"
                      >
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`home-faq-panel-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[60ch] pb-6 pl-12 pr-6 text-[0.93rem] leading-[1.7] text-ink/70">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
