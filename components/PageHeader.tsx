import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function PageHeader({
  eyebrow,
  title,
  intro,
  aside,
  children,
  image,
  fullViewport = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  /** Optional photograph used as the header background. */
  image?: string;
  /** Stretch the image header to the full viewport (Dining). */
  fullViewport?: boolean;
}) {
  if (image) {
    return (
      <header
        className={cn(
          "page-header-image relative isolate flex flex-col justify-end overflow-hidden",
          fullViewport ? "min-h-svh" : "min-h-[62svh]",
        )}
      >
        <Image
          src={image}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#1d1208]/75 via-[#2a1a0e]/35 to-[#2a1a0e]/80"
          aria-hidden="true"
        />
        <div className="shell relative z-10 pt-[68px] text-ivory md:pt-[80px]">
          <div
            className="flex items-center justify-between gap-4 border-b border-ivory/25 py-5"
            data-reveal="fade"
          >
            <span className="eyebrow truncate text-ivory/80">{eyebrow}</span>
            <span className="eyebrow hidden shrink-0 text-ivory/70 sm:inline">Twin Towers by Defoy</span>
          </div>

          <div className="grid gap-8 pb-20 pt-8 md:grid-cols-12 md:items-end md:py-16">
            <div className="md:col-span-8">
              <h1
                className="text-[clamp(2.5rem,5.4vw,5.4rem)] leading-[0.9] tracking-[-0.05em]"
                data-reveal="rise"
              >
                {title}
              </h1>
            </div>
            <div className="flex flex-col justify-end gap-6 md:col-span-4">
              {intro ? (
                <p
                  className="max-w-md text-[0.98rem] leading-[1.75] text-ivory/80"
                  data-reveal="fade"
                  style={{ ["--reveal-delay" as string]: "120ms" }}
                >
                  {intro}
                </p>
              ) : null}
              {aside ? (
                <div data-reveal="zoom" style={{ ["--reveal-delay" as string]: "200ms" }}>
                  {aside}
                </div>
              ) : null}
            </div>
          </div>

          {children}
        </div>
      </header>
    );
  }

  return (
    <header className="pt-[68px] md:pt-[80px]">
      <div className="shell">
        <div className="flex items-center justify-between gap-4 border-b border-line py-5" data-reveal="fade">
          <div className="flex min-w-0 items-center gap-4">
            <span className="eyebrow truncate text-ink/65">{eyebrow}</span>
          </div>
          <span className="eyebrow shrink-0 text-ink/65">Twin Towers by Defoy</span>
        </div>

        <div className="grid gap-10 pt-12 pb-14 md:grid-cols-12 md:pt-20 md:pb-20">
          <div className="md:col-span-8">
            <h1
              className="text-[clamp(2.5rem,5.4vw,5.4rem)] leading-[0.88] tracking-[-0.05em]"
              data-reveal
            >
              {title}
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-4">
            {intro ? (
              <p className="body-copy max-w-md" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
                {intro}
              </p>
            ) : null}
            {aside ? (
              <div data-reveal="zoom" style={{ ["--reveal-delay" as string]: "180ms" }}>
                {aside}
              </div>
            ) : null}
          </div>
        </div>

        {children}
      </div>
    </header>
  );
}
