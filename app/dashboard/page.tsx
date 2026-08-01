'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Heart,
  Volume2,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, setUser } = useAppStore();

  // Real-time live biometrics telemetry state
  const [liveBpm, setLiveBpm] = useState(72);
  const [liveDb, setLiveDb] = useState(58);
  const [vagalIndex, setVagalIndex] = useState(84);

  // Sync authenticated user profile from JWT or localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
        }
      } catch {}
    }
  }, []);

  // Live real-time biometrics ticker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBpm(68 + Math.floor(Math.random() * 8));
      setLiveDb(52 + Math.floor(Math.random() * 12));
      setVagalIndex(82 + Math.floor(Math.random() * 5));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <Navbar />

      <main className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Title Header Matching Screenshot */}
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Overview: <span className="text-blue-600 font-black">{user.name || 'Hehe'}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Clinical treatment plan and continuous monitoring status.
          </p>
        </div>

        {/* Prescription Status Hero Card Matching Screenshot */}
        <GlassCard className="p-6 md:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>AWAITING AUDIOLOGIST PRESCRIPTION</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
              No Active Doctor Prescription Yet
            </h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-3xl">
              Your THI assessment survey has been recorded in the database. Your assigned audiologist will review your report and pure-tone hearing thresholds to issue a customized notch-filter treatment plan.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/assessment"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2"
            >
              View / Retake THI Assessment Questionnaire <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </GlassCard>

        {/* 3 Module Navigation Cards Matching Screenshot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Sound Therapy Studio */}
          <GlassCard className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">1. Sound Therapy Studio</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Execute your daily 15-minute pitch-masking noise session calibrated to your tinnitus frequency.
              </p>
            </div>

            <Link
              href="/therapy"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-all block w-full"
            >
              Open Sound Studio →
            </Link>
          </GlassCard>

          {/* Card 2: Auditory Brain Training */}
          <GlassCard className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">2. Auditory Brain Training</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Engage in auditory pitch perception and frequency discrimination exercises.
              </p>
            </div>

            <Link
              href="/games"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-all block w-full"
            >
              Open Training Center →
            </Link>
          </GlassCard>

          {/* Card 3: Daily Monitoring Log */}
          <GlassCard className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-slate-900">3. Daily Monitoring Log</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Record your daily sleep duration, stress score, and noise metrics for longitudinal analysis.
              </p>
            </div>

            <Link
              href="/monitoring"
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-all block w-full"
            >
              Update Log Entry →
            </Link>
          </GlassCard>
        </div>

        {/* Real-time Live Biometrics Strip */}
        <GlassCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">Live Healthcare Telemetry</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">Connected</span>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div className="flex items-center gap-1.5 text-rose-600">
              <Heart className="w-4 h-4 animate-pulse fill-current" />
              <span className="font-bold">{liveBpm} BPM</span>
              <span className="text-[10px] text-slate-500 font-sans">Heart Rate</span>
            </div>

            <div className="flex items-center gap-1.5 text-blue-600">
              <Volume2 className="w-4 h-4" />
              <span className="font-bold">{liveDb} dB</span>
              <span className="text-[10px] text-slate-500 font-sans">Ambient Noise</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{vagalIndex}%</span>
              <span className="text-[10px] text-slate-500 font-sans">Vagal Tone</span>
            </div>
          </div>
        </GlassCard>

        {/* Health Score Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Today's Health Score</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">{user.healthScore || 88}</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Optimal Baseline
              </span>
            </div>
            <ProgressRing value={user.healthScore || 88} size={76} strokeWidth={7} colorClass="text-blue-600" />
          </GlassCard>

          <GlassCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Hearing Retraining</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">{user.hearingScore || 92}%</span>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
                <Sparkles className="w-3.5 h-3.5" /> Pitch Matched
              </span>
            </div>
            <ProgressRing value={user.hearingScore || 92} size={76} strokeWidth={7} colorClass="text-indigo-600" />
          </GlassCard>

          <GlassCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Recovery Score</span>
              <span className="text-3xl font-extrabold text-emerald-600 font-mono mt-1 block">{user.recoveryScore || 85}%</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <Activity className="w-3.5 h-3.5" /> High Prognosis
              </span>
            </div>
            <ProgressRing value={user.recoveryScore || 85} size={76} strokeWidth={7} colorClass="text-emerald-500" />
          </GlassCard>

          <GlassCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block uppercase">Daily Log Streak</span>
              <span className="text-3xl font-extrabold text-amber-500 font-mono mt-1 block flex items-center gap-1">
                7 <Flame className="w-6 h-6 fill-current text-amber-500" />
              </span>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">7 Days Perfect Streak</span>
            </div>
          </GlassCard>
        </div>

        {/* 30-Day Recovery Trend Chart */}
        <GlassCard className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Longitudinal Tinnitus Recovery Trend
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">30-day symptom mitigation & acoustic habituation score</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
              30-Day Analytics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_WEEKLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="hearingScore" stroke="#2563eb" strokeWidth={3} fill="url(#blueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
