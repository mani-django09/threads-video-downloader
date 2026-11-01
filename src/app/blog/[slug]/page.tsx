import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { BLOG_POSTS, formatPostDate, getBlogPost } from '@/content/blog';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/site';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/blog/${post.slug}/`,
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}/`;
  const { Body } = post;
  const related = BLOG_POSTS.filter((other) => other.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl('/opengraph-image'),
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png') } },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog/' },
          { label: post.title, href: path },
        ]}
      />

      <PageHero eyebrow={`${formatPostDate(post.date)} · ${post.readingMinutes} min read`} title={post.title} description={post.description} />

      <article className="container-app py-10 sm:py-14">
        <div className="prose-content mx-auto max-w-3xl">
          <Body />
        </div>

        <aside className="mx-auto mt-12 max-w-3xl rounded-2xl border border-line bg-white p-6 text-center shadow-card sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-ink">Have a Threads link to save?</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">Paste it into the downloader. It&apos;s free, and there is nothing to sign up for.</p>
          <Link href="/" className="btn-cta mt-5 px-6 py-3 text-sm">
            Open the downloader
          </Link>
        </aside>
      </article>

      <section className="container-app pb-14 sm:pb-20">
        <h2 className="section-title">Keep reading</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {related.map((other) => (
            <div key={other.slug} className="bento">
              <h3 className="text-lg font-bold tracking-tight text-ink">
                <Link href={`/blog/${other.slug}/`} className="hover:text-accent-lo">
                  {other.title}
                </Link>
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">{other.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
