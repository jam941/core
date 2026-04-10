import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Jarred Moyer',
  description: 'Technical writing and notes — coming soon.',
};

export default function BlogPage() {
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
      <p style={{ margin: 0 }}>
        A technical blog may live here later — prose styles and routing are ready.
      </p>
    </article>
  );
}
