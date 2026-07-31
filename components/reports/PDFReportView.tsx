'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { MOCK_PATIENTS, MOCK_WEEKLY_TRENDS } from '@/lib/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Printer,
  FileCheck,
  Stethoscope,
  ShieldCheck,
  Moon,
  HeartPulse,
  Volume2,
  Headphones,
  Gamepad2,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export const PDFReportView: React.FC = () => {
  const { user, userLevel, userPoints } = useAppStore();
  const [reportInterval, setReportInterval] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const patient = MOCK_PATIENTS[0];

  const handlePrint = () => {
    window.print();
  };

  // Mock Trend Datasets per interval
  const dailyData = [
    { time: '08:00 AM', recovery: 82, sleep: 7.0, stress: 5, noise: 2.0 },
    { time: '12:00 PM', recovery: 84, sleep: 7.0, stress: 6, noise: 4.5 },
    { time: '04:00 PM', recovery: 85, sleep: 7.0, stress: 4, noise: 3.0 },
    { time: '08:00 PM', recovery: 87, sleep: 7.0, stress: 3, noise: 1.5 },
  ];

  const weeklyData = MOCK_WEEKLY_TRENDS.map((d) => ({
    time: d.day,
    recovery: d.hearingScore,
    sleep: d.sleepHours,
    stress: d.stress,
    noise: 3.5,
  }));

  const monthlyData = [
    { time: 'Week 1', recovery: 72, sleep: 6.2, stress: 7, noise: 4.5 },
    { time: 'Week 2', recovery: 78, sleep: 6.8, stress: 5, noise: 3.8 },
    { time: 'Week 3', recovery: 82, sleep: 7.4, stress: 4, noise: 3.0 },
    { time: 'Week 4', recovery: 87, sleep: 7.8, stress: 3, noise: 2.5 },
  ];

  const activeData = reportInterval === 'Daily' ? dailyData : reportInterval === 'Weekly' ? weeklyData : monthlyData;

  return (
    <div className="space-y-6">
      {/* Top Controls: Interval Switcher & Print Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Clinical Progress & AI Reports</h3>
          <p className="text-xs text-slate-400">Exportable medical summary for Audiologist review</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Report Interval Selector */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((interval) => (
              <button
                key={interval}
                onClick={() => setReportInterval(interval)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  reportInterval === interval
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {interval}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:opacity-95"
          >
            <Printer className="w-4 h-4" /> Download / Print PDF
          </button>
        </div>
      </div>

      {/* Progress Cards Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-cyan-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase">Therapy Progress</span>
            <Headphones className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-mono mt-1 block">92% Adherence</span>
          <span className="text-[11px] text-cyan-400 font-mono">14 Sessions • {user.tinnitusPitchHz} Hz</span>
        </GlassCard>

        <GlassCard className="p-4 border-purple-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase">Game Progress</span>
            <Gamepad2 className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-extrabold text-purple-300 font-mono mt-1 block">Level {userLevel || 4} Master</span>
          <span className="text-[11px] text-purple-400 font-mono">{userPoints || 1450} Total XP</span>
        </GlassCard>

        <GlassCard className="p-4 border-indigo-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase">Sleep Quality Trend</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-extrabold text-indigo-300 font-mono mt-1 block">7.4 Hours / Night</span>
          <span className="text-[11px] text-teal-400 font-semibold">+1.2h Improvement</span>
        </GlassCard>

        <GlassCard className="p-4 border-rose-500/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase">Stress Index Trend</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-extrabold text-rose-300 font-mono mt-1 block">3.8 / 10 Index</span>
          <span className="text-[11px] text-emerald-400 font-semibold">-32% Stress Reduction</span>
        </GlassCard>
      </div>

      {/* AI Insights & Observations Callout */}
      <GlassCard className="space-y-2 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" /> {reportInterval} AI Clinical Observations & Insights
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The {reportInterval.toLowerCase()} AI diagnostic engine detected a <strong className="text-emerald-400">+12% increase</strong> in acoustic habituation score. Consistent adherence to 4.2 kHz notched pink noise sound therapy combined with 7+ hours nightly sleep has significantly reduced central auditory cortex hypersensitivity.
        </p>
      </GlassCard>

      {/* Recharts Trends Grid: Recovery, Sleep, Stress & Noise Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Trend */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> {reportInterval} Recovery Trend (%)
            </h4>
            <Badge variant="cyan">{reportInterval}</Badge>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="recovery" stroke="#38bdf8" strokeWidth={2.5} fill="#38bdf8" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Sleep & Stress Trend */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-400" /> {reportInterval} Sleep vs Stress Trend
            </h4>
            <Badge variant="purple">{reportInterval}</Badge>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="sleep" stroke="#818cf8" strokeWidth={2} name="Sleep (Hours)" />
                <Line type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={2} name="Stress Rating" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Formal Printable Document */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 print:bg-white print:text-black print:p-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-lg">
              A
            </div>
            <div>
              <h2 className="text-lg font-bold text-white print:text-black">AudioHope AI Clinical Diagnostic Report</h2>
              <p className="text-xs text-slate-400 print:text-gray-600">Interval: {reportInterval} Summary • Ref ID: #AH-2026-8921</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block print:text-gray-600">Generated Date</span>
            <span className="font-bold text-white print:text-black font-mono">July 31, 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-gray-100 print:border-gray-300 print:text-black">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Patient Name</span>
            <span className="text-xs font-bold text-white print:text-black">{patient.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Age / Gender</span>
            <span className="text-xs font-bold text-white print:text-black">{patient.age} yrs / {patient.gender}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Primary Ear</span>
            <span className="text-xs font-bold text-cyan-400">{patient.primaryEar}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Tinnitus Pitch</span>
            <span className="text-xs font-bold text-teal-400 font-mono">{user.tinnitusPitchHz || 4200} Hz</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2 print:bg-gray-50 print:border-gray-400 print:text-black">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 print:text-black">
            <Stethoscope className="w-4 h-4" /> Audiologist Clinical Notes & Plan Approval
          </div>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            {patient.doctorNotes}
          </p>
        </div>

        <div className="text-[10px] text-slate-500 print:text-gray-500 border-t border-slate-800 pt-4 flex items-center justify-between">
          <span>AudioHope AI Healthcare Platform v1.0 • Clinical Decision Support Systems</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-cyan-400" /> HIPAA / GDPR Compliant Standards</span>
        </div>
      </div>
    </div>
  );
};
