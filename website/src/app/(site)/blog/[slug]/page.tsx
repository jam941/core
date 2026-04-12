import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import BlogMarkdown from '../../../Components/BlogMarkdown';
import { fetchBlogPost } from '../../../lib/notion-blog';

async function resolvePublicOrigin(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return '';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) {
    return { title: 'Post | Jarred Moyer' };
  }
  const origin = await resolvePublicOrigin();
  return {
    title: `${post.title} | Blog | Jarred Moyer`,
    description: post.markdown.slice(0, 160).replace(/\s+/g, ' ').trim(),
    alternates: origin ? { canonical: `${origin}/blog/${slug}` } : undefined,
    openGraph: {
      title: post.title,
      type: 'article',
      publishedTime: post.date ?? undefined,
      url: origin ? `${origin}/blog/${slug}` : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const origin = await resolvePublicOrigin();
  const shareUrl = origin ? `${origin}/blog/${post.slug}` : '';

  return (
    <article
      className="prose-site"
      style={{
        padding: 'clamp(24px, 6vw, 48px)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <p style={{ margin: '0 0 1rem' }}>
        <Link href="/blog" style={{ fontSize: '0.9rem' }}>
          ← Blog
        </Link>
      </p>

      <header style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            margin: '0 0 0.5rem',
            color: 'var(--color-text)',
          }}
        >
          {post.title}
        </h1>
        {post.date ? (
          <time
            dateTime={post.date}
            style={{ fontSize: '0.9rem', color: 'var(--color-text-subtle)' }}
          >
            {post.date}
          </time>
        ) : null}
      </header>

      {post.truncated ? (
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-subtle)',
            marginBottom: '1rem',
          }}
        >
          Some content may be omitted in this export. If anything looks incomplete, check back
          later—the post may be updated.
        </p>
      ) : null}

      <BlogMarkdown markdown={post.markdown} />

      <footer
        style={{
          marginTop: '2.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.9rem',
          color: 'var(--color-text-subtle)',
        }}
      >
        <p style={{ margin: '0 0 0.75rem' }}>
          <strong style={{ color: 'var(--color-text-muted)' }}>Share this post</strong>
        </p>
        <p style={{ margin: '0 0 0.5rem', wordBreak: 'break-all' }}>
          {shareUrl ? (
            <a href={shareUrl}>{shareUrl}</a>
          ) : (
            <>
              <code>/blog/{post.slug}</code>
              <span> (set NEXT_PUBLIC_SITE_URL for a stable absolute share link in emails and social previews)</span>
            </>
          )}
        </p>
      </footer>
    </article>
  );
}
