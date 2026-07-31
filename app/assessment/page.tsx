'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JourneyProgress, JourneyStep } from '@/components/ui/JourneyProgress';
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
  ArrowRight,
  ArrowLeft,
  User,
  HeartPulse,
  Moon,
  Volume2,
  FileCheck,
  Headphones,
  Gamepad2,
  LineChart,
} from 'lucide-react';

export default function GuidedAssessmentPage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Medical & Lifestyle State
  const [age, setAge] = useState<number>(user.age || 38);
  const [gender, setGender] = useState<string>(user.gender || 'Male');
  const [occupation, setOccupation] = useState<string>('Audio Engineer / Software Dev');
  const [earInfections, setEarInfections] = useState<boolean>(true);
  const [hearingLossHistory, setHearingLossHistory] = useState<boolean>(true);
  const [medications, setMedications] = useState<string>('Multivitamins, Ototoxic Check Clean');

  const [stressLevel, setStressLevel] = useState<number>(6);
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [noiseExposure, setNoiseExposure] = useState<number>(4.5);
  const [headphoneHours, setHeadphoneHours] = useState<number>(3.0);

  // Hearing Assessment State
  const [pitchHz, setPitchHz] = useState<number>(user.tinnitusPitchHz || 4200);
  const [loudnessDb, setLoudnessDb] = useState<number>(45);
  const [primaryEar, setPrimaryEar] = useState<'Left' | 'Right' | 'Bilateral'>('Bilateral');

  // Questionnaires State
  const [thiScore, setThiScore] = useState<number>(48);
  const [vasScore, setVasScore] = useState<number>(6.5);

  const [aiRunning, setAiRunning] = useState(false);

  const journeySteps: JourneyStep[] = [
    { id: 1, title: 'Medical History', shortLabel: 'Medical' },
    { id: 2, title: 'Lifestyle Assessment', shortLabel: 'Lifestyle' },
    { id: 3, title: 'Hearing Assessment', shortLabel: 'Hearing' },
    { id: 4, title: 'THI Questionnaire', shortLabel: 'THI Test' },
    { id: 5, title: 'VAS Rating', shortLabel: 'VAS Score' },
    { id: 6, title: 'Review Assessment', shortLabel: 'Review' },
    { id: 7, title: 'AI Prediction & XAI', shortLabel: 'AI Results' },
    { id: 8, title: 'Personalized Rehab', shortLabel: 'Rehab Plan' },
  ];

  const handleNextStep = () => {
    if (currentStep < journeySteps.length) {
      if (currentStep === 6) {
        // Trigger AI Model Engine when moving to Step 7
        setAiRunning(true);
        setTimeout(() => {
          setAiRunning(false);
          setUser({
            tinnitusPitchHz: pitchHz,
            tinnitusLoudnessDb: loudnessDb,
            tinnitusSeverity: thiScore > 56 ? 'Severe' : thiScore > 36 ? 'Moderate' : 'Mild',
            confidenceScore: 94,
          });
          setCurrentStep(7);
        }, 1200);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
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
              { label: 'Patient Assessment Journey', href: '/assessment' },
              { label: journeySteps[currentStep - 1].title },
            ]}
          />

          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <ClipboardList className="w-7 h-7 text-cyan-400" /> Guided Tinnitus Assessment Journey
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Follow the clinical patient workflow from history evaluation to AI severity prognosis
              </p>
            </div>
            <Badge variant="cyan" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Active Guided Assessment
            </Badge>
          </div>

          {/* Progress Indicators Bar */}
          <JourneyProgress
            currentStep={currentStep}
            steps={journeySteps}
            onStepClick={(stepId) => setCurrentStep(stepId)}
          />

          {/* STEP 1: MEDICAL HISTORY */}
          {currentStep === 1 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" /> Step 1: Patient Medical & Otological History
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Collect baseline demographics and prior ear conditions</p>
                </div>
                <Badge variant="cyan">Step 1 of 8</Badge>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-Binary / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Primary Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block">History of Ear Infections</span>
                      <span className="text-[10px] text-slate-400">Middle ear / otitis media episodes</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={earInfections}
                      onChange={(e) => setEarInfections(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block">Known Hearing Loss</span>
                      <span className="text-[10px] text-slate-400">Notched threshold drop history</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={hearingLossHistory}
                      onChange={(e) => setHearingLossHistory(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 2: LIFESTYLE ASSESSMENT */}
          {currentStep === 2 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-teal-400" /> Step 2: Lifestyle & Environmental Exposure
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Quantify stress markers, sleep quality & acoustic overexposure</p>
                </div>
                <Badge variant="teal">Step 2 of 8</Badge>
              </div>

              <div className="space-y-5 text-xs">
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Daily Perceived Stress Level (1-10):</span>
                    <span className="text-cyan-400 font-mono font-bold text-sm">{stressLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Average Nightly Sleep Duration:</span>
                    <span className="text-indigo-400 font-mono font-bold text-sm">{sleepHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Daily Headphone / Earbud Usage:</span>
                    <span className="text-teal-400 font-mono font-bold text-sm">{headphoneHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={headphoneHours}
                    onChange={(e) => setHeadphoneHours(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: HEARING ASSESSMENT */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudiogramPlotter />

              <GlassCard className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" /> Acoustic Pitch & Loudness Matching
                  </h4>
                  <Badge variant="cyan">Step 3 of 8</Badge>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold block">Primary Affected Ear</label>
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

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Estimated Pitch Frequency:</span>
                      <span className="text-cyan-400 font-mono font-bold">{pitchHz} Hz</span>
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

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Estimated Loudness:</span>
                      <span className="text-teal-400 font-mono font-bold">{loudnessDb} dB HL</span>
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
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 4: THI QUESTIONNAIRE */}
          {currentStep === 4 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-400" /> Step 4: Tinnitus Handicap Inventory (THI)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">25-item validated handicap index questionnaire</p>
                </div>
                <Badge variant="purple">Step 4 of 8</Badge>
              </div>

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
                          <input type="radio" name={`q_${idx}`} defaultChecked={oIdx === 1} className="accent-purple-400" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* STEP 5: VAS RATING */}
          {currentStep === 5 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-cyan-400" /> Step 5: Visual Analog Scale (VAS) Rating
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Subjective tinnitus annoyance intensity rating (0-10)</p>
                </div>
                <Badge variant="cyan">Step 5 of 8</Badge>
              </div>

              <div className="space-y-5 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-center">
                <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                  {vasScore} <span className="text-xs text-slate-400 font-sans">/ 10</span>
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

                <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
                  <span>0 - Barely Audible</span>
                  <span>5 - Moderate Distraction</span>
                  <span>10 - Unbearable Distortion</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 6: REVIEW ASSESSMENT */}
          {currentStep === 6 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto border-cyan-500/30">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" /> Step 6: Review Assessment Summary
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Confirm inputted health data before invoking ML models</p>
                </div>
                <Badge variant="emerald">Step 6 of 8</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Demographics</span>
                  <span className="text-white font-bold">{age}y / {gender}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Pitch</span>
                  <span className="text-cyan-400 font-mono font-bold">{pitchHz} Hz</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Loudness</span>
                  <span className="text-teal-400 font-mono font-bold">{loudnessDb} dB HL</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">THI Score</span>
                  <span className="text-purple-400 font-bold">{thiScore} / 100</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">VAS Rating</span>
                  <span className="text-cyan-400 font-bold">{vasScore} / 10</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Stress Marker</span>
                  <span className="text-rose-400 font-bold">{stressLevel} / 10</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 7: AI RESULTS & EXPLAINABLE AI */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/40">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                      <Cpu className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="cyan">Step 7 of 8 • AI Result</Badge>
                        <span className="text-xs text-slate-400 font-mono">Ensemble: RF + XGBoost</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white mt-1">
                        Predicted Severity: <span className="text-cyan-400">Moderate Tinnitus (THI Score {thiScore})</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        High Confidence (94%). Acoustic notch target identified at {pitchHz} Hz.
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

          {/* STEP 8: PERSONALIZED REHABILITATION */}
          {currentStep === 8 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto border-emerald-500/30">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Step 8: Personalized Rehabilitation Plan
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">AI tailored sound therapy & gamified auditory training</p>
                </div>
                <Badge variant="emerald">Journey Completed! 🎉</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/therapy"
                  className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-2 block"
                >
                  <Headphones className="w-6 h-6 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white">Start Adaptive Sound Therapy</h4>
                  <p className="text-xs text-slate-400">Launch 20-min notched pink noise session at {pitchHz} Hz</p>
                </Link>

                <Link
                  href="/games"
                  className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 transition-all space-y-2 block"
                >
                  <Gamepad2 className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold text-sm text-white">Play Hearing Rehabilitation Games</h4>
                  <p className="text-xs text-slate-400">5 interactive auditory retraining games to earn XP</p>
                </Link>
              </div>
            </GlassCard>
          )}

          {/* Bottom Journey Navigation Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>

            {currentStep < journeySteps.length ? (
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2"
              >
                {currentStep === 6 ? (aiRunning ? 'Invoking AI Engine...' : 'Generate AI Assessment') : 'Next Step'} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/monitoring"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-2"
              >
                Proceed to Daily Monitoring <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
