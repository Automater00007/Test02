# Twin Towers — polish round 2

Working checklist for the current round of fixes.

## Hero
- [x] Hero always shows a photograph (poster image under the WebGL canvas, canvas fades in once painted)
- [x] "Twin Towers" wordmark clearly readable over the hero (nav gradient moved behind the content with `isolate` + `-z-10`)
- [x] Hero content entrance animation (eyebrow, coords, headline lines, reserve button)
- [x] Reserve button and scroll cue no longer collide with the WhatsApp bubble

## Motion
- [x] Page-level entrance animation on every visit (`app/template.tsx`)
- [x] Mobile-specific reveal polish (staggered, earlier trigger via `rootMargin: 0px 0px 8% 0px`)
- [x] Reading-progress line pinned to the top of every page (`ScrollProgress`)

## Navigation
- [x] Mobile menu: single Contact link, trimmed to Home / The hotel / Stay / Dining / Gallery / Journal / Contact
- [x] Back button only on non-home pages, and it waits until the header copy has scrolled away so it never sits on a hero

## Typography
- [x] Reduced heading clamp maximums on large screens (page headers, section h2, statement, hero, CTA)

## Home sections
- [x] The building — larger floor imagery on desktop, removed the stray floating photo card, labels stay readable
- [x] Removed "In layers" (StackCarousel)
- [x] Stay — direct "View this room" link to `/stay/[slug]` plus the reserve action
- [x] Removed "Your first day" (DayTimeline)
- [x] Guest notes — smaller, tighter section
- [x] Section eyebrows renumbered 01–13
- [x] Guest stories empty state rewritten (no bare "coming soon")
- [x] Floor cards: images kept rich (no paper wash); labels backed by gradient for legibility
- [x] Lenis smooth scroll now also runs on phones (syncTouch); mobile reveal distance/duration strengthened

## Pages
- [x] Hotel — background image header, story and numbers with CountUp, amenity grid, photo strip
- [x] Dining — full-viewport background image behind the header
- [x] Removed `/offers` (page, nav, sitemap)
- [x] Light nav text over photographic page headers (hotel, dining)

## Sanity
- [x] Blog posts come from Sanity (static fallback when credentials are absent)
- [x] Review submissions land in Sanity and only approved reviews render
- [x] Studio review approval flow confirmed
- [x] Renamed the "Notes from the river" category to "Notes from the house"
- [x] Fixed the "thirteen rooms" post title to match the 25-room property
- [x] Removed the leftover test post ("Tesing Another")
- [x] Blog fetch revalidates every 5 minutes even without a webhook
- [x] Lighthouse pass: software-GL hero falls back to CSS crossfade (WebGL perf on GPU machines kept)
- [x] Hero: rest-phase draws throttled to 1fps, off-screen pause, DPR ≤1.25, shader skips blur when idle
- [x] Accessibility: 44px tap targets, contrast fixes, gallery button name/role fixed (4.5:1+, label-content-name-mismatch resolved)
- [x] SplitText releases will-change after entrance
- [x] Local Lighthouse (production build, desktop): 60→93 Performance, 94→100 A11y, 100 BP, 100 SEO; TBT 13.2s→~0.15s
