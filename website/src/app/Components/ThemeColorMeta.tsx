'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const THEME_COLOR: Record<'light' | 'dark', string> = {
  dark: '#1a1e24',
  light: '#f1f5f9',
};

export default function ThemeColorMeta() {
  const { theme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLOR[theme]);
    }
  }, [theme]);

  return null;
}
