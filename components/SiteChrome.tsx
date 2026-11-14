"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import BackToHome from "@/components/BackToHome";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import RevealObserver from "@/components/providers/RevealObserver";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ScrollProgress from "@/components/ui/ScrollProgress";

/**
 * Wraps every public page with the site chrome. The Sanity Studio is served
 * from the same app but must not inherit the marketing nav, footer or motion.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;
  const isHome = pathname === "/" || pathname === null;
  const [pastFold, setPastFold] = useState(false);

  useEffect(() => {
    if (isHome) return;
    const onScroll = () => setPastFold(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  if (isStudio) {
    return (
      <main id="main" className="min-h-svh bg-paper">
        {children}
      </main>
    );
  }

  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <ScrollProgress />

      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
      {/* Only on inner pages, and only once the header copy has scrolled away,
          so it never sits on top of a hero headline or intro. */}
      <AnimatePresence>
        {!isHome && pastFold && (
          <motion.div
            className="fixed bottom-5 left-5 z-40 md:bottom-8 md:left-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <BackToHome className="rounded-full bg-paper/90 px-4 py-4 text-[10px] leading-none shadow-[0_10px_40px_rgba(118,0,20,0.18)] backdrop-blur transition-transform hover:-translate-y-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
