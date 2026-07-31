'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { MOCK_AI_MODELS, MOCK_SYSTEM_LOGS } from '@/lib/mockData';
import {
  ShieldCheck,
  Cpu,
  Users,
  Building2,
  LineChart,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-7 h-7 text-purple-400" /> Administrator & AI Model Console
                </h2>
                <Badge variant="purple" className="py-1">System Status: Optimal</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage users, doctors, hospitals, ML inference pipelines & audit logs
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="border-purple-500/30">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Platform Users</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-3xl font-extrabold text-white font-mono">1,420</span>
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </GlassCard>

            <GlassCard className="border-cyan-500/30">
              <span className="text-xs text-slate-400 font-semibold uppercase">Active Audiologists</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-3xl font-extrabold text-white font-mono">84</span>
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
            </GlassCard>

            <GlassCard className="border-teal-500/30">
              <span className="text-xs text-slate-400 font-semibold uppercase">AI Inferences / Day</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-3xl font-extrabold text-white font-mono">3,890</span>
                <Cpu className="w-6 h-6 text-teal-400" />
              </div>
            </GlassCard>

            <GlassCard className="border-emerald-500/30">
              <span className="text-xs text-slate-400 font-semibold uppercase">Avg ML Accuracy</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">94.2%</span>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
            </GlassCard>
          </div>

          {/* Machine Learning Models Monitor */}
          <GlassCard className="space-y-4 border-purple-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" /> Active Machine Learning Pipeline Models
              </h3>
              <Badge variant="purple">4 Models Deployed</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_AI_MODELS.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{m.name}</span>
                    <Badge variant="cyan">{m.version}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Target Output: <span className="text-cyan-300 font-semibold">{m.target}</span></p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 font-mono">
                    <span className="text-slate-400">Accuracy: <strong className="text-emerald-400">{m.accuracy}</strong></span>
                    <span className="text-purple-400 font-semibold">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* System Security Audit Trail */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-cyan-400" /> HIPAA Security & System Audit Logs
              </h3>
              <span className="text-xs text-slate-500 font-mono">Real-time Security Feed</span>
            </div>

            <div className="space-y-2">
              {MOCK_SYSTEM_LOGS.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500">{log.timestamp}</span>
                    <span className="font-bold text-white">{log.user}</span>
                    <span className="text-slate-300">{log.action}</span>
                  </div>
                  <span className="font-mono text-[11px] text-cyan-400">{log.ip}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
