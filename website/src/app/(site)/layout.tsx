import { ThemeProvider } from '../Components/ThemeProvider';
import ThemeColorMeta from '../Components/ThemeColorMeta';
import SiteHeader from '../Components/SiteHeader';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeColorMeta />
      <div className="site-shell">
        <SiteHeader />
        <main className="site-main">{children}</main>
      </div>
    </ThemeProvider>
  );
}
