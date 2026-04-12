import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-brand" href="/">
        Jarred Moyer
      </Link>
      <nav className="site-nav" aria-label="Main">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
      </nav>
      <div className="site-header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
