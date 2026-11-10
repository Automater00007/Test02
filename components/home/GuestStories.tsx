"use client";

import { useEffect, useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube";

interface Props {
  videos: YouTubeVideo[];
  playlistUrl: string;
  title?: string;
  description?: string;
}

export default function GuestStories({
  videos,
  playlistUrl,
  title = "Kashmir through their eyes.",
  description = "A closer look at the stays, moments and experiences shared by our guests.",
}: Props) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const active = videos.find((v) => v.id === activeVideo);

  useEffect(() => {
    if (!activeVideo) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  if (videos.length === 0) {
    return (
      <section className="py-20 md:py-28" aria-labelledby="guest-stories-title">
        <div className="shell text-center">
          <span className="eyebrow text-ink/65">Guest stories</span>
          <h2 id="guest-stories-title" className="mt-4 text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]">
            Kashmir through their eyes.
          </h2>
          <p className="body-copy mt-6 mx-auto max-w-[52ch]">
            Guest stories are coming soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 md:py-28" aria-labelledby="guest-stories-title">
        <div className="shell">
          <header className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
            <span className="eyebrow text-ink/65">Guest stories</span>
            <h2 id="guest-stories-title" className="mt-4 text-[clamp(2.3rem,4.8vw,4.6rem)] leading-[0.95] tracking-[-0.04em]">
              {title}
            </h2>
            <p className="body-copy mt-6 mx-auto max-w-[52ch]">{description}</p>
          </header>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <article key={video.id} className="overflow-hidden border border-line bg-paper-2">
                <button
                  type="button"
                  onClick={() => setActiveVideo(video.id)}
                  aria-label={`Play video: ${video.title}`}
                  className="group block w-full text-left"
                >
                  <span className="relative block aspect-video overflow-hidden bg-paper-2">
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                    />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full border border-paper/65 bg-ink/55 text-paper backdrop-blur transition group-hover:scale-105">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                  <span className="block p-5">
                    <span className="block text-[0.95rem] font-medium leading-[1.5] text-ink">
                      {video.title}
                    </span>
                    {video.publishedAt && (
                      <time
                        dateTime={video.publishedAt}
                        className="mt-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60"
                      >
                        {new Date(video.publishedAt).toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </span>
                </button>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60">
              More moments from Twin Towers by Defoy.
            </p>
            <a
              href={playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line font-mono text-[10px] uppercase tracking-[0.18em]"
            >
              Watch the full playlist ↗
            </a>
          </div>
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveVideo(null);
          }}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden border border-line bg-paper"
            role="dialog"
            aria-modal="true"
            aria-label="Guest story video"
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center border border-line bg-paper text-ink transition hover:bg-ink hover:text-paper"
            >
              ×
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(activeVideo)}?autoplay=1&rel=0`}
                title={active?.title || "Twin Towers by Defoy guest story"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
