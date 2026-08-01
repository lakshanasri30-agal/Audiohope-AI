'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { RehabGames } from '@/components/games/RehabGames';
import { Badge } from '@/components/ui/Badge';
import { Gamepad2, Sparkles } from 'lucide-react';

export default function GamesPage() {
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
                <Gamepad2 className="w-7 h-7 text-purple-400" /> Playable Hearing Rehabilitation Games
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                5 Web Audio-powered interactive auditory retraining games with score progression & achievements
              </p>
            </div>
            <Badge variant="purple" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Brain Plasticity Retraining
            </Badge>
          </div>

          <RehabGames />
        </main>
      </div>
    </div>
  );
}
