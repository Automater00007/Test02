/**
 * Warms the Next image-optimizer cache for the public pages.
 *
 * The optimizer generates AVIF/WebP on demand; the first request after each
 * deploy is a cold hit for every photo on the page. Run this once after a
 * deploy (or before opening the site) so visitors never pay that cost:
 *
 *   node scripts/prewarm-images.mjs http://localhost:3100
 *   node scripts/prewarm-images.mjs https://defoyhotelsandresorts.com
 */
const base = process.argv[2];

if (!base) {
  console.error("Usage: node scripts/prewarm-images.mjs <base-url>");
  process.exit(1);
}

const PAGES = [
  "/",
  "/gallery",
  "/stay",
  "/stay/premium-balcony-room",
  "/stay/attic-room",
  "/blog",
  "/hotel",
  "/dining",
  "/location",
  "/faq",
  "/contact",
  "/reviews",
  "/policies",
];

const urls = new Set();

for (const page of PAGES) {
  try {
    const html = await (await fetch(`${base}${page}`)).text();
    for (const match of html.matchAll(/\/_next\/image\?url=[^"\s]+/g)) {
      urls.add(match[0].replaceAll("&amp;", "&"));
    }
  } catch (error) {
    console.error(`Could not fetch ${base}${page}:`, error.message);
  }
}

console.log(`Found ${urls.size} optimized images; warming…`);

let ok = 0;
for (const url of urls) {
  const response = await fetch(`${base}${url}`);
  if (response.ok) ok += 1;
  else console.error(`Failed ${response.status}: ${url.slice(0, 120)}`);
  // Consume the body so the connection completes.
  await response.arrayBuffer();
}

console.log(`Warmed ${ok}/${urls.size} images.`);
