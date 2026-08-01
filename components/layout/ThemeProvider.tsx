'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      try {
        localStorage.setItem('theme', 'dark');
      } catch {}
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch {}
    }
  }, [isDarkMode]);

  return <>{children}</>;
};
