import Image from "next/image";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";
import { getLatestPosts } from "@/lib/posts";

export default async function BlogTeaser() {
  const posts = await getLatestPosts(3);

  return (
    <section className="relative bg-paper py-20 md:py-28" aria-labelledby="blog-heading">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3" data-reveal="fade">
              <span className="block h-px w-10 bg-crimson" />
              <span className="eyebrow text-crimson">10 — Journal</span>
            </div>
            <h2
              id="blog-heading"
              className="mt-6 max-w-[18ch] text-[clamp(2.1rem,3.9vw,3.9rem)] font-bold leading-[0.95] tracking-[-0.04em]"
              data-reveal="tilt"
            >
              Notes from the <em>slow side.</em>
            </h2>
          </div>
          <Link
            href="/blog"
            className="link-line self-start text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-crimson md:self-end"
            data-reveal="fade"
          >
            All journal entries →
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-12">
            {posts.map((post, i) => (
              <TiltCard
                key={post.slug}
                max={3}
                className={i === 0 ? "md:col-span-6" : "md:col-span-3"}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                  data-reveal="flip"
                  style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper-2" data-reveal="mask">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes={
                        i === 0
                          ? "(min-width: 768px) 48vw, 100vw"
                          : "(min-width: 768px) 24vw, 100vw"
                      }
                      className="reveal-media object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    />
                    <span className="absolute left-4 top-4 bg-crimson px-2.5 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-ivory">
                      {post.category}
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="tabular text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-stone">
                        {post.date} · {post.read} read
                      </p>
                      <h3
                        className={`mt-3 max-w-[24ch] font-display font-bold leading-[1.05] tracking-[-0.03em] transition-colors duration-500 group-hover:text-crimson ${
                          i === 0
                            ? "text-[clamp(1.5rem,2.4vw,2.3rem)]"
                            : "text-[clamp(1.25rem,1.7vw,1.6rem)]"
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p className="mt-3 max-w-[38ch] text-[0.9rem] leading-relaxed text-ink/65">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-crimson transition-all duration-500 group-hover:border-crimson group-hover:bg-crimson group-hover:text-ivory">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="arrow-static">
                        <path d="M2 12L12 2M12 2H4M12 2V10" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        ) : (
          <p className="mt-12 max-w-md text-[1.3rem] font-medium leading-snug text-ink/75">
            The first notes are being written from the property.
          </p>
        )}
      </div>
    </section>
  );
}
