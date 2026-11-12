# Twin Towers — Animation Overhaul TODO

Status: [ ] pending · [~] in progress · [x] done

## Homepage order
Hero → Statement → Building Explorer → Estate → Cover-flow Gallery →
Stack Carousel → Suites → Stay Features → Restaurant → Balcony View →
Day Timeline → Guest Stories → Location → Guest Notes → Blog Teaser →
Home FAQ → Closing CTA

## Sections
- [x] Hero (HeroFilm + HeroLens): WebGL circular lens reveal, image cycling every 3.5s, reduced-motion crossfade, dark gradient for text, poster fallback
- [x] Statement: scroll-fill statement with kinetic SplitText headline (chars), facts row, no timings
- [x] Building Explorer (BuildingExplorer): 5-floor 3D stack, auto cycle, scroll rotation, active floor description + floating image
- [x] Estate (The House): zoom-grow from 0.72 scale, kinetic heading, floating 3D image, perspective entrances
- [x] Cover-flow Gallery (CoverFlowGallery): 3D concave carousel, 5 cards desktop / 3 mobile, infinite loop, drag/swipe, keyboard, dots, reduced-motion grid
- [x] Stack Carousel: scroll-driven 3D card stack, progress rail, mobile snap rail, captions inside cards
- [x] Suites: all slide images mounted with crossfade, 3D rotateY/scale, scroll-driven tilt
- [x] Stay Features: auto 3D amenities stack, floating depth images, progress line + dots
- [x] Restaurant: expanding circular clip-path (8% → 140%), scale, rotateY, radius morph
- [x] Balcony View (BalconyView): sunrise/day/sunset/night crossfade, parallax/rotation, time rail
- [x] Day Timeline (First Day): sticky 320vh 3D scene, scroll-driven active stage, timings removed, mobile stacked cards
- [x] Guest Stories: YouTube playlist teaser
- [x] Location: scroll-driven map rotateX/Y + scale, attractions, no overlap
- [x] Guest Notes: 3D testimonial deck, all cards mounted, dots, pause on hover
- [x] Blog Teaser: asymmetric grid, tilt/flip reveal variants
- [x] Home FAQ: connected accordion with rail + animated dots
- [x] Closing CTA: cinematic image expansion + magnetic CTA + flip reveal on building drawing

## Components
- [x] HeroLens: raw WebGL shader (no three.js), two textures, circular mask, 9-tap blur, edge glow, cover-fit
- [x] CoverFlowGallery: 3D cover-flow, active-only captions on mobile/tablet
- [x] BuildingExplorer: 3D building explorer
- [x] BalconyView: balcony time-of-day crossfade
- [x] StackCarousel: scroll-driven 3D card stack
- [x] ZoomThrough: smaller-to-full scale growth, radius morph, rotateX, y offset
- [x] SplitText: single useInView + 1.6s safety timer so kinetic type cannot stay invisible
- [x] ParallaxImage: depth parallax
- [x] PerspectiveEntrance: 3D perspective entrances

## Global
- [x] Walnut token conversion (Deep Walnut #432911 replaces crimson; light surfaces; no dark backgrounds)
- [x] Manrope + Inter typography only
- [x] SignatureIntro and KineticMarquee removed from rendering
- [x] GSAP ScrollTrigger used for pinned/horizontal sections (avoided pin:true; CSS position:sticky)
- [x] Framer Motion for card/layout animation
- [x] 3D perspective entrances
- [x] Zoom-through reveals
- [x] Depth-based parallax
- [x] Image mask expansion
- [x] 3D card stacking
- [x] 3D carousel transitions
- [x] Morphing rounded containers
- [x] Cinematic zoom transitions
- [x] Perspective scroll rotation
- [x] Layered floating reveals
- [x] Parallax depth shift
- [x] Scroll-driven scene transformation
- [x] Reduced-motion fallbacks (hero crossfade, CSS overrides)
- [x] Mobile alternatives (snap rails, 3-card cover-flow, stacked day cards)
- [x] No horizontal overflow (verified 390 / 768 / 1353)
- [x] Lazy-loaded images (Next/Image default)
- [x] GPU transforms only (transform/opacity/clip-path)
- [x] GSAP cleanup (LocationSection GSAP removed; GalleryHorizontal unused)
- [x] No layout shift (sticky fixed; overflow-x-clip instead of overflow-hidden)
- [x] Route renames: /rooms → /stay, /post → /blog (with 308 redirects)
- [x] Sitemap aligned to requested list
- [~] Lighthouse audit (accessibility/SEO limited by streaming + in-app browser cache; code sets title/lang/main/meta correctly)

## Notes
- Hero images (WebGL): exterior, facade, lawn, balcony, restaurant, lounge, entrance.
- Cover-flow uses `gallery` from lib/content.ts (12 images).
- `lib/imagePool.ts`: deterministic seeded picker (`pickImages(seed, count)`), 22-image pool.
- Hero timing constants: CYCLE=3500, HOLD=150, EXPAND=250, SETTLE=600.
- Dev server log: /tmp/opencode/twin-dev.log
- Headless QA scripts: /tmp/opencode/mobile-qa.mjs (390), /tmp/opencode/qa-size.mjs (parameterized).
- Sanity content cleanup pending: delete "Why thirteen rooms is the point", "testing this blog" excerpts, seeded Jade River reviews; add YouTube env keys.
- Google Places API key empty in .env.local.
EOF
echo "written"