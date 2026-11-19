# Twin Towers — Jade River parity round

Porting the fixes already shipped in `~/Office/Jade-River-Resort` to Twin Towers,
adapted to Twin's branding, room data and URLs (`/blog`, `/stay`).

## A. Booking popup (home)
- [x] `components/BookingPopup.tsx` — Jade's popup: auto-open after 4.5 s, hero
      `Reserve` opens it, ESC/backdrop close, focus guard, honeypot, phone
      required, sessionStorage summary, redirect to `/thank-you`.
- [x] Room options adapted to Twin's real rooms (Premium Room with Balcony /
      Attic Room); meal plans CP / MAP / EP.
- [x] `app/api/booking/route.ts` — validation, rate limit, Google Apps Script forward.
- [x] `app/thank-you/page.tsx` + `components/ThankYouActions.tsx` — noindex
      confirmation, pre-filled WhatsApp follow-up.
- [x] `.env.example` + `scripts/google-apps-script/booking.gs` booking setup.
- [x] Hero `Reserve` dispatches the popup event; popup mounts on the homepage.
- [x] Fixed: popup positioned ~5,900px below the viewport ("problem with the
      popup"). Root cause: the `.page-enter` wrapper on every page kept
      `transform: translateY(14px)` (and opacity 0), creating a containing
      block for `position: fixed` descendants and hiding the page. Removed
      `app/template.tsx` and the `.page-enter` keyframes; the booking popup is
      now portaled to `document.body`. Verified: popup renders centred in the
      viewport, X / Escape / backdrop close it, scroll lock engages and
      releases.

## B. Blog, tiles and Sanity
- [x] Sanity `post` schema: `heroImage` (alt text), separate from the cover image.
- [x] Sanity queries/types: fetch `heroImage` for a single post + draft.
- [x] `lib/posts.ts`: `heroImage` / `heroImageAlt` + 60 s revalidation (webhook still instant).
- [x] `/blog` rebuilt as Jade's uniform 3-up tile grid — no featured lead tile,
      no extra intro block, consistent card size.
- [x] `/blog/[slug]` rebuilt as Jade's full-bleed article hero, with the
      date/author rule, drop-capped body and next-note footer.
- [x] Removed the excerpt/summary block from the article page.
- [x] Static fallback posts have their own hero images.
- [x] Repaired the cloned Jade content in Sanity: Twin posts, Twin author,
      Twin photos, distinct cover/hero images, no Lidder/thirteen-room copy.
- [x] `npm run seed` now seeds the Twin posts (idempotent).

## C. Motion (exact Jade values)
- [x] Replaced Twin's reveal CSS with Jade's block exactly
      (`0.85s`, `1.4rem`, `0.97`; mobile `0.72s`, `1.2rem`, `0.95`), compositor-only.
- [x] `RevealObserver`: `rootMargin: "0px 0px -3% 0px"`, `threshold: 0.02`.
- [x] Removed Twin-only variants (`tilt`, `flip`, `rise`, `expand`, `blur`) and
      converted their usages to the Jade variants.
- [x] Lenis: Jade settings (`duration 0.9`, cubic easing, multiplier 1, touch 1.4).

## D. Removed unused features
- [x] Removed `/experiences` (page, footer/gallery links, home section, content
      data), with a permanent redirect to `/stay`.
- [x] Removed dead components: `StackCarousel`, `DayTimeline`, `FilmSection`,
      `GalleryHorizontal`, `GalleryMarquee`, `Philosophy`, `RoomsRail`,
      `SignatureIntro`, `Experiences`, `CtaBackground`, `KineticMarquee`,
      `PerspectiveEntrance`, `ZoomThrough`, `RiverDivider`.
- [x] Pruned the `experiences` content/type and the now-unused `slugify` helper.
- [x] Confirmed sitemap / redirects contain no deleted routes.

## K. Portrait crops + direct image serving
- [x] Mobile gallery frames: std/tall → 2/3 portrait (width unchanged); grounds
      reel and house strip → 3/4.
- [x] Images no longer pass through the runtime optimizer (`unoptimized` in
      `images`) — local photos are already ~90 KB WebP; every deploy was paying
      a cold-encode hit per photo and wiping the warm cache. Now served
      directly with `Cache-Control: public, max-age=31536000, immutable`
      on /Twin-Tower/*, /Video/* and /images/*.
- [x] Estate (02 — The house) images verified loading directly, no broken
      images, console clean.

## J. Copy audit, gallery grid, house collage, dotted servers
- [x] Removed the unnecessary Guest-notes stats band (25 rooms / 5 storeys /
      2 towers / 360°), shortened the heading and intro.
- [x] Shortened headings and body copy across the homepage sections
      (statement, suites, building, restaurant, balcony, location, FAQ,
      closing CTA, stay page intro, balcony scene notes).
- [x] Estate desktop: replaced the overlapping rotated fan cards with a calm
      3×2 grid — every caption fully visible, mask-revealed, no overlap.
- [x] /gallery on mobile: 2-column masonry, standard frames now 3/4 portrait
      (was 1 col of giant squares).
- [x] Killed all test dev servers; only the user's review server stays up.

## I. Booking forms — contact form wired to /api/booking
- [x] Contact form now POSTs to /api/booking (name + email + phone + room slug),
      validates, honeypot, then lands on /thank-you#room=<slug>. WhatsApp remains
      a one-tap fallback. `/contact?room=<slug>` still preselects (used by /stay).
- [x] API verified end-to-end: honeypot→201, missing contact→422, bad email→422,
      bad dates→422, unknown room→422, bad popup category→422, rate-limit→429,
      valid without webhook→503 (friendly "not connected yet" message).
- [x] Script `scripts/google-apps-script/booking.gs` is Twin-branded (emails
      twintowers@defoy.in, phones +91 95418 98817, Bookings/Popup sheet tabs).
- [x] Re-fixed ghost-button hover cascade bug (utilities layer beat components;
      .btn-ghost:hover now forces ivory text) — "Reserve this room" etc.

## H. Content — room inventory, order, buttons, images
- [x] Documented the real split everywhere: 25 rooms = 22 Premium Rooms with
      Balcony + 3 Attic Rooms (content.ts, stay, hotel, statement, suites,
      estate facts, building explorer, FAQ, stats, JSON-LD stays 25).
- [x] Homepage order: building → house → STAY → part-of-every-stay → DINING →
      grounds/gallery → balcony → location → guest notes. Eyebrows renumbered
      01–12 sequentially.
- [x] Buttons on dark backgrounds: mobile menu hover walnut-on-espresso was
      illegible — now Sand (all other hovers confirmed to swap to ivory text).
- [x] Images: optimizer cache set to ~1y TTL (`minimumCacheTTL`), quality 82→75
      on non-LCP images, and the optimizer warmed for every image on the site
      (437 URLs) — new `scripts/prewarm-images.mjs` does the same after deploys.

## G. Refinement — 01 / 02 sections, dark house, mask reveals
- [x] 01 — The building: aspect ratio on mobile (4/3 → 16/10), mask reveal on the stage.
- [x] 02 — The house: walnut background section (ivory copy, Sand accents,
      light hairlines); mask-revealed fan cards; mobile strip → full-bleed
      4/5 cards with overlay captions + index chips.
- [x] Applied Jade's image-curtain reveal (`data-reveal="mask"` + `.reveal-media`)
      to the photos in these sections (01 stage stage, 02 fan cards + strip);
      observer fires on scroll as expected. Build 29/29, no console errors.

## F. Refinement — building / grounds / stay cards + footer
- [x] 01 — The building: replaced the 3D floor-slab stack with a large
      crossfading photo stage (floor list, auto-rotate and swipe kept).
- [x] 03 — The grounds: hover only pauses the reel (no advance-on-enter);
      cards now animate x/scale/opacity with one shared easing.
- [x] 05 — Part of every stay: deck flattened to translateY/scale/opacity only;
      removed rotateX/Y/Z/z and the two infinite background floats.
- [x] Footer: walnut background with ivory type tones (links, dividers,
      oversized outline wordmark).
- [x] Build passes; no console errors; verified transforms are compositor-only
      and the floor selector / grounds reel / stay deck all work.

## E. Verify
- [x] `npx tsc --noEmit` and `npm run build`.
- [x] Browser pass: home popup (auto-open, ESC, hero `Reserve` re-opens), `/blog`
      3-up grid, article heroes (distinct images, no excerpt block), reveal
      system animating + `.is-settled` cleanup, Lenis active on desktop,
      `/thank-you` noindex + WhatsApp follow-up. No console errors anywhere.
