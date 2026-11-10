# Twin Towers by Defoy — Working Context

_Last updated: 10 November 2026_

## Project
Marketing website for **Twin Towers by Defoy**, Pahalgam, Jammu & Kashmir — a 25-room hotel (Premium Room with Balcony), part of Defoy Hotels & Resorts. Direct WhatsApp enquiries; no OTAs.

## Source of truth (prototype)
- Static prototype: `test-defoy/Twin-Tower 2/` (HTML/CSS/JS) — 4-stage scroll film, parallax, kinetic type, horizontal gallery carousel, zoom transitions, single edited film, reservation drawer, etc.
- Guides: `twin-towers-website-and-hero-animation-notes.md`, `SANITY_GUIDE.md`, `twin-towers-blog-system-implementation-guide.md`, `twin-towers-guest-stories-youtube-implementation-guide.md`.

## Target stack (final)
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 (or plain CSS tokens from prototype)
- Framer Motion 12 + Lenis
- Sanity CMS + Portable Text (blog at `/blog`, Studio at `/studio`)
- Vercel hosting from GitHub

## Base codebase
- `/home/shezanfayaz/Defoy/` — existing Next.js + Sanity project (Jade River Resort). Used as the starting template; will be adapted/rebranded for Twin Towers.

## Hotel facts (do not invent alternatives)
- 25 rooms, one category: Premium Room with Balcony (king bed, sleeps 2, extra bed available), from INR 5,000/night.
- Check-in 2 pm, check-out 12 pm.
- Address: W7CF+W2P Dehwathu, Pahalgam, J&K 192401.
- Coordinates: 33.92305759663491, 75.27313041534288.
- Phone/WhatsApp: +91 95418 98817. Email: info@defoy.in.
- Sanity project: `tcbet7sh`, dataset `production`.

## Status
- Static prototype complete (4-stage film, single edited film, all sections, a11y 100, perf 76fps/0.3ms paint).
- Next.js + Sanity final build: not started. Scaffolding next.

## Progress log
- 10 Nov 2026: Read all md guides. Created context.md + todo.md. Decided to base the Next.js build on the Defoy project template.
