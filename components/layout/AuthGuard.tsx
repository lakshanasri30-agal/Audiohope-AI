'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/assessment',
  '/therapy',
  '/games',
  '/reports',
  '/monitoring',
  '/doctor',
  '/admin',
  '/settings',
  '/notifications',
];

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isProtectedRoute = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );

    if (isProtectedRoute) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || localStorage.getItem('token') : null;
      if (!token) {
        setAuthorized(false);
        router.push('/auth/login');
        return;
      }
    }
    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized && PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-white">Verifying Security Session...</p>
          <p className="text-xs text-slate-400">Redirecting to Authentication Portal if unverified.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
