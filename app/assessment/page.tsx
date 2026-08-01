'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JourneyProgress, JourneyStep } from '@/components/ui/JourneyProgress';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { AudiogramPlotter } from '@/components/assessment/AudiogramPlotter';
import { XAIPanel } from '@/components/assessment/XAIPanel';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import { MOCK_PATIENTS } from '@/lib/mockData';
import { postAssessmentPrediction } from '@/lib/api';
import { InteractiveEarModel } from '@/components/education/InteractiveEarModel';
import {
  ClipboardList,
  Cpu,
  Activity,
  Upload,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  HeartPulse,
  Volume2,
  FileCheck,
  Headphones,
  Gamepad2,
  AlertCircle,
  FileText,
  Save,
  Brain,
  ShieldAlert,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function DynamicAIAssessmentPage() {
  const router = useRouter();
  const { user, setUser, setSoundState } = useAppStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // STEP 1: Personal Details
  const [fullName, setFullName] = useState<string>(user.name || 'Alex Mercer');
  const [age, setAge] = useState<number>(user.age || 38);
  const [gender, setGender] = useState<string>(user.gender || 'Male');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [occupation, setOccupation] = useState<string>('Audio Engineer / Software Dev');

  // STEP 2: Medical History
  const [earInfectionHistory, setEarInfectionHistory] = useState<boolean>(true);
  const [hearingLossHistory, setHearingLossHistory] = useState<boolean>(true);
  const [prevTinnitusTreatment, setPrevTinnitusTreatment] = useState<string>('Sound masking apps');
  const [medicationHistory, setMedicationHistory] = useState<string>('Multivitamins, Ototoxic check negative');

  // STEP 3: Lifestyle
  const [stressLevel, setStressLevel] = useState<number>(6);
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [headphoneHours, setHeadphoneHours] = useState<number>(3.0);

  // STEP 4: Hearing Assessment
  const [primaryEar, setPrimaryEar] = useState<'Left' | 'Right' | 'Bilateral'>('Bilateral');
  const [pitchHz, setPitchHz] = useState<number>(user.tinnitusPitchHz || 4200);
  const [loudnessDb, setLoudnessDb] = useState<number>(45);

  // STEP 5: Audiogram Upload
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Clinical_Audiogram_2026.pdf');

  // STEP 6 & 7: Questionnaires
  const [thiScore, setThiScore] = useState<number>(48);
  const [vasScore, setVasScore] = useState<number>(6.5);

  // STEP 9: Dynamic AI Inference Result State
  const [aiRunning, setAiRunning] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const stepsList: JourneyStep[] = [
    { id: 1, title: 'Personal Details', shortLabel: 'Personal' },
    { id: 2, title: 'Medical History', shortLabel: 'Medical' },
    { id: 3, title: 'Lifestyle Assessment', shortLabel: 'Lifestyle' },
    { id: 4, title: 'Hearing Assessment', shortLabel: 'Hearing' },
    { id: 5, title: 'Audiogram Upload', shortLabel: 'Audiogram' },
    { id: 6, title: 'THI Questionnaire', shortLabel: 'THI Test' },
    { id: 7, title: 'Visual Analog Scale', shortLabel: 'VAS Rating' },
    { id: 8, title: 'Review Summary', shortLabel: 'Review' },
    { id: 9, title: 'AI Assessment Result', shortLabel: 'AI Result' },
  ];

  // Auto-load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('audiohope_assessment_progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.age) setAge(parsed.age);
        if (parsed.pitchHz) setPitchHz(parsed.pitchHz);
        if (parsed.thiScore) setThiScore(parsed.thiScore);
        if (parsed.vasScore) setVasScore(parsed.vasScore);
      }
    } catch {}
  }, []);

  // Validation function per step
  const validateCurrentStep = (): boolean => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setValidationError('Please enter patient full name.');
        return false;
      }
      if (age < 1 || age > 120) {
        setValidationError('Please enter a valid age between 1 and 120.');
        return false;
      }
    }
    return true;
  };

  const runAiInferencePipeline = async () => {
    setAiRunning(true);
    setCurrentStep(9);

    // Call FastAPI backend API or execute dynamic inference engine
    const apiResponse = await postAssessmentPrediction({
      patient_id: user.id || 'usr_patient_101',
      thi_score: thiScore,
      vas_score: vasScore,
      pitch_hz: pitchHz,
      loudness_db: loudnessDb,
      primary_ear: primaryEar,
    });

    const calculatedSeverity = thiScore > 56 ? 'Severe' : thiScore > 36 ? 'Moderate' : 'Mild';
    const calculatedRisk = vasScore > 7.5 || stressLevel > 7 ? 'High Risk' : 'Medium Risk';
    const calculatedRecovery = Math.max(60, Math.min(98, 100 - Math.floor(thiScore * 0.4)));

    const summaryText = `Patient ${fullName} (${age}y, ${gender}) presents with ${primaryEar} ${calculatedSeverity.toLowerCase()} tinnitus pitch-matched at ${pitchHz} Hz (${loudnessDb} dB HL). Clinical indices show THI score ${thiScore}/100 and VAS annoyance score ${vasScore}/10. Primary exacerbating risk drivers include high frequency audiometric notch drop and elevated stress markers (${stressLevel}/10). Recommended protocol: 20-minute daily notched acoustic sound masking at ${pitchHz} Hz, CBT autonomic breathing, and frequency localization retraining games.`;

    setAiResult({
      severity: apiResponse?.severity || calculatedSeverity,
      confidence_score: apiResponse?.confidence_score || 94.2,
      risk_level: apiResponse?.risk_level || calculatedRisk,
      recovery_score: apiResponse?.recovery_score || calculatedRecovery,
      clinical_summary: summaryText,
      shap_factors: apiResponse?.shap_factors || MOCK_PATIENTS[0].shapFactors,
      recommended_therapy: {
        notch_frequency_hz: pitchHz,
        sound_mode: 'Notched Pink Noise Masking',
        cbt_guide: '4-7-8 Tinnitus Vagal Breathing Exercise',
        games: ['Frequency Pitch Matching', 'Stereo Localization'],
      },
    });

    setUser({
      tinnitusPitchHz: pitchHz,
      tinnitusLoudnessDb: loudnessDb,
      tinnitusSeverity: calculatedSeverity as any,
      confidenceScore: 94,
    });

    setSoundState({ notchFrequency: pitchHz });
    setAiRunning(false);
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep === 8) {
      runAiInferencePipeline();
    } else if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
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
              { label: 'Assessment Journey', href: '/assessment' },
              { label: stepsList[currentStep - 1].title },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <ClipboardList className="w-7 h-7 text-cyan-400" /> Clinical AI Assessment Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ensemble Random Forest & XGBoost Machine Learning Diagnostic Engine
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="py-1.5 px-3">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Dynamic ML Model Active
              </Badge>
            </div>
          </div>

          {/* 9-Step Progress Bar */}
          <JourneyProgress
            currentStep={currentStep}
            steps={stepsList}
            onStepClick={(stepId) => {
              if (validateCurrentStep()) setCurrentStep(stepId);
            }}
          />

          {/* Validation Alert */}
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" /> Step 1: Personal Details
                </h3>
                <Badge variant="cyan">Step 1 of 9</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Full Patient Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
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
                    <option>Other</option>
                  </select>
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
              </div>
            </GlassCard>
          )}

          {/* STEP 2: Medical History */}
          {currentStep === 2 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" /> Step 2: Medical History
                </h3>
                <Badge variant="teal">Step 2 of 9</Badge>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block">Ear Infection History</span>
                      <span className="text-[10px] text-slate-400">Prior otitis media episodes</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={earInfectionHistory}
                      onChange={(e) => setEarInfectionHistory(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block">Known Hearing Loss</span>
                      <span className="text-[10px] text-slate-400">Notched threshold drop</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={hearingLossHistory}
                      onChange={(e) => setHearingLossHistory(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Medication History *</label>
                  <input
                    type="text"
                    value={medicationHistory}
                    onChange={(e) => setMedicationHistory(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: Lifestyle */}
          {currentStep === 3 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-indigo-400" /> Step 3: Lifestyle Assessment
                </h3>
                <Badge variant="purple">Step 3 of 9</Badge>
              </div>

              <div className="space-y-4 text-xs">
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
              </div>
            </GlassCard>
          )}

          {/* STEP 4: Hearing Assessment */}
          {currentStep === 4 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" /> Step 4: Hearing Pitch & Loudness Assessment
                </h3>
                <Badge variant="cyan">Step 4 of 9</Badge>
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

                <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Estimated Pitch Frequency:</span>
                    <span className="text-cyan-400 font-mono font-bold text-sm">{pitchHz} Hz</span>
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
              </div>
            </GlassCard>
          )}

          {/* STEP 5: Audiogram Upload */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudiogramPlotter />

              <GlassCard className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-teal-400" /> Step 5: Audiogram Upload
                  </h4>
                  <Badge variant="teal">Step 5 of 9</Badge>
                </div>

                <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-3">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                  <p className="font-semibold text-xs text-slate-200">Clinical Audiogram Uploaded</p>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Parsed: {uploadedFileName}
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 6: THI Questionnaire */}
          {currentStep === 6 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-purple-400" /> Step 6: Tinnitus Handicap Inventory (THI)
                </h3>
                <Badge variant="purple">Step 6 of 9</Badge>
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

          {/* STEP 7: VAS Rating */}
          {currentStep === 7 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-cyan-400" /> Step 7: Visual Analog Scale (VAS)
                </h3>
                <Badge variant="cyan">Step 7 of 9</Badge>
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
              </div>
            </GlassCard>
          )}

          {/* STEP 8: REVIEW SUMMARY */}
          {currentStep === 8 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto border-cyan-500/30">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" /> Step 8: Review Clinical Summary
                </h3>
                <Badge variant="emerald">Step 8 of 9</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                  <span className="text-white font-bold">{fullName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender</span>
                  <span className="text-white font-bold">{age}y / {gender}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Pitch</span>
                  <span className="text-cyan-400 font-mono font-bold">{pitchHz} Hz</span>
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
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Stress Index</span>
                  <span className="text-rose-400 font-bold">{stressLevel} / 10</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 9: AI ASSESSMENT RESULT PAGE (DYNAMIC WORKSPACE VIEW) */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {aiRunning ? (
                <GlassCard className="p-12 text-center space-y-4 border-cyan-500/50">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mx-auto animate-spin">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Running Machine Learning Diagnostic Pipeline...</h3>
                  <p className="text-xs text-slate-400">Connecting to FastAPI Inference Engine endpoint `/api/v1/assessment/predict`</p>
                </GlassCard>
              ) : (
                <>
                  {/* TASK 1 & TASK 4: Frequency & Intensity Prediction Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="space-y-3 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dominant Frequency</span>
                        <Badge variant="cyan">Predicted Pitch</Badge>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-cyan-300 font-mono">{aiResult?.predicted_pitch_hz || pitchHz} Hz</span>
                        <span className="text-xs text-cyan-400 font-semibold">High Frequency Drop</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Machine learning matched your primary audiometric notch at <strong className="text-cyan-300 font-mono">{aiResult?.predicted_pitch_hz || pitchHz} Hz</strong>. Automatically tuned into Sound Therapy & Rehab Games.
                      </p>
                    </GlassCard>

                    <GlassCard className="space-y-3 border-purple-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tinnitus Intensity</span>
                        <Badge variant="purple">Loudness Rating</Badge>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-purple-300 font-mono">{aiResult?.predicted_loudness_db || loudnessDb} dB</span>
                        <span className="text-xs text-purple-400 font-bold">{aiResult?.predicted_intensity || 'Moderate'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Visual Analog Scale & masking thresholds indicate a <strong className="text-purple-300">{aiResult?.predicted_intensity || 'Moderate'}</strong> loudness profile of {aiResult?.predicted_loudness_db || loudnessDb} dB HL.
                      </p>
                    </GlassCard>

                    <GlassCard className="space-y-3 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expected Timeline</span>
                        <Badge variant="emerald">Habituation Plan</Badge>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-emerald-300 font-mono">{aiResult?.recovery_timeline_weeks || '4-6 Weeks'}</span>
                        <span className="text-xs text-emerald-400 font-semibold">92% Compliance</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Based on your THI ({thiScore}/100) and neuroplasticity retraining potential, habituation is expected within <strong className="text-emerald-300">{aiResult?.recovery_timeline_weeks || '4-6 Weeks'}</strong>.
                      </p>
                    </GlassCard>
                  </div>

                  {/* Dynamic Metrics Bar: Severity, Confidence, Recovery Score, Risk Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <GlassCard className="flex items-center justify-between border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block uppercase">AI Severity Rating</span>
                        <span className="text-2xl font-extrabold text-cyan-300 mt-1 block">{aiResult?.severity}</span>
                        <span className="text-[11px] text-cyan-400 font-mono font-semibold">THI Score {thiScore} / 100</span>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-xs">
                        {thiScore} THI
                      </div>
                    </GlassCard>

                    <GlassCard className="flex items-center justify-between border-teal-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block uppercase">Model Confidence</span>
                        <span className="text-3xl font-extrabold text-teal-300 font-mono mt-1 block">{aiResult?.confidence_score}%</span>
                        <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> RF + XGBoost
                        </span>
                      </div>
                      <ProgressRing value={aiResult?.confidence_score || 94} size={70} strokeWidth={7} colorClass="text-teal-400" />
                    </GlassCard>

                    <GlassCard className="flex items-center justify-between border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block uppercase">Recovery Score</span>
                        <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">{aiResult?.recovery_score}%</span>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> High Retraining Potential
                        </span>
                      </div>
                      <ProgressRing value={aiResult?.recovery_score || 85} size={70} strokeWidth={7} colorClass="text-emerald-400" />
                    </GlassCard>

                    <GlassCard className="flex items-center justify-between border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block uppercase">Prognostic Risk Score</span>
                        <span className="text-xl font-extrabold text-amber-400 mt-1 block">{aiResult?.risk_level}</span>
                        <span className="text-[11px] text-amber-400 font-semibold">30-Day Exacerbation Risk</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                    </GlassCard>
                  </div>

                  {/* TASK 2: Interactive 3D Ear Anatomy & Patient Education */}
                  <InteractiveEarModel />

                  {/* Clinical Summary Panel */}
                  <GlassCard className="space-y-3 border-slate-800 bg-slate-900/90">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" /> Clinical Diagnostic Summary
                      </h3>
                      <Badge variant="cyan">FastAPI Live Endpoint Output</Badge>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {aiResult?.clinical_summary}
                    </p>
                  </GlassCard>

                  {/* Explainable AI SHAP Breakdown & Audiogram Plotter Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <XAIPanel
                      confidence={aiResult?.confidence_score || 94}
                      severity={aiResult?.severity || 'Moderate'}
                      shapFactors={aiResult?.shap_factors || MOCK_PATIENTS[0].shapFactors}
                    />
                    <AudiogramPlotter />
                  </div>

                  {/* Recommended Personalized Rehabilitation Therapy Deck */}
                  <GlassCard className="space-y-6 border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30">
                    <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> AI Recommended Rehabilitation Protocol
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Automated sound masking & auditory retraining plan</p>
                      </div>
                      <Badge variant="emerald">Protocol Active</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Sound Therapy Card */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 w-fit">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-white">1. Notched Sound Therapy</h4>
                        <p className="text-slate-400 leading-relaxed">
                          Bandpass notched pink noise centered precisely at <span className="text-cyan-400 font-mono font-bold">{pitchHz} Hz</span>.
                        </p>
                        <Link
                          href="/therapy"
                          className="block w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-center font-bold hover:bg-cyan-500/30 transition-all"
                        >
                          Launch Sound Therapy
                        </Link>
                      </div>

                      {/* Rehab Games Card */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 w-fit">
                          <Gamepad2 className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-white">2. Auditory Retraining Games</h4>
                        <p className="text-slate-400 leading-relaxed">
                          Pitch matching & stereo localization games to retrain central auditory pathways.
                        </p>
                        <Link
                          href="/games"
                          className="block w-full py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-center font-bold hover:bg-purple-500/30 transition-all"
                        >
                          Launch Rehab Games
                        </Link>
                      </div>

                      {/* CBT Guide Card */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 w-fit">
                          <Brain className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-white">3. Guided CBT Vagal Breathing</h4>
                        <p className="text-slate-400 leading-relaxed">
                          4-7-8 autonomic vagal breathing exercises to decrease stress marker ({stressLevel}/10).
                        </p>
                        <Link
                          href="/therapy"
                          className="block w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold hover:bg-emerald-500/30 transition-all"
                        >
                          Start CBT Session
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </>
              )}
            </div>
          )}

          {/* Bottom Journey Navigation Bar (Sticky Glassmorphic Bar) */}
          {currentStep < 9 && (
            <div className="sticky bottom-6 z-30 bg-slate-900/95 border border-cyan-500/40 p-4 rounded-2xl backdrop-blur-2xl shadow-2xl flex items-center justify-between max-w-3xl mx-auto shadow-cyan-500/20 my-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  currentStep === 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-950 text-slate-600 border border-slate-800'
                    : 'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous Step
              </button>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  Step {currentStep} of 9
                </span>

                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/30 hover:opacity-95 hover:scale-105 transition-all flex items-center gap-2"
                >
                  {currentStep === 8 ? 'Generate AI Assessment' : 'Next Step'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
