"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/**
 * Hero background film.
 *
 * A muted, looping walkthrough of the property. The first frame is also the
 * poster: it renders through next/image (priority, so it is the LCP) and the
 * video fades over it once it can actually play. Small screens get the 720p
 * encode, and reduced-motion or Save-Data visitors keep the photograph.
 */
const POSTER = "/Video/hero-poster.webp";
const DESKTOP_SRC = "/Video/hero-1080.mp4";
const MOBILE_SRC = "/Video/hero-720.mp4";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Pick the encode and start loading once the browser is idle, so the poster
  // fetch always wins the race for the first paint.
  useEffect(() => {
    if (reduce) return;

    const connection = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "")) return;

    const chosen = window.matchMedia("(max-width: 820px)").matches ? MOBILE_SRC : DESKTOP_SRC;
    const idle: (cb: () => void) => void =
      "requestIdleCallback" in window
        ? (cb) => window.requestIdleCallback(() => cb(), { timeout: 1800 })
        : (cb) => window.setTimeout(cb, 900);

    idle(() => setSrc(chosen));
  }, [reduce]);

  // Play only while the hero is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* Autoplay can be blocked; the poster stays in place. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, reduce]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-deep">
      <Image
        src={POSTER}
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        quality={82}
        sizes="100vw"
        className="object-cover"
      />

      {src && !reduce && !failed && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "saturate(1.22) contrast(1.08) brightness(1.07)" }}
        />
      )}

      {/* Legibility wash: dark at the top for the eyebrow and coordinates,
          darker at the bottom for the headline and the scroll cue. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#170f08]/65 via-transparent to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#170f08]/80 via-[#170f08]/18 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
