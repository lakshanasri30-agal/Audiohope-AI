'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 py-2 px-1">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-cyan-400 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          {item.href && idx < items.length - 1 ? (
            <Link href={item.href} className="hover:text-cyan-400 transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-cyan-300">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
