'use client';

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MOCK_AUDIOGRAM_DATA } from '@/lib/mockData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Activity, Upload, CheckCircle2 } from 'lucide-react';

export const AudiogramPlotter: React.FC = () => {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pure Tone Audiogram Curve</h4>
        </div>
        <Badge variant="cyan">Clinical Standards (dB HL)</Badge>
      </div>

      <p className="text-xs text-slate-400">
        Plotting hearing thresholds across frequencies (250Hz - 8000Hz). Inverted Y-axis per audiometric standards.
      </p>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_AUDIOGRAM_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="freq" stroke="#94a3b8" tick={{ fontSize: 11 }} unit="Hz" />
            <YAxis reversed domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} unit="dB" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="left" stroke="#38bdf8" name="Left Ear (X)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="right" stroke="#f43f5e" name="Right Ear (O)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="normal" stroke="#06d6a0" name="Normal Limit (20dB)" strokeDasharray="4 4" strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Left Ear Threshold</span>
          <span className="text-cyan-400 font-bold">Mild Drop @ 4kHz (45 dB)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Right Ear Threshold</span>
          <span className="text-rose-400 font-bold">Notch @ 6kHz (50 dB)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Speech Discrimination</span>
          <span className="text-teal-400 font-bold">96% Accuracy</span>
        </div>
      </div>
    </GlassCard>
  );
};
