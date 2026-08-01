'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { AudioSynthesizer } from '@/components/therapy/AudioSynthesizer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Headphones, Brain, Sparkles, BookOpen, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function TherapyPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Assessment Journey', href: '/assessment' },
              { label: 'Sound Therapy Rehabilitation' },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Headphones className="w-7 h-7 text-cyan-400" /> Adaptive Web Audio Sound Therapy Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time Web Audio API sound synthesis, notched frequency masking & relaxation soundscapes
              </p>
            </div>
            <Badge variant="cyan" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Frequency Masking Active
            </Badge>
          </div>

          {/* Web Audio Synthesizer */}
          <AudioSynthesizer />

          {/* Next Journey Navigation Banner */}
          <GlassCard className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-purple-500/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-purple-400 font-bold uppercase tracking-wider block">
                  Next Stage in Patient Journey
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Play Auditory Rehabilitation Games or Log Daily Symptoms
                </h3>
                <p className="text-xs text-slate-400">
                  Brain plastic retuning games to decrease tinnitus awareness.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/games"
                  className="px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs hover:bg-purple-500/30 transition-all"
                >
                  Play Rehab Games
                </Link>
                <Link
                  href="/monitoring"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  Proceed to Daily Monitoring <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
