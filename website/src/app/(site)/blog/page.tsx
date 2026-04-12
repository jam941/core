import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchBlogIndex, isBlogDataSourceConfigured } from '../../lib/notion-blog';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog | Jarred Moyer',
  description: 'Technical writing and notes.',
};

export default async function BlogPage() {
  const posts = await fetchBlogIndex();
  const configured = isBlogDataSourceConfigured();

  return (
    <article
      className="prose-site"
      style={{
        padding: 'clamp(24px, 6vw, 48px)',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.75rem' }}>Blog</h1>

      {!configured ? (
        <p style={{ margin: 0 }}>
          Notion blog is not configured. Set{' '}
          <code>NOTION_BLOG_DATA_SOURCE_ID</code> (and <code>NOTION_API_KEY</code>) in{' '}
          <code>.env.local</code>, then add a database with columns{' '}
          <code>Name</code> (title), <code>Published</code> (checkbox), and optional{' '}
          <code>Slug</code>, <code>Date</code>.
        </p>
      ) : posts.length === 0 ? (
        <p style={{ margin: 0 }}>No published posts yet. Check the Published checkbox on a row in your Notion database.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '1.25rem 0 0' }}>
          {posts.map((post) => (
            <li
              key={post.pageId}
              style={{
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <Link href={`/blog/${post.slug}`} style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                {post.title}
              </Link>
              {post.date ? (
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-subtle)', marginTop: '0.35rem' }}>
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
