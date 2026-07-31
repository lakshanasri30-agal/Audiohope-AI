'use client';

import React, { useState } from 'react';
import { RoleSwitcher } from './RoleSwitcher';
import { useAppStore } from '@/lib/store';
import { Bell, Search, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { notifications, markNotificationRead } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, tests, therapy..."
            className="pl-9 pr-4 py-1.5 bg-slate-950/60 border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-64 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Role Switcher, Notifications & Log Out */}
      <div className="flex items-center gap-3">
        <RoleSwitcher />

        {/* Logout Button */}
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
          className="px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
          title="Sign Out & Return to Landing Page"
        >
          Logout
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-full border border-slate-700/60 transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" /> Smart Notifications
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">{unreadCount} unread</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      n.read
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-800/60 border-cyan-500/30 text-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-cyan-300 flex items-center gap-1">
                        {n.type === 'alert' ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
