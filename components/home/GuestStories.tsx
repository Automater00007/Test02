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
      <section className="bg-paper py-16 md:py-20" aria-labelledby="guest-stories-title">
        <div className="shell">
          <div className="flex items-center gap-3" data-reveal="fade">
            <span className="block h-px w-10 bg-crimson" />
            <span className="eyebrow text-crimson">08 — Guest stories</span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end">
            <h2
              id="guest-stories-title"
              className="max-w-[18ch] text-[clamp(2.1rem,3.7vw,3.7rem)] font-bold leading-[0.96] tracking-[-0.04em] md:col-span-7"
              data-reveal
            >
              {title}
            </h2>
            <div className="md:col-span-4 md:col-start-9" data-reveal="fade">
              <p className="max-w-[46ch] text-[0.95rem] leading-[1.7] text-ink/70">
                Short films from the house are on their way — the balcony at
                first light, the walk to the lawn, the kitchen at service.
                Until then, the guest notes below say it better.
              </p>
              <a
                href="/reviews"
                className="link-line mt-5 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson"
              >
                Read guest notes →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-paper py-20 md:py-28" aria-labelledby="guest-stories-title">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3" data-reveal="fade">
                <span className="block h-px w-10 bg-crimson" />
                <span className="eyebrow text-crimson">08 — Guest stories</span>
              </div>
              <h2
                id="guest-stories-title"
                className="mt-6 max-w-[16ch] text-[clamp(2.1rem,3.7vw,3.7rem)] font-bold leading-[0.96] tracking-[-0.04em]"
                data-reveal
              >
                {title}
              </h2>
            </div>
            <p className="body-copy md:col-span-4 md:col-start-9" data-reveal="fade">
              {description}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, i) => (
              <article
                key={video.id}
                className="group overflow-hidden bg-paper-2"
                data-reveal="zoom"
                style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setActiveVideo(video.id)}
                  aria-label={`Play video: ${video.title}`}
                  className="block w-full text-left"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-paper-2">
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-deep/55 via-transparent to-transparent opacity-80" />
                    <span className="absolute left-4 top-4 tabular text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ivory/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-crimson text-ivory transition-transform duration-500 group-hover:scale-110">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                  <span className="block p-5">
                    <span className="block text-[0.95rem] font-semibold leading-[1.45] text-ink transition-colors group-hover:text-crimson">
                      {video.title}
                    </span>
                    {video.publishedAt && (
                      <time
                        dateTime={video.publishedAt}
                        className="mt-2.5 block text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone"
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

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-stone">
              More moments from Twin Towers by Defoy.
            </p>
            <a
              href={playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson"
            >
              Watch the full playlist ↗
            </a>
          </div>
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-deep/85 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveVideo(null);
          }}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden border border-ivory/20 bg-paper"
            role="dialog"
            aria-modal="true"
            aria-label="Guest story video"
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-ivory text-deep transition hover:bg-crimson hover:text-ivory"
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
