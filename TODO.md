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
