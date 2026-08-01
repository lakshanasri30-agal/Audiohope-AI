'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { submitDailyMonitoringLog } from '@/lib/api';
import { MOCK_WEEKLY_TRENDS } from '@/lib/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import {
  LineChart,
  Moon,
  Headphones,
  CheckCircle2,
  Save,
  ArrowRight,
  ArrowLeft,
  Smile,
  Dumbbell,
  Droplet,
  Pill,
  Volume2,
  Tv,
  Activity,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function EnhancedMonitoringPage() {
  const { dailyLogs, updateDailyLogs, user, setUser } = useAppStore();
  const [saved, setSaved] = useState(false);

  // Collected Daily Metrics State
  const [sleepHours, setSleepHours] = useState<number>(dailyLogs.sleepHours || 7.0);
  const [stressLevel, setStressLevel] = useState<number>(dailyLogs.stressLevel || 4);
  const [medicationTaken, setMedicationTaken] = useState<boolean>(dailyLogs.medicationTaken ?? true);
  const [medicationName, setMedicationName] = useState<string>('Multivitamins & Melatonin');
  const [noiseExposureHours, setNoiseExposureHours] = useState<number>(3.5);
  const [screenTimeHours, setScreenTimeHours] = useState<number>(6.5);
  const [mood, setMood] = useState<'Calm' | 'Happy' | 'Neutral' | 'Anxious' | 'Frustrated'>('Calm');
  const [exerciseMins, setExerciseMins] = useState<number>(30);
  const [waterIntakeOz, setWaterIntakeOz] = useState<number>(dailyLogs.waterIntakeOz || 64);

  // Calculated Dynamic Scores
  const calculateDailyHealthScore = (): number => {
    const sleepPoints = Math.min(30, sleepHours * 4);
    const stressPoints = Math.max(0, 30 - stressLevel * 3);
    const hydrationPoints = Math.min(20, (waterIntakeOz / 64) * 20);
    const exercisePoints = Math.min(20, (exerciseMins / 30) * 20);
    return Math.round(sleepPoints + stressPoints + hydrationPoints + exercisePoints);
  };

  const calculateRecoveryScore = (): number => {
    const base = user.recoveryScore || 85;
    const delta = (sleepHours >= 7 ? 1 : -1) + (stressLevel <= 5 ? 1 : -1) + (medicationTaken ? 1 : 0);
    return Math.min(99, Math.max(50, base + delta));
  };

  const currentHealthScore = calculateDailyHealthScore();
  const currentRecoveryScore = calculateRecoveryScore();

  // Mock Monthly Recovery Trend Data (30-day projection)
  const monthlyTrendData = [
    { week: 'Week 1', recovery: 72, health: 75, stress: 7 },
    { week: 'Week 2', recovery: 78, health: 80, stress: 5 },
    { week: 'Week 3', recovery: 82, health: 84, stress: 4 },
    { week: 'Week 4', recovery: 87, health: 88, stress: 3 },
  ];

  const handleSaveLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyLogs({
      sleepHours,
      stressLevel,
      waterIntakeOz,
      headphoneHours: noiseExposureHours,
      medicationTaken,
    });

    setUser({
      healthScore: currentHealthScore,
      recoveryScore: currentRecoveryScore,
    });

    await submitDailyMonitoringLog({
      patient_id: user.id || 'usr_patient_101',
      sleep_hours: sleepHours,
      stress_level: stressLevel,
      headphone_hours: noiseExposureHours,
      water_intake_oz: waterIntakeOz,
      medication_taken: medicationTaken,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Therapy & Games', href: '/therapy' },
              { label: 'Continuous Monitoring & Daily Log' },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <LineChart className="w-7 h-7 text-amber-400" /> Continuous Symptom & Health Tracker
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Log daily sleep, stress, noise, screen time, exercise, water, mood & medication to update AI recovery score
              </p>
            </div>
            <Badge variant="amber" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Dynamic Score Engine Active
            </Badge>
          </div>

          {/* Generated Health Score & Recovery Score Dashboard Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="flex items-center justify-between border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Daily Health Score</span>
                <span className="text-3xl font-extrabold text-white font-mono mt-1 block">{currentHealthScore}</span>
                <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Optimal Baseline
                </span>
              </div>
              <ProgressRing value={currentHealthScore} size={76} strokeWidth={7} colorClass="text-cyan-400" />
            </GlassCard>

            <GlassCard className="flex items-center justify-between border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Overall Recovery Score</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">{currentRecoveryScore}%</span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <Activity className="w-3.5 h-3.5" /> High Retraining Potential
                </span>
              </div>
              <ProgressRing value={currentRecoveryScore} size={76} strokeWidth={7} colorClass="text-emerald-400" />
            </GlassCard>

            <GlassCard className="flex items-center justify-between border-purple-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Daily Mood Rating</span>
                <span className="text-2xl font-extrabold text-purple-300 mt-1 block">{mood}</span>
                <span className="text-[11px] text-purple-400 font-semibold">Vagal Tone Balance</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Smile className="w-7 h-7" />
              </div>
            </GlassCard>

            <GlassCard className="flex items-center justify-between border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Medication Status</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block">
                  {medicationTaken ? 'Completed' : 'Pending'}
                </span>
                <span className="text-[11px] text-slate-400 block truncate max-w-[130px]">{medicationName}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                <Pill className="w-7 h-7" />
              </div>
            </GlassCard>
          </div>

          {/* 8-Metric Input Collection Form Grid */}
          <form onSubmit={handleSaveLogs} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Sleep & Stress */}
              <GlassCard className="space-y-4 border-indigo-500/30">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Moon className="w-4 h-4 text-indigo-400" /> 1. Sleep & Stress Ratings
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Nightly Sleep Duration:</span>
                      <span className="text-indigo-400 font-mono font-bold">{sleepHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.5"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Perceived Stress Level (1-10):</span>
                      <span className="text-rose-400 font-mono font-bold">{stressLevel} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Card 2: Noise, Screen Time & Exercise */}
              <GlassCard className="space-y-4 border-cyan-500/30">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Volume2 className="w-4 h-4 text-cyan-400" /> 2. Acoustic Exposure & Activity
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Noise Exposure Hours:</span>
                      <span className="text-cyan-400 font-mono font-bold">{noiseExposureHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="0.5"
                      value={noiseExposureHours}
                      onChange={(e) => setNoiseExposureHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Daily Screen Time:</span>
                      <span className="text-purple-400 font-mono font-bold">{screenTimeHours} Hours</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      step="0.5"
                      value={screenTimeHours}
                      onChange={(e) => setScreenTimeHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Card 3: Water, Mood & Medication */}
              <GlassCard className="space-y-4 border-teal-500/30">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Droplet className="w-4 h-4 text-teal-400" /> 3. Hydration, Mood & Medication
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Hydration (Water Intake):</span>
                      <span className="text-teal-400 font-mono font-bold">{waterIntakeOz} Oz (2.0L)</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="5"
                      value={waterIntakeOz}
                      onChange={(e) => setWaterIntakeOz(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold block">Daily Mood State</label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value as any)}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                    >
                      <option>Calm</option>
                      <option>Happy</option>
                      <option>Neutral</option>
                      <option>Anxious</option>
                      <option>Frustrated</option>
                    </select>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/therapy"
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Therapy
              </Link>

              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Daily logs updated & Scores calculated!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Daily Log & Update Scores
                </button>
                <Link
                  href="/reports"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  View Clinical Report <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </form>

          {/* Interactive Recharts Progress & Monthly Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Chart 1: Weekly Progress Chart */}
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" /> Weekly Health & Hearing Progress
                </h3>
                <Badge variant="cyan">7-Day Stream</Badge>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_WEEKLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="hearingScore" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Chart 2: Monthly Recovery Trend Chart */}
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly 30-Day Recovery Trend
                </h3>
                <Badge variant="emerald">Prognostic Recovery</Badge>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="recovery" stroke="#06d6a0" strokeWidth={3} dot={{ r: 4 }} name="Recovery Index %" />
                    <Line type="monotone" dataKey="health" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" name="Health Score" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
