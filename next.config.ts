import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev badge — it reads as a stray button on the homepage.
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    // Optimized images are cached on disk; keep them there essentially
    // forever so redeploys don't cold-start the optimizer for every photo.
    minimumCacheTTL: 31536000,
    // Explicit list keeps Next 16 happy and documents the only qualities used.
    qualities: [75, 82],
    // Photos ship at 1600px; never ask the optimiser to upscale past that.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    formats: ["image/avif", "image/webp"],
  },
  // The stay and journal sections moved from /rooms and /post. Keep the old
  // URLs working so existing links, bookmarks and search results don't 404.
  async redirects() {
    return [
      // The guest-stories video section was removed; keep old links working.
      { source: "/stories", destination: "/", permanent: true },
      // Experiences were folded into the stay and gallery pages.
      { source: "/experiences", destination: "/stay", permanent: true },
      { source: "/rooms", destination: "/stay", permanent: true },
      { source: "/rooms/:slug", destination: "/stay/:slug", permanent: true },
      { source: "/post", destination: "/blog", permanent: true },
      { source: "/post/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
