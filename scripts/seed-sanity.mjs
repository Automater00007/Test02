/**
 * One-off blog repair for the Twin Towers Sanity dataset.
 *
 * The dataset was cloned from Jade River Resort, so it still carried Jade
 * posts, Jade photos and a Jade author. This script:
 *   • rewrites the three posts to Twin Towers content,
 *   • gives each post a distinct cover + article hero image from /public,
 *   • points them at a Twin Towers author and categories,
 *   • removes the Jade-specific slugs.
 *
 * Safe to re-run: documents use deterministic IDs.
 *
 *   node --env-file=.env.local scripts/seed-sanity.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
  token,
  useCdn: false,
});

const author = {
  _id: "author-twin-towers-team",
  _type: "author",
  name: "The Twin Towers team",
  role: "Hotel notes",
  bio: "Notes written from the property, between cups of tea.",
};

const categories = [
  { id: "category-notes-from-the-valley", title: "Notes from the valley" },
  { id: "category-field-guide", title: "Field guide" },
  { id: "category-philosophy", title: "Philosophy" },
];

/**
 * The two Jade documents are updated in place (same _id) so nothing is
 * duplicated; their old slugs disappear when the slug field is replaced.
 */
const posts = [
  {
    docId: "post-the-sound-of-the-lidder-at-six",
    slug: "a-quiet-road-to-pahalgam",
    title: "A quiet road to Pahalgam",
    excerpt:
      "Past the stone drive and the last bend of Dehwathu, the valley opens. A short note on arriving.",
    category: "Notes from the valley",
    date: "2025-10-12",
    read: "4 min",
    quote:
      "The first hour of the day belongs to the mountains. Everything else arrives later.",
    cover: "/Twin-Tower/exterior.webp",
    coverAlt: "The two towers across the lawn",
    hero: "/Twin-Tower/approach.webp",
    heroAlt: "The approach and parking court at Twin Towers by Defoy",
    focusKeyword: "Twin Towers by Defoy Pahalgam",
    secondaryKeywords: ["hotel on the road to Pahalgam", "Dehwathu Kashmir stay"],
    body: [
      "There is a moment, a little before six, when the valley is still holding its breath. The pines are black against a sky that has not decided on a colour yet, and the mountains are the loudest thing in Pahalgam.",
      "Guests who arrive from Delhi or Mumbai tend to wake early on the first morning, still running on the speed of their week. They stand on the balcony with a cup of tea and listen. By the third morning, they are sleeping in.",
      "We do not schedule anything at this hour. There is hot water for tea, a chair facing the valley, and a road that follows the pines for as long as you want to walk it.",
      "If you come, set an alarm for one morning. Just one. Stand outside before the valley gets busy with itself. The mountains will already be there, doing exactly what they have always done.",
    ],
  },
  {
    docId: "post-a-slow-guide-to-aru-valley",
    slug: "a-slow-guide-to-aru-valley",
    title: "A slow guide to Aru Valley",
    excerpt:
      "Thirty-five minutes by road, then meadows, horses, and a silence that takes a while to notice.",
    category: "Field guide",
    date: "2025-09-28",
    read: "6 min",
    quote:
      "Aru is not a checklist. It is a meadow, a road, and the decision to stop walking.",
    cover: "/Twin-Tower/lawn.webp",
    coverAlt: "The lawn at Twin Towers by Defoy",
    hero: "/Twin-Tower/facade.webp",
    heroAlt: "Red brick and white render against the mountains",
    focusKeyword: "Aru Valley guide",
    secondaryKeywords: ["Aru Valley Pahalgam", "things to do in Pahalgam"],
    body: [
      "Aru Valley is a short drive from the hotel, up a road that keeps folding back on itself. The climb is gentle enough to keep the window open. Pine gives way to open meadow, and then the valley widens.",
      "Most visitors arrive with a list: see the meadow, take the photograph, find the horse, leave. It is possible to do Aru that way. It is also possible to sit on the grass for an hour and watch the light move across the far slope, which is what we would suggest.",
      "Go early if you want the quiet, or late if you want the light. Bring a layer — the valley is cooler than Pahalgam, and the weather changes its mind quickly. Leave the itinerary in the car.",
    ],
  },
  {
    docId: "post-why-thirteen-rooms-is-the-point",
    slug: "why-twenty-five-rooms-is-the-point",
    title: "Why twenty-five rooms is the point",
    excerpt:
      "A small property is not a limitation. It is the whole idea. On scale, attention, and knowing a guest's name.",
    category: "Philosophy",
    date: "2025-09-09",
    read: "5 min",
    quote:
      "Twenty-five is not a number we settled on. It is the number the property could hold without becoming something else.",
    cover: "/Twin-Tower/facade.webp",
    coverAlt: "The facade of Twin Towers by Defoy",
    hero: "/Twin-Tower/lounge.webp",
    heroAlt: "The lounge at Twin Towers by Defoy, timber and deep sofas",
    focusKeyword: "boutique hotel Pahalgam",
    secondaryKeywords: ["small hotel Kashmir", "Twin Towers by Defoy"],
    body: [
      "A larger hotel can be many things to many people. It can have three restaurants, a spa, a business centre, a lobby that smells the same in every city. There is nothing wrong with that. It is simply not what this property was built to do.",
      "Twenty-five rooms means that on a full night, there are at most a few dozen people on the property. It means the kitchen knows how you take your eggs. It means the person at reception remembers which room asked for an extra blanket.",
      "Small has its own kind of luxury. It is not the luxury of marble or chandeliers. It is the luxury of being recognised, of not repeating yourself, of a place that can adjust to the guest rather than asking the guest to adjust to the system.",
      "Guests sometimes ask whether we plan to expand. The honest answer is that expansion would change the thing they are asking about. Twenty-five rooms is the whole idea.",
    ],
  },
];

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: `b-${Math.random().toString(36).slice(2, 10)}`,
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `s-${Math.random().toString(36).slice(2, 10)}`,
        text,
        marks: [],
      },
    ],
  };
}

function portableBody(post) {
  const body = [];
  post.body.forEach((paragraph, index) => {
    body.push(block(paragraph));
    if (index === 1 && post.quote) body.push(block(post.quote, "blockquote"));
  });
  return body;
}

async function uploadImage(relativePath, filename, alt) {
  const file = await readFile(path.join(process.cwd(), "public", relativePath));
  const asset = await client.assets.upload("image", file, {
    filename,
    contentType: "image/webp",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

async function main() {
  console.log("Upserting author and categories…");
  await client.createOrReplace(author);
  await Promise.all(
    categories.map((category) =>
      client.createOrReplace({
        _id: category.id,
        _type: "category",
        title: category.title,
        slug: {
          _type: "slug",
          current: category.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        },
      }),
    ),
  );

  const covers = {};
  const heroes = {};

  for (const post of posts) {
    console.log(`Uploading images for ${post.slug}…`);
    covers[post.slug] = await uploadImage(
      post.cover,
      `${post.slug}-cover.webp`,
      post.coverAlt,
    );
    heroes[post.slug] = await uploadImage(
      post.hero,
      `${post.slug}-hero.webp`,
      post.heroAlt,
    );
  }

  const related = posts.map((post) => post.docId);

  for (const post of posts) {
    const category = categories.find((item) => item.title === post.category);
    if (!category) throw new Error(`Unknown category: ${post.category}`);

    await client.createOrReplace({
      _id: post.docId,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      author: { _type: "reference", _ref: author._id },
      category: { _type: "reference", _ref: category.id },
      mainImage: covers[post.slug],
      heroImage: heroes[post.slug],
      publishedAt: new Date(post.date).toISOString(),
      readTime: post.read,
      featured: post.slug === "a-quiet-road-to-pahalgam",
      body: portableBody(post),
      seo: {
        metaTitle: post.title,
        metaDescription: post.excerpt,
        focusKeyword: post.focusKeyword,
        secondaryKeywords: post.secondaryKeywords,
        noIndex: false,
        ogImage: covers[post.slug],
      },
      articleType: post.slug === "a-slow-guide-to-aru-valley" ? "TravelGuide" : "Article",
      relatedPosts: related
        .filter((id) => id !== post.docId)
        .map((id, index) => ({
          _type: "reference",
          _ref: id,
          _key: `related-${index}`,
        })),
    });
    console.log(`Updated post: ${post.slug}`);
  }

  const counts = await client.fetch(
    `{"posts": count(*[_type=="post"]), "slugs": *[_type=="post"].slug.current}`,
  );
  console.log("Done:", JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
