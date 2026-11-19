import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getAllPosts } from "@/lib/posts";
import { JsonLd, breadcrumb } from "@/lib/schema";

// Regenerate at least once a minute. The Sanity webhook revalidates the
// "post" tag instantly, but a published post still needs to show up when the
// webhook has not been configured on the deployment.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from Twin Towers by Defoy: the sound of the valley at dawn, a slow guide to Aru Valley, and the case for doing less.",
  alternates: { canonical: "/twin-towers/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/twin-towers" },
          { name: "Blog", path: "/twin-towers/blog" },
        ])}
      />
      <PageHeader
        eyebrow="Blog · Notes"
        title={
          <>
            Notes from the <em className="text-clay">slow side.</em>
          </>
        }
        intro="Field notes, small observations, and the occasional practical guide. Written from the property, between cups of tea."
        aside={
          <div className="flex items-end justify-between border-t border-line pt-5">
            <p className="font-mono text-[9px] uppercase leading-[1.9] tracking-[0.16em] text-ink/65">
              Blog entries
              <br />
              Pahalgam · Kashmir
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/65">
              {posts.length} {posts.length === 1 ? "note" : "notes"}
            </span>
          </div>
        }
      />

      <section className="shell pb-24 pt-2 md:pb-32">
        <h2 className="sr-only">Blog posts from Pahalgam</h2>
        {posts.length === 0 ? (
          <div className="border-t border-line pt-10" data-reveal>
            <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-snug text-ink/70">
              Notes from the valley, coming soon.
            </p>
            <p className="body-copy mt-4 max-w-md">
              We&apos;re writing the first field notes from the property. In the
              meantime, write to us and we&apos;ll tell you what the valley is doing
              this week.
            </p>
            <Link
              href="/contact"
              className="link-line mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              Write to us →
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col border-t border-line pt-6"
                data-reveal="zoom"
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-paper-2"
                  data-reveal="mask"
                >
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    title={post.imageAlt}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 47vw, 100vw"
                    className="absolute inset-0 h-full w-full reveal-media object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="mt-5 flex flex-1 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/65">
                      {post.category} · {post.date}
                    </p>
                    <h3 className="mt-3 font-display font-bold text-[clamp(1.3rem,1.85vw,1.65rem)] leading-[1.14] transition-colors duration-500 group-hover:text-clay">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[0.92rem] leading-relaxed text-ink/70">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-walnut group-hover:bg-walnut group-hover:text-paper">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
