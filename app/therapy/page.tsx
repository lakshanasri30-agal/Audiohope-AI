'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { AudioSynthesizer } from '@/components/therapy/AudioSynthesizer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Headphones, Brain, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function TherapyPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Headphones className="w-7 h-7 text-cyan-400" /> Adaptive Web Audio Sound Therapy Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time Web Audio API sound synthesis, notched frequency masking, and relaxation soundscapes
              </p>
            </div>
            <Badge variant="cyan" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Frequency Masking Active
            </Badge>
          </div>

          {/* Web Audio Synthesizer */}
          <AudioSynthesizer />

          {/* CBT & Relaxation Exercises Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Complementary CBT & Mindfulness Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: '4-7-8 Tinnitus Breathing Exercise', duration: '5 mins', desc: 'Regulate autonomic nervous system arousal to lower auditory cortex hypersensitivity.', icon: <Brain className="w-5 h-5 text-cyan-400" /> },
                { title: 'Cognitive Reframing CBT Audio Guide', duration: '12 mins', desc: 'De-catastrophize ringing perceptions through structured cognitive exercises.', icon: <BookOpen className="w-5 h-5 text-teal-400" /> },
                { title: 'Sleep Soundscape & Deep Relaxation', duration: '30 mins', desc: 'Low-frequency delta binaural masking for rapid sleep onset.', icon: <Clock className="w-5 h-5 text-purple-400" /> },
              ].map((cbt, idx) => (
                <GlassCard key={idx} hoverEffect className="space-y-3 border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">{cbt.icon}</div>
                    <Badge variant="outline">{cbt.duration}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white">{cbt.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{cbt.desc}</p>
                  <button className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 hover:bg-slate-800 transition-all">
                    Start Guided Exercise
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
