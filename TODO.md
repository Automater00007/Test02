# Twin Towers by Defoy — TODO

Status legend: `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked

## 0. Setup & planning
- [x] Read all md guides (hero animation, SANITY, blog system, guest stories).
- [x] Create `CONTEXT.md` and `TODO.md`.
- [x] Decided base: adapt Defoy Next.js+Sanity project.
- [x] Copied Defoy project to `test-defoy/Twin-Towers-Next` (excluded node_modules/.next).
- [x] Ran `npm install` (success).
- [x] Verified `npm run build` passes (25 routes).
- [x] Rebranded package.json + sanity.config.ts + site facts in lib/content.ts.
- [x] Rebranded image/URL paths (jade→twin, jade-river-resort→twin-towers).
- [ ] Continue rebrand: metadata, layout brand text, SEO.

- [x] Brand differentiated from Jade River: nav brand "Twin.Towers / by Defoy", footer "Life, slowed by the valley.", Twin Towers tokens/content.
- [x] Rebrand from "Jade River Resort" to "Twin Towers by Defoy" (name, metadata, palette, content).
- [x] Update `lib/content.ts` site facts (25 rooms, INR 5,000, coordinates, address, phone, WhatsApp, check-in/out).
- [x] Update brand palette tokens (site facts + image paths).
- [x] Replace image references (`/images/jade/` → `/images/twin/`).
- [x] Replace URL paths (`/jade-river-resort` → `/twin-towers`).
- [x] `npm run build` passes (25 routes).
- [ ] Replace photography with Twin Towers images (copy done; verify all pages).
- [ ] Update hero imagery / poster.

## 2. Hero & scroll film
- [x] Integrate 4-stage canvas film (push transition) as hero — `HeroFilm.tsx`.
- [x] Frames in `public/frames/` (160 frames, 40 per stage).
- [x] Parallax/kinetic type/zoom transitions: SplitText + ParallaxImage components applied to Statement, Estate, Suites, DayTimeline.
- [ ] Single edited 33s film as optional mode (deferred).

## 3. Core sections (from prototype)
- [x] Statement section.
- [x] Estate (architecture) section.
- [x] Gallery: horizontal carousel (desktop pinned + mobile snap).
- [x] Suites: carousel with King/Attic switcher.
- [x] Day timeline ("Your First Day") with scroll fill.
- [x] Location section adapted (2,200 m, 95 km, Dehwathu/Pahalgam).
- [x] Theme toggle (day/night) with localStorage.
- [ ] CTA + footer polish (already has coordinates/policies/WhatsApp).
- [ ] Responsive check: 390 / 768 / 1024 / 1440.

## 4. Blog (Sanity) + Guest Stories (YouTube)
- [x] Routes `/post` and `/post/[slug]` (existing).
- [x] Sanity schemas, Studio, GROQ, Portable Text, draft preview, webhook.
- [x] Latest 3 posts on homepage.
- [x] Guest Stories: server-only YouTube fetch (`lib/youtube.ts`), `GuestStories` component, `/stories` page, modal player.
- [ ] Rebrand blog content for Twin Towers.
- [ ] Seed Twin Towers content.
- [ ] Add YOUTUBE_API_KEY + YOUTUBE_PLAYLIST_ID to env.

## 6. SEO / AEO
- [x] Metadata, JSON-LD, sitemap, robots, llms.txt updated for Twin Towers.
- [x] FAQPage JSON-LD (existing).
- [ ] AEO: speakable, answer-first content, additional schema.

## 7. Optimization & QA
- [x] Lighthouse 100/100/100.
- [x] `npm run build` passes (26 routes).
- [x] No-lag optimization pass: lazy frame loading per stage, pause rAF when journey off-screen, medium smoothing quality.

## Progress log
- 10 Nov 2026: Scaffolded Twin-Towers-Next from Defoy. Build passes. Rebranded site facts, rooms, experiences, gallery, stats, FAQs, posts, image/URL paths. Integrated HeroFilm (4-stage push film). Added Statement, Estate, GalleryHorizontal, Suites, DayTimeline sections. Added theme toggle (day/night). Guest Stories (YouTube) scaffolded with /stories page + modal. SEO/AEO: metadata, JSON-LD, llms.txt updated for Twin Towers. Nav/footer updated with Stories. Lighthouse 100/100/100. Next: responsive check, no-lag optimization, blog rebrand/seed.
