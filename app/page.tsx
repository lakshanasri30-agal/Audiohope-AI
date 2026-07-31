'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Activity,
  Stethoscope,
  ShieldCheck,
  Headphones,
  Gamepad2,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AudioHope <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            Launch Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="cyan" className="py-1 px-4 text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Next-Generation AI Tinnitus Platform
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Assess, Monitor & Retrain Tinnitus with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Precision AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Combining Apple Health aesthetics, Web Audio masking synthesis, gamified auditory training, and explainable AI insights for Patients, Audiologists, and ENT Specialists.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
            >
              Open Interactive Demo Portal
            </Link>
            <Link
              href="/assessment"
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Start Tinnitus Assessment
            </Link>
          </div>
        </div>

        {/* Clinical Journey Workflow */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">End-to-End Clinical Patient Journey</h2>
            <p className="text-xs text-slate-400 mt-1">Seamless data pipeline connecting patients to audiologists</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: '1. AI Assessment', desc: 'Audiogram plotting, THI questionnaire & Explainable AI SHAP drivers', icon: <Cpu className="w-6 h-6 text-cyan-400" /> },
              { title: '2. Sound Therapy', desc: 'Real-time Web Audio notched noise synthesis centered at tinnitus pitch', icon: <Headphones className="w-6 h-6 text-teal-400" /> },
              { title: '3. Gamified Rehab', desc: '5 interactive auditory games for brain retraining & sound localization', icon: <Gamepad2 className="w-6 h-6 text-purple-400" /> },
              { title: '4. Doctor Portal', desc: 'Audiologist roster review, treatment plan approvals & clinical PDF export', icon: <Stethoscope className="w-6 h-6 text-emerald-400" /> },
            ].map((step, idx) => (
              <GlassCard key={idx} hoverEffect className="space-y-3 border-slate-800">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 w-fit">{step.icon}</div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Portal Role Switcher Cards */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Explore Role Workflows</h2>
            <p className="text-xs text-slate-400 mt-1">Select a role to preview tailored medical features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard hoverEffect className="space-y-4 border-cyan-500/30">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Patient Portal</h3>
                  <p className="text-xs text-cyan-400">Personal Rehabilitation</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Daily Health & Hearing Score Rings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Adaptive Notched Sound Masking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> 5 Playable Hearing Rehabilitation Games</li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-center font-bold text-xs hover:bg-cyan-500/30 transition-all"
              >
                Launch Patient View
              </Link>
            </GlassCard>

            <GlassCard hoverEffect className="space-y-4 border-teal-500/30">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Audiologist Portal</h3>
                  <p className="text-xs text-teal-400">Clinical Decision Support</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Patient Roster & Risk Alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Pure Tone Audiogram Curve Plotter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Treatment Approval & Notes Editor</li>
              </ul>
              <Link
                href="/doctor"
                className="block w-full py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-center font-bold text-xs hover:bg-teal-500/30 transition-all"
              >
                Launch Doctor View
              </Link>
            </GlassCard>

            <GlassCard hoverEffect className="space-y-4 border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Admin Console</h3>
                  <p className="text-xs text-purple-400">System Management</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> ML Model Performance Metrics (RF/XGB)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> User, Doctor & Hospital Directories</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Security Audit Logging & Alerts</li>
              </ul>
              <Link
                href="/admin"
                className="block w-full py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-center font-bold text-xs hover:bg-purple-500/30 transition-all"
              >
                Launch Admin View
              </Link>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 AudioHope AI Healthcare Platform. Built for clinical precision and patient empowerment.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Medical Disclaimer: AI output provides supportive decision-making guidance and does not replace evaluation by an audiologist or ENT specialist.
        </p>
      </footer>
    </div>
  );
}
