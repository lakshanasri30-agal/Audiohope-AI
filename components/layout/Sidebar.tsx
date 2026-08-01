'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ClipboardList,
  Headphones,
  Gamepad2,
  LineChart,
  FileSpreadsheet,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const patientNav = [
    { href: '/dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
    { href: '/assessment', label: 'AI Assessment', icon: <ClipboardList className="w-5 h-5" /> },
    { href: '/therapy', label: 'Sound Therapy', icon: <Headphones className="w-5 h-5" /> },
    { href: '/games', label: 'Hearing Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { href: '/monitoring', label: 'Monitoring Log', icon: <LineChart className="w-5 h-5" /> },
    { href: '/reports', label: 'Clinical Reports', icon: <FileSpreadsheet className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              AudioHope <span className="text-cyan-400 text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Tinnitus Rehabilitation</p>
          </div>
        </div>

        {/* Menu Section Label */}
        <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Patient Portal
        </p>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {patientNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings & AI Badge */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </Link>

          <button
            onClick={() => {
              try {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('audiohope_assessment_progress');
              } catch {}
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>

        {/* AI Medical Disclaimer Box */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patient Assistance</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            AI recommendations complement ENT specialist care and do not replace formal medical diagnosis.
          </p>
        </div>
      </div>
    </aside>
  );
};
