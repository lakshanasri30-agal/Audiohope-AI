'use client';

import React, { useState } from 'react';
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
  Play,
  Pause,
  Waves,
  Zap,
  TrendingUp,
  Brain,
  Award,
  ChevronRight,
  ShieldAlert,
  Volume2,
} from 'lucide-react';

export default function EnhancedLandingPage() {
  const [demoPlaying, setDemoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 overflow-hidden relative">
      {/* Ambient Glowing Background Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            AudioHope <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <Link href="#features" className="hover:text-cyan-400 transition-colors">Features</Link>
          <Link href="#journey" className="hover:text-cyan-400 transition-colors">Patient Journey</Link>
          <Link href="#portals" className="hover:text-cyan-400 transition-colors">Role Portals</Link>
          <Link href="/reports" className="hover:text-cyan-400 transition-colors">Clinical Reports</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-95 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            Launch Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24 z-10 w-full">
        <div className="text-center space-y-8 max-w-4xl mx-auto relative">
          <Badge variant="cyan" className="py-1.5 px-4 text-xs font-bold tracking-wider uppercase bg-cyan-500/10 border-cyan-500/30 text-cyan-300 inline-flex items-center gap-1.5 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> Next-Generation AI Tinnitus Platform
          </Badge>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Assess, Monitor & Retrain Tinnitus with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
              Precision AI
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            A digital therapeutic system integrating Apple Health metrics, real-time Web Audio sound therapy, gamified auditory retraining, and Explainable AI (XAI) insights for Patients and Audiologists.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              Open Patient Dashboard <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/assessment"
              className="px-9 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
            >
              Start Clinical Assessment <Activity className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>

        {/* Live Interactive Sound Therapy & Metrics Preview Hero Widget */}
        <GlassCard className="max-w-5xl mx-auto p-8 border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="cyan">Web Audio API Active</Badge>
                  <span className="text-xs text-slate-400 font-mono">Notch Target: 4,200 Hz</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Adaptive Notched Sound Therapy Synthesizer
                </h3>
              </div>
            </div>

            <button
              onClick={() => setDemoPlaying(!demoPlaying)}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                demoPlaying
                  ? 'bg-rose-500 text-white shadow-rose-500/30'
                  : 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-cyan-500/20 hover:scale-105'
              }`}
            >
              {demoPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{demoPlaying ? 'Stop Masker' : 'Test Sound Masker'}</span>
            </button>
          </div>

          {/* Real-time Animated Waveform Canvas Visualization */}
          <div className="flex items-end justify-center gap-2 h-20 mt-6 px-4">
            {[40, 65, 85, 50, 95, 70, 60, 90, 80, 45, 75, 95, 60, 85, 70, 90, 50, 65, 85, 60, 95, 75, 45, 80].map((h, i) => (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-300 ${
                  demoPlaying
                    ? 'bg-gradient-to-t from-cyan-400 via-teal-300 to-emerald-300 animate-pulse'
                    : 'bg-slate-800'
                }`}
                style={{ height: demoPlaying ? `${h}%` : '25%', animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </GlassCard>

        {/* Clinical Patient Journey Section */}
        <div id="journey" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="teal">Guided Patient Journey</Badge>
            <h2 className="text-3xl font-extrabold text-white mt-2">End-to-End Clinical Flow</h2>
            <p className="text-xs text-slate-400 mt-1">Seamless data pipeline connecting patients to audiologists</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '1. Multi-Step Assessment', desc: '9-step clinical wizard, audiogram plotting, THI questionnaire & Explainable AI SHAP drivers', icon: <Cpu className="w-6 h-6 text-cyan-400" /> },
              { title: '2. Web Audio Sound Therapy', desc: '9 customizable noise synthesizers centered at patient tinnitus notch frequency', icon: <Headphones className="w-6 h-6 text-teal-400" /> },
              { title: '3. Auditory Rehab Games', desc: '5 interactive games for pitch matching, stereo localization & brain retuning', icon: <Gamepad2 className="w-6 h-6 text-purple-400" /> },
              { title: '4. Doctor Portal & PDF Reports', desc: 'Audiologist roster review, baseline vs current progress charts & PDF export', icon: <Stethoscope className="w-6 h-6 text-emerald-400" /> },
            ].map((step, idx) => (
              <GlassCard key={idx} hoverEffect className="space-y-4 border-slate-800/80 bg-slate-900/60 p-6">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 w-fit">{step.icon}</div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Role Portals Workflows Section */}
        <div id="portals" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="purple">Role-Based Access</Badge>
            <h2 className="text-3xl font-extrabold text-white mt-2">Explore Tailored Platform Workflows</h2>
            <p className="text-xs text-slate-400 mt-1">Dedicated interfaces for Patients, Audiologists, and Administrators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Portal Card */}
            <GlassCard hoverEffect className="space-y-5 border-cyan-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Patient Portal</h3>
                  <p className="text-xs text-cyan-400 font-semibold">Personal Rehabilitation</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Apple Health + Fitbit Ring Progress Gauges</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Adaptive Notched Sound Masking Synthesizers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> 5 Auditory Brain Retraining Games</li>
              </ul>
              <Link
                href="/dashboard"
                className="block w-full py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-center font-bold text-xs hover:bg-cyan-500/30 transition-all shadow-lg shadow-cyan-500/10"
              >
                Launch Patient Workspace
              </Link>
            </GlassCard>

            {/* Audiologist Portal Card */}
            <GlassCard hoverEffect className="space-y-5 border-teal-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Audiologist Portal</h3>
                  <p className="text-xs text-teal-400 font-semibold">Clinical Decision Support</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Patient Roster & High-Risk Priority Alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Pure Tone Audiogram Curve Plotter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Treatment Approval & Notes Sync API</li>
              </ul>
              <Link
                href="/doctor"
                className="block w-full py-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-center font-bold text-xs hover:bg-teal-500/30 transition-all shadow-lg shadow-teal-500/10"
              >
                Launch Doctor Workspace
              </Link>
            </GlassCard>

            {/* Admin Console Card */}
            <GlassCard hoverEffect className="space-y-5 border-purple-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Admin Operations</h3>
                  <p className="text-xs text-purple-400 font-semibold">System Administration</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> ML Model Performance Metrics (RF/XGB)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Users, Doctors & Hospital Integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Security Audit Trail & Broadcast Alerts</li>
              </ul>
              <Link
                href="/admin"
                className="block w-full py-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-center font-bold text-xs hover:bg-purple-500/30 transition-all shadow-lg shadow-purple-500/10"
              >
                Launch Admin Console
              </Link>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 AudioHope AI Healthcare Platform. Built for clinical precision and patient empowerment.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Medical Disclaimer: AI output provides supportive decision-making guidance and does not replace evaluation by an audiologist or ENT specialist.
        </p>
      </footer>
    </div>
  );
}
