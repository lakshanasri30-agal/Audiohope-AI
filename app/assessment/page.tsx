'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { AudiogramPlotter } from '@/components/assessment/AudiogramPlotter';
import { XAIPanel } from '@/components/assessment/XAIPanel';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { MOCK_PATIENTS } from '@/lib/mockData';
import {
  ClipboardList,
  Cpu,
  Activity,
  Upload,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function AssessmentPage() {
  const { user, setUser } = useAppStore();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [thiScore, setThiScore] = useState<number>(48);
  const [vasScore, setVasScore] = useState<number>(6.5);
  const [pitchHz, setPitchHz] = useState<number>(user.tinnitusPitchHz || 4200);
  const [loudnessDb, setLoudnessDb] = useState<number>(45);
  const [primaryEar, setPrimaryEar] = useState<'Left' | 'Right' | 'Bilateral'>('Bilateral');

  const [aiRunning, setAiRunning] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(true);

  const handleRunAiPredictor = () => {
    setAiRunning(true);
    setTimeout(() => {
      setAiRunning(false);
      setAssessmentComplete(true);
      setUser({
        tinnitusPitchHz: pitchHz,
        tinnitusLoudnessDb: loudnessDb,
        tinnitusSeverity: thiScore > 56 ? 'Severe' : thiScore > 36 ? 'Moderate' : 'Mild',
        confidenceScore: 94,
      });
    }, 1500);
  };

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
                <ClipboardList className="w-7 h-7 text-cyan-400" /> Tinnitus AI Assessment Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pure Tone Audiometry, THI Questionnaire & Random Forest / XGBoost Explainable AI Diagnostics
              </p>
            </div>
            <Badge variant="cyan" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Multi-Modal Machine Learning Active
            </Badge>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 1, label: '1. Audiometry & Symptoms' },
              { id: 2, label: '2. THI & VAS Questionnaire' },
              { id: 3, label: '3. AI Prediction & XAI Results' },
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                  activeStep === step.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* STEP 1: AUDIOMETRY & SYMPTOMS */}
          {activeStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudiogramPlotter />

              <GlassCard className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" /> Acoustic Symptom Profile
                  </h4>
                  <Badge variant="teal">Manual & File Entry</Badge>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Affected Ear */}
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold block">Affected Ear</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Left', 'Right', 'Bilateral'] as const).map((ear) => (
                        <button
                          key={ear}
                          type="button"
                          onClick={() => setPrimaryEar(ear)}
                          className={`py-2 rounded-lg font-bold border transition-all ${
                            primaryEar === ear
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {ear}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Tinnitus Pitch Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Estimated Pitch Frequency:</span>
                      <span className="text-cyan-400 font-mono">{pitchHz} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="12000"
                      step="100"
                      value={pitchHz}
                      onChange={(e) => setPitchHz(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  {/* Loudness Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Estimated Loudness:</span>
                      <span className="text-teal-400 font-mono">{loudnessDb} dB HL</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={loudnessDb}
                      onChange={(e) => setLoudnessDb(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>

                  {/* PDF Upload Box */}
                  <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                    <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="font-semibold text-slate-300">Upload Clinical Audiogram PDF / Image</p>
                    <p className="text-[10px] text-slate-500">Supports PDF, PNG, JPG format (OCR extracted)</p>
                  </div>

                  <button
                    onClick={() => setActiveStep(2)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all mt-4"
                  >
                    Proceed to THI Questionnaire →
                  </button>
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 2: THI QUESTIONNAIRE */}
          {activeStep === 2 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-lg font-bold text-white">Tinnitus Handicap Inventory (THI) & VAS Scale</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Validated clinical questionnaire to quantify emotional, functional, and catastrophic tinnitus impact.
                </p>
              </div>

              {/* Visual Analog Scale (VAS) */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200">Visual Analog Scale (VAS 0-10):</span>
                  <span className="text-cyan-400 font-mono text-base">{vasScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={vasScore}
                  onChange={(e) => setVasScore(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>0 - Barely Audible</span>
                  <span>5 - Moderate Interference</span>
                  <span>10 - Unbearable Distortion</span>
                </div>
              </div>

              {/* THI Sample Questions */}
              <div className="space-y-4 text-xs">
                {[
                  '1. Because of your tinnitus, is it difficult for you to concentrate?',
                  '2. Does the loudness of your tinnitus make it difficult for you to hear people?',
                  '3. Does your tinnitus cause you to feel confused or anxious?',
                  '4. Do you feel that you cannot escape your tinnitus sound?',
                  '5. Does your tinnitus interfere with your sleep quality?',
                ].map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                    <p className="font-semibold text-slate-200">{q}</p>
                    <div className="flex gap-4 pt-1">
                      {['No (0 pts)', 'Sometimes (2 pts)', 'Yes (4 pts)'].map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                          <input type="radio" name={`q_${idx}`} defaultChecked={oIdx === 1} className="accent-cyan-400" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    handleRunAiPredictor();
                    setActiveStep(3);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 flex items-center justify-center gap-2"
                >
                  {aiRunning ? 'Running ML Models...' : 'Run AI Diagnostic Engine'} <Cpu className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: EXPLAINABLE AI RESULTS */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/40">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="cyan">AI Diagnostic Complete</Badge>
                        <span className="text-xs text-slate-400 font-mono">Ensemble: RF + XGBoost + CNN</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white mt-1">
                        Predicted Severity: <span className="text-cyan-400">Moderate Tinnitus (THI Score {thiScore})</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        High Confidence (94%). Main acoustic notch detected at {pitchHz} Hz.
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs text-slate-400 block font-semibold">Prognostic Risk Level</span>
                    <span className="text-lg font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      Medium Risk
                    </span>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <XAIPanel confidence={94} severity="Moderate" shapFactors={MOCK_PATIENTS[0].shapFactors} />
                <AudiogramPlotter />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
