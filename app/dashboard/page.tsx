'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
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
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Compass,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAppStore();

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

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs */}
          <Breadcrumb items={[{ label: 'Patient Dashboard' }]} />

          {/* Guided Patient Journey CTA Banner */}
          <GlassCard className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/80 border-cyan-500/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan">Guided Patient Journey</Badge>
                    <span className="text-xs text-slate-400">Step-by-Step Clinical Care</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Ready to Start Your Guided Tinnitus Assessment?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Follow the 8-step clinical journey from medical history to AI severity analysis.
                  </p>
                </div>
              </div>

              <Link
                href="/assessment"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all shrink-0 flex items-center gap-1.5"
              >
                Start New Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </GlassCard>

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
          </div>

          {/* Health Score Ring Indicators Grid */}
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

          {/* Quick Actions Portal */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Guided Journey Modules</h3>
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
        </main>
      </div>
    </div>
  );
}
