import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostBody from "@/components/blog/PostBody";
import { site } from "@/lib/content";
import { getAllPostSlugs, getAllPosts, getPostBySlug } from "@/lib/posts";
import { JsonLd, breadcrumb } from "@/lib/schema";

// Articles regenerate every minute so a fresh post appears, and a slug that
// 404'd before it was published stops 404ing, even without the webhook.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  // Social cards still need an image even when the article has no hero.
  const image = post.seo?.ogImage || post.heroImage || post.image;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: post.seo?.canonicalUrl || `/twin-towers/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: post.seo?.canonicalUrl || `/twin-towers/blog/${post.slug}`,
      siteName: "Twin Towers by Defoy",
      title,
      description,
      publishedTime: post.publishedAt,
      images: [{ url: image, width: 1200, height: 630, alt: post.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };

  // Avoid explicit `undefined` keys — Next treats them as overriding the
  // root layout's values rather than "not set".
  if (post.seo?.keywords?.length) metadata.keywords = post.seo.keywords;
  if (post.seo?.noIndex) metadata.robots = { index: false, follow: false };
  return metadata;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getAllPosts();
  const index = all.findIndex((item) => item.slug === slug);
  const next = index >= 0 && all.length > 1 ? all[(index + 1) % all.length] : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/twin-towers" },
            { name: "Blog", path: "/twin-towers/blog" },
            { name: post.title, path: `/twin-towers/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.seo?.ogImage || post.heroImage || post.image,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: {
              "@type": "Organization",
              name: post.author || "Twin Towers by Defoy",
            },
            publisher: { "@type": "Organization", name: site.name },
            mainEntityOfPage: `${site.url}/blog/${post.slug}`,
          },
        ]}
      />

      <article className="pt-[68px] md:pt-[80px]">
        <header className="relative isolate w-full overflow-hidden bg-walnut">
          {post.heroImage ? (
            <>
              <Image
                src={post.heroImage}
                alt={post.heroImageAlt}
                title={post.heroImageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Keeps the title legible over any photo. */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-walnut/90 via-walnut/60 to-walnut/45"
                aria-hidden="true"
              />
            </>
          ) : null}

          <div className="shell relative flex min-h-[clamp(19rem,46svh,34rem)] flex-col justify-between gap-12 py-8 md:py-10">
            <div className="flex items-center">
              <Link
                href="/blog"
                className="eyebrow text-paper/75 transition-colors hover:text-paper"
              >
                Blog
              </Link>
            </div>

            <div className="mx-auto flex w-fit max-w-[54rem] flex-col items-start">
              <p className="eyebrow text-paper/70">{post.category}</p>
              <h1
                className="mt-4 w-full text-left text-[clamp(2rem,4vw,4rem)] leading-[1.02] tracking-[-0.03em] text-paper"
                data-reveal
              >
                {post.title}
              </h1>
              <h2 className="sr-only">The full note — {post.title}</h2>
            </div>
          </div>
        </header>

        <div className="shell">
          <div className="mx-auto flex max-w-[68ch] flex-wrap items-center justify-between gap-3 border-b border-line py-4">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/75">
              {post.author || "Twin Towers by Defoy"}
            </p>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/75">
              {post.date} · {post.read} read
            </p>
          </div>
        </div>

        <div className="shell pb-10 pt-5 md:pb-12 md:pt-6">
          <div className="mx-auto max-w-[68ch] [&>*:first-child]:mt-0">
            {post.portableBody ? (
              <PostBody value={post.portableBody} />
            ) : (
              post.body?.map((para, i) => (
                <div key={i}>
                  <p
                    className={`text-[1.05rem] leading-[1.85] text-ink/75 ${
                      i === 0 ? "dropcap" : "mt-6"
                    }`}
                    data-reveal
                  >
                    {para}
                  </p>
                  {i === 1 && post.quote ? (
                    <blockquote
                      className="my-12 border-l border-clay pl-6 md:pl-8"
                      data-reveal
                    >
                      <p className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.2] tracking-[-0.03em] text-ink">
                        “{post.quote}”
                      </p>
                    </blockquote>
                  ) : null}
                </div>
              ))
            )}

            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/65">
                Twin Towers by Defoy · Pahalgam
              </p>
              <div className="flex gap-6">
                <Link href="/stay" className="link-line font-mono text-[10px] uppercase tracking-[0.18em]">
                  See the rooms
                </Link>
                <Link href="/contact" className="link-line font-mono text-[10px] uppercase tracking-[0.18em] text-walnut">
                  Reserve →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {next && next.slug !== post.slug ? (
          <section className="border-t border-line py-14" data-reveal="zoom">
            <div className="shell">
              <p className="eyebrow text-ink/65">Next note</p>
              <Link
                href={`/blog/${next.slug}`}
                className="group mt-4 flex items-end justify-between gap-6"
              >
                <p className="max-w-[18ch] font-display text-[clamp(1.6rem,3.3vw,3.2rem)] leading-[0.98] transition-colors duration-500 group-hover:text-clay">
                  {next.title}
                </p>
                <span className="mb-2 text-3xl">
                  →
                </span>
              </Link>
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
