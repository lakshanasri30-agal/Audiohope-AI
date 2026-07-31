'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { LineChart, Moon, Headphones, CheckCircle2, Save, ArrowRight, ArrowLeft } from 'lucide-react';

export default function MonitoringPage() {
  const { dailyLogs, updateDailyLogs } = useAppStore();
  const [saved, setSaved] = useState(false);

  const handleSaveLogs = (e: React.FormEvent) => {
    e.preventDefault();
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
              { label: 'Continuous Monitoring Tracker' },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <LineChart className="w-7 h-7 text-amber-400" /> Continuous Symptom & Health Tracker
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Log daily sleep efficiency, noise exposure, headphone usage, water intake & stress levels
              </p>
            </div>
            <Badge variant="amber" className="py-1.5 px-3">Live Log Sync</Badge>
          </div>

          <form onSubmit={handleSaveLogs} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Moon className="w-4 h-4 text-indigo-400" /> Sleep & Stress Monitoring
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Sleep Duration:</span>
                    <span className="text-indigo-400 font-mono">{dailyLogs.sleepHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={dailyLogs.sleepHours}
                    onChange={(e) => updateDailyLogs({ sleepHours: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Perceived Stress Rating (1-10):</span>
                    <span className="text-rose-400 font-mono">{dailyLogs.stressLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dailyLogs.stressLevel}
                    onChange={(e) => updateDailyLogs({ stressLevel: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Headphones className="w-4 h-4 text-cyan-400" /> Acoustic & Lifestyle Habits
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Headphone Usage Duration:</span>
                    <span className="text-cyan-400 font-mono">{dailyLogs.headphoneHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={dailyLogs.headphoneHours}
                    onChange={(e) => updateDailyLogs({ headphoneHours: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Hydration (Water Intake):</span>
                    <span className="text-teal-400 font-mono">{dailyLogs.waterIntakeOz} Oz (2.0L)</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="5"
                    value={dailyLogs.waterIntakeOz}
                    onChange={(e) => updateDailyLogs({ waterIntakeOz: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              </div>
            </GlassCard>

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
              <Link
                href="/therapy"
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Therapy
              </Link>

              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Daily logs updated!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Daily Logs
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
        </main>
      </div>
    </div>
  );
}
