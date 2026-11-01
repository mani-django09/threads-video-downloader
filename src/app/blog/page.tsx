import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { BLOG_POSTS, formatPostDate } from '@/content/blog';
import { pageMetadata } from '@/lib/seo';

const PATH = '/blog/';

export const metadata: Metadata = pageMetadata({
  title: 'Threads Video Blog – Tips, Guides and Answers',
  description: 'Practical guides on saving, sharing and backing up Threads videos: fixing blurry clips, keeping quality on WhatsApp, and when you can repost.',
  path: PATH,
});

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: PATH }]} />

      <PageHero
        eyebrow="Blog"
        title="Getting more out of Threads videos"
        highlight="Threads videos"
        description="Short, practical guides for the things that come up after you press download."
      />

      <section className="container-app py-10 sm:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="bento flex flex-col">
              <p className="text-xs font-semibold text-ink-3">
                {formatPostDate(post.date)} · {post.readingMinutes} min read
              </p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-ink">
                <Link href={`/blog/${post.slug}/`} className="hover:text-accent-lo">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-2">{post.description}</p>
              <Link href={`/blog/${post.slug}/`} aria-label={`Read: ${post.title}`} className="mt-4 text-sm font-bold text-accent-lo">
                Read the post
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
