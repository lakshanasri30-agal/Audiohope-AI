'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = true }) => {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 ${
        isDarkMode
          ? 'bg-slate-800/80 hover:bg-slate-800 text-cyan-300 border border-slate-700/60 shadow-sm'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm'
      } ${className}`}
      title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDarkMode ? (
        <>
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
          {showLabel && <span>Dark Theme</span>}
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          {showLabel && <span>Light Theme</span>}
        </>
      )}
    </button>
  );
};
