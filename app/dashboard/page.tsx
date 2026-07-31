'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { MOCK_WEEKLY_TRENDS } from '@/lib/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Activity,
  ClipboardList,
  Headphones,
  Gamepad2,
  LineChart,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, dailyLogs, notifications } = useAppStore();

  const todayTasks = [
    { title: 'Completed 20-min Notched Sound Therapy', done: true, time: '08:30 AM', category: 'Therapy' },
    { title: 'Log Evening Sleep & Stress Ratings', done: false, time: '08:00 PM', category: 'Monitoring' },
    { title: 'Play Frequency Pitch Matching Game', done: false, time: '06:00 PM', category: 'Rehab' },
    { title: 'Drink 2.5L Water Goal', done: true, time: 'All Day', category: 'Health' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Good Morning, {user.name} 👋
                </h2>
                <Badge variant="cyan" className="py-1">Active Rehabilitation</Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Your AI personalized acoustic therapy plan is active. Pitch target: <span className="text-cyan-400 font-mono font-bold">{user.tinnitusPitchHz} Hz</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/assessment"
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
              >
                <ClipboardList className="w-4 h-4" /> Start AI Assessment
              </Link>
              <Link
                href="/therapy"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <Headphones className="w-4 h-4" /> Launch Sound Therapy
              </Link>
            </div>
          </div>

          {/* Today's Health Ring Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard hoverEffect className="flex items-center justify-between border-cyan-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Today's Health Score</span>
                <span className="text-3xl font-extrabold text-white font-mono mt-1 block">{user.healthScore}</span>
                <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +4% from last week
                </span>
              </div>
              <ProgressRing value={user.healthScore || 82} size={84} strokeWidth={8} colorClass="text-cyan-400" />
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center justify-between border-teal-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Hearing Score</span>
                <span className="text-3xl font-extrabold text-white font-mono mt-1 block">{user.hearingScore}</span>
                <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 mt-1">
                  <Activity className="w-3.5 h-3.5" /> 4.2kHz Notched Limit
                </span>
              </div>
              <ProgressRing value={user.hearingScore || 78} size={84} strokeWidth={8} colorClass="text-teal-400" />
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center justify-between border-purple-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">AI Severity</span>
                <span className="text-2xl font-extrabold text-purple-300 mt-1 block">{user.tinnitusSeverity}</span>
                <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1 mt-1">
                  <Sparkles className="w-3.5 h-3.5" /> 94% Model Confidence
                </span>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm">
                48 THI
              </div>
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center justify-between border-emerald-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Recovery Score</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">{user.recoveryScore}%</span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> 7-Day Rehab Streak
                </span>
              </div>
              <ProgressRing value={user.recoveryScore || 85} size={84} strokeWidth={8} colorClass="text-emerald-400" />
            </GlassCard>
          </div>

          {/* Quick Actions Bar */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Quick Actions Portal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: 'Assessment', href: '/assessment', icon: <ClipboardList className="w-5 h-5 text-cyan-400" /> },
                { label: 'Sound Therapy', href: '/therapy', icon: <Headphones className="w-5 h-5 text-teal-400" /> },
                { label: 'Rehab Games', href: '/games', icon: <Gamepad2 className="w-5 h-5 text-purple-400" /> },
                { label: 'Daily Logs', href: '/monitoring', icon: <LineChart className="w-5 h-5 text-amber-400" /> },
                { label: 'PDF Reports', href: '/reports', icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> },
                { label: 'Doctor Notes', href: '/doctor', icon: <Activity className="w-5 h-5 text-rose-400" /> },
              ].map((act, idx) => (
                <Link
                  key={idx}
                  href={act.href}
                  className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all text-center group"
                >
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                    {act.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{act.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Grid: Weekly Recovery Trend & Today's Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Hearing Improvement Chart */}
            <GlassCard className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" /> Weekly Recovery Index Trend
                  </h3>
                  <p className="text-xs text-slate-400">7-day continuous acoustic recovery and therapy completion</p>
                </div>
                <Badge variant="teal">Live AI Stream</Badge>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_WEEKLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHearing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="hearingScore" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorHearing)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Today's Clinical Rehabilitation Tasks */}
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" /> Today's Rehabilitation Tasks
                </h3>
                <span className="text-xs text-slate-400 font-mono">2 / 4 Done</span>
              </div>

              <div className="space-y-3">
                {todayTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      t.done
                        ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 line-through'
                        : 'bg-slate-900/80 border-cyan-500/30 text-white shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      readOnly
                      className="mt-0.5 rounded accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" /> {t.time} • <span className="text-cyan-400">{t.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/therapy"
                className="block w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-semibold text-cyan-400 hover:bg-slate-900 transition-all mt-4"
              >
                Complete Remaining Tasks
              </Link>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
