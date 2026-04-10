import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitScript = `(function(){try{var k='portfolio-theme';var s=localStorage.getItem(k);var d=document.documentElement;if(s==='light')d.classList.remove('dark');else if(s==='dark')d.classList.add('dark');else if(window.matchMedia('(prefers-color-scheme: dark)').matches)d.classList.add('dark');else d.classList.remove('dark');}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Jarred Moyer | Portfolio",
  description: "Jarred Moyer | Portfolio",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
    shortcut: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg?v=1" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=1" />
        <link rel="apple-touch-icon" href="/icon.svg?v=1" />
        <meta name="theme-color" content="#1a1e24" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
