'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { audioEngine } from '@/lib/audio/synthesizer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Pause,
  Volume2,
  Sliders,
  Clock,
  Sparkles,
  Waves,
  CloudRain,
  Trees,
  Wind,
  Disc,
} from 'lucide-react';

export const AudioSynthesizer: React.FC = () => {
  const { soundState, setSoundState, user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const soundPresets = [
    { id: 'notch_masking', name: 'Personalized Frequency Masking', icon: <Sparkles className="w-5 h-5 text-cyan-400" />, desc: `Notched sound centered at ${user.tinnitusPitchHz || 4200} Hz`, recommended: true },
    { id: 'pink', name: 'Pink Noise (Balanced)', icon: <Disc className="w-5 h-5 text-teal-400" />, desc: 'Equal energy per octave, ideal for tinnitus relaxation' },
    { id: 'ocean', name: 'Ocean Waves (LFO)', icon: <Waves className="w-5 h-5 text-blue-400" />, desc: 'Rhythmic low-frequency sweep to reduce hyperacusis' },
    { id: 'rain', name: 'Rainfall & Soft Drops', icon: <CloudRain className="w-5 h-5 text-indigo-400" />, desc: 'High-frequency acoustic masking soundscape' },
    { id: 'brown', name: 'Deep Brown Noise', icon: <Wind className="w-5 h-5 text-amber-400" />, desc: 'Warm, low-frequency sound mask for intense focus' },
    { id: 'forest', name: 'Forest Harmonics', icon: <Trees className="w-5 h-5 text-emerald-400" />, desc: 'Natural ambient acoustic environment' },
    { id: 'white', name: 'Pure White Noise', icon: <Disc className="w-5 h-5 text-slate-400" />, desc: 'Full spectrum flat frequency masking' },
  ];

  const handleTogglePlay = () => {
    if (soundState.isPlaying) {
      audioEngine.stopTherapy();
      setSoundState({ isPlaying: false });
    } else {
      audioEngine.startTherapy(
        soundState.activeSound,
        soundState.volume,
        soundState.notchFrequency || user.tinnitusPitchHz || 4200
      );
      setSoundState({ isPlaying: true });
    }
  };

  const handleSoundSelect = (id: string) => {
    setSoundState({ activeSound: id });
    if (soundState.isPlaying) {
      audioEngine.startTherapy(
        id,
        soundState.volume,
        soundState.notchFrequency || user.tinnitusPitchHz || 4200
      );
    }
  };

  const handleVolumeChange = (v: number) => {
    setSoundState({ volume: v });
    audioEngine.setVolume(v);
  };

  const handleFreqChange = (freq: number) => {
    setSoundState({ notchFrequency: freq });
    audioEngine.setFrequency(freq);
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopTherapy();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Synthesizer Control Deck */}
      <GlassCard className="border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Active Sound Info */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              soundState.isPlaying
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan animate-pulse-wave'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}>
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="cyan">AI Recommended</Badge>
                <span className="text-xs text-slate-400 font-mono">Target Notch: {soundState.notchFrequency} Hz</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1 capitalize">
                {soundPresets.find((s) => s.id === soundState.activeSound)?.name || 'Custom Therapy'}
              </h3>
              <p className="text-xs text-slate-400">
                {soundState.isPlaying ? 'Active Real-Time Web Audio Synthesis Running' : 'Click play to start sound masking session'}
              </p>
            </div>
          </div>

          {/* Master Play Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleTogglePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 shadow-xl ${
                soundState.isPlaying
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-rose-500/30'
                  : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 shadow-cyan-500/30'
              }`}
            >
              {soundState.isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
          </div>
        </div>

        {/* Audio Wave Visualizer Bars */}
        <div className="flex items-end justify-center gap-1.5 h-14 mt-8 px-4">
          {[40, 65, 80, 45, 90, 75, 50, 85, 95, 60, 70, 40, 85, 60, 75, 90, 50, 65].map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                soundState.isPlaying
                  ? 'bg-gradient-to-t from-cyan-500 to-teal-300 animate-pulse'
                  : 'bg-slate-800'
              }`}
              style={{
                height: soundState.isPlaying ? `${height}%` : '20%',
                animationDelay: `${idx * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-800/80">
          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4 text-cyan-400" /> Volume</span>
              <span className="font-mono text-cyan-400">{soundState.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundState.volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Notch Masking Frequency Tuner */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5"><Sliders className="w-4 h-4 text-teal-400" /> Masking Frequency</span>
              <span className="font-mono text-teal-400">{soundState.notchFrequency} Hz</span>
            </div>
            <input
              type="range"
              min="500"
              max="12000"
              step="100"
              value={soundState.notchFrequency}
              onChange={(e) => handleFreqChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          {/* Timer Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-400" /> Session Timer</span>
              <span className="font-mono text-purple-400">{soundState.timerMinutes} mins</span>
            </div>
            <div className="flex gap-2">
              {[15, 20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSoundState({ timerMinutes: mins })}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    soundState.timerMinutes === mins
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Sound Presets List */}
      <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Available Masking Soundscapes</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {soundPresets.map((preset) => {
          const isSelected = soundState.activeSound === preset.id;
          return (
            <GlassCard
              key={preset.id}
              onClick={() => handleSoundSelect(preset.id)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                isSelected
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {preset.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">{preset.name}</h5>
                    {preset.recommended && <Badge variant="cyan">Target Match</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{preset.desc}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
