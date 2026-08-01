'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Bell, Sun, Moon, LogOut, Activity } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, notifications, markNotificationRead } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const topNavTabs = [
    { href: '/dashboard', label: 'Dashboard & Prescription' },
    { href: '/assessment', label: 'THI Assessment' },
    { href: '/therapy', label: 'Sound Therapy Studio' },
    { href: '/games', label: 'Auditory Rehabilitation' },
    { href: '/monitoring', label: 'Daily Monitoring Log' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col gap-3 sticky top-0 z-40 shadow-xs">
      {/* Top Row: Brand & Account */}
      <div className="flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
            AH
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">AudioHope Clinical AI</h1>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[10px]">
              Enterprise
            </span>
          </div>
        </div>

        {/* Right Controls: Light Mode, Notifications & Sign Out */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-200 transition-all">
            <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-200 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Notifications</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{unreadCount} new</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.read ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-blue-50/50 border-blue-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <span className="font-bold text-blue-700">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account & Sign Out */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block">{user.name || 'Hehe'}</span>
              <span className="text-[10px] text-slate-500 font-semibold block">Patient Account</span>
            </div>

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
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tabbed Horizontal Menu matching screenshot */}
      <nav className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar">
        {topNavTabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
