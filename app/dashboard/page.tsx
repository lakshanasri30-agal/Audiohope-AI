'use client';

import React, { useState, useEffect } from 'react';
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
  Heart,
  Volume2,
  Radio,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAppStore();

  // Real-time live biometrics telemetry state
  const [liveBpm, setLiveBpm] = useState(72);
  const [liveDb, setLiveDb] = useState(58);
  const [vagalIndex, setVagalIndex] = useState(84);

  // Live real-time biometrics ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBpm(68 + Math.floor(Math.random() * 8));
      setLiveDb(52 + Math.floor(Math.random() * 12));
      setVagalIndex(82 + Math.floor(Math.random() * 5));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

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

          {/* Real-time Live Biometrics Telemetry Strip */}
          <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold text-white uppercase tracking-wider">Real-Time Healthcare Telemetry</span>
                <Badge variant="cyan">Connected</Badge>
              </div>

              <div className="flex items-center gap-6 font-mono">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Heart className="w-4 h-4 animate-pulse fill-current" />
                  <span className="font-bold">{liveBpm} BPM</span>
                  <span className="text-[10px] text-slate-500 font-sans">Heart Rate</span>
                </div>

                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Volume2 className="w-4 h-4" />
                  <span className="font-bold">{liveDb} dB</span>
                  <span className="text-[10px] text-slate-500 font-sans">Ambient Noise</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">{vagalIndex}%</span>
                  <span className="text-[10px] text-slate-500 font-sans">Vagal Tone</span>
                </div>
              </div>
            </div>
          </GlassCard>

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
                    Follow the 9-step clinical journey from medical history to AI severity analysis.
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
                  <TrendingUp className="w-3.5 h-3.5" /> Optimal Baseline
                </span>
              </div>
              <ProgressRing value={user.healthScore || 88} size={76} strokeWidth={7} colorClass="text-cyan-400" />
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center justify-between border-teal-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Hearing Retraining Index</span>
                <span className="text-3xl font-extrabold text-teal-300 font-mono mt-1 block">{user.hearingScore}%</span>
                <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 mt-1">
                  <Sparkles className="w-3.5 h-3.5" /> Pitch Matched
                </span>
              </div>
              <ProgressRing value={user.hearingScore || 92} size={76} strokeWidth={7} colorClass="text-teal-400" />
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center justify-between border-emerald-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Overall Recovery Score</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">{user.recoveryScore}%</span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <Activity className="w-3.5 h-3.5" /> High Prognosis
                </span>
              </div>
              <ProgressRing value={user.recoveryScore || 85} size={76} strokeWidth={7} colorClass="text-emerald-400" />
            </GlassCard>

            <GlassCard hoverEffect className="flex items-center justify-between border-purple-500/30">
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">Daily Streak</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block flex items-center gap-1">
                  7 <Flame className="w-6 h-6 fill-current text-amber-400" />
                </span>
                <span className="text-[11px] text-slate-400 font-semibold mt-1 block">7 Days Perfect Log</span>
              </div>
              <ProgressRing value={100} size={76} strokeWidth={7} colorClass="text-amber-400" />
            </GlassCard>
          </div>

          {/* Main Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Weekly Trend & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Hearing Score Chart */}
              <GlassCard className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-cyan-400" /> Weekly Hearing Retraining Trend
                  </h3>
                  <Badge variant="cyan">7-Day Analysis</Badge>
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

              {/* Quick Action Navigation Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/therapy" className="block">
                  <GlassCard hoverEffect className="p-4 border-cyan-500/30 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Sound Therapy</h4>
                      <span className="text-[10px] text-slate-400">9 Noise Synthesizers</span>
                    </div>
                  </GlassCard>
                </Link>

                <Link href="/games" className="block">
                  <GlassCard hoverEffect className="p-4 border-purple-500/30 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Rehab Games</h4>
                      <span className="text-[10px] text-slate-400">5 Brain Retraining Games</span>
                    </div>
                  </GlassCard>
                </Link>

                <Link href="/reports" className="block">
                  <GlassCard hoverEffect className="p-4 border-emerald-500/30 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">PDF Reports</h4>
                      <span className="text-[10px] text-slate-400">Download Doctor Summary</span>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            </div>

            {/* Right Column: Today's Tasks & Schedule */}
            <div className="space-y-6">
              <GlassCard className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" /> Today's Rehabilitation Tasks
                  </h3>
                  <Badge variant="amber">2 of 4 Done</Badge>
                </div>

                <div className="space-y-3">
                  {todayTasks.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        t.done
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 ${t.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className={t.done ? 'line-through text-slate-400' : 'font-semibold'}>{t.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{t.time}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
