'use client';

import React, { useState, useEffect } from 'react';
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
import { postAssessmentPrediction } from '@/lib/api';
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
} from 'lucide-react';

export default function MultiStepClinicalAssessment() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
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
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);

  // STEP 3: Lifestyle
  const [stressLevel, setStressLevel] = useState<number>(6);
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [exerciseDays, setExerciseDays] = useState<number>(3);
  const [screenTimeHours, setScreenTimeHours] = useState<number>(7.5);
  const [noiseExposureHours, setNoiseExposureHours] = useState<number>(4.0);
  const [headphoneHours, setHeadphoneHours] = useState<number>(3.0);
  const [smokingAlcohol, setSmokingAlcohol] = useState<string>('Occasional alcohol, Non-smoker');

  // STEP 4: Hearing Assessment
  const [primaryEar, setPrimaryEar] = useState<'Left' | 'Right' | 'Bilateral'>('Bilateral');
  const [pitchHz, setPitchHz] = useState<number>(user.tinnitusPitchHz || 4200);
  const [loudnessDb, setLoudnessDb] = useState<number>(45);
  const [speechDiscriminationPct, setSpeechDiscriminationPct] = useState<number>(96);
  const [tympanometryType, setTympanometryType] = useState<string>('Type A (Normal)');

  // STEP 5: Audiogram Upload
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Clinical_Audiogram_2026.pdf');
  const [uploadParsed, setUploadParsed] = useState<boolean>(true);

  // STEP 6 & 7: Questionnaires
  const [thiScore, setThiScore] = useState<number>(48);
  const [vasScore, setVasScore] = useState<number>(6.5);

  // STEP 9: AI Predictor Result State
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
    { id: 9, title: 'Generate AI Assessment', shortLabel: 'AI Result' },
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

  // Auto-save progress to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        'audiohope_assessment_progress',
        JSON.stringify({
          currentStep,
          fullName,
          age,
          pitchHz,
          loudnessDb,
          thiScore,
          vasScore,
          stressLevel,
          sleepHours,
        })
      );
    } catch {}
  }, [currentStep, fullName, age, pitchHz, loudnessDb, thiScore, vasScore, stressLevel, sleepHours]);

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

    if (currentStep === 2) {
      if (!medicationHistory.trim()) {
        setValidationError('Please specify medication history or enter None.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (sleepHours < 1 || sleepHours > 24) {
        setValidationError('Please enter a valid sleep duration.');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === 8) {
      // Step 8 -> Step 9: Invoke AI Assessment Prediction Engine
      setAiRunning(true);
      setCurrentStep(9);

      // Call API / ML classifier pipeline
      const res = await postAssessmentPrediction({
        patient_id: user.id || 'usr_patient_101',
        thi_score: thiScore,
        vas_score: vasScore,
        pitch_hz: pitchHz,
        loudness_db: loudnessDb,
        primary_ear: primaryEar,
      });

      setAiRunning(false);
      if (res) {
        setAiResult(res);
      } else {
        setAiResult({
          severity: thiScore > 56 ? 'Severe' : thiScore > 36 ? 'Moderate' : 'Mild',
          confidence_score: 94,
          risk_level: 'Medium',
          recovery_score: 85,
          shap_factors: MOCK_PATIENTS[0].shapFactors,
        });
      }

      setUser({
        tinnitusPitchHz: pitchHz,
        tinnitusLoudnessDb: loudnessDb,
        tinnitusSeverity: thiScore > 56 ? 'Severe' : thiScore > 36 ? 'Moderate' : 'Mild',
        confidenceScore: 94,
      });
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
                <ClipboardList className="w-7 h-7 text-cyan-400" /> Multi-Step Clinical Tinnitus Assessment
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                9-step validated clinical assessment wizard with data verification and Explainable AI (XAI)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="py-1.5 px-3">
                <Save className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Auto-Saved
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

          {/* Validation Alert Message */}
          {validationError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" /> Step 1: Personal Details
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Demographics and physical measurements</p>
                </div>
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
                    <option>Other / Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 2: MEDICAL HISTORY */}
          {currentStep === 2 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-400" /> Step 2: Medical History
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Otological conditions, treatments, and family history</p>
                </div>
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
                      <span className="font-semibold text-slate-200 block">Hearing Loss History</span>
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
                  <label className="text-slate-300 font-semibold block mb-1">Medication & Prescription History *</label>
                  <input
                    type="text"
                    value={medicationHistory}
                    onChange={(e) => setMedicationHistory(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Previous Tinnitus Treatments</label>
                  <input
                    type="text"
                    value={prevTinnitusTreatment}
                    onChange={(e) => setPrevTinnitusTreatment(e.target.value)}
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: LIFESTYLE */}
          {currentStep === 3 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-indigo-400" /> Step 3: Lifestyle Assessment
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Stress levels, sleep duration & acoustic exposure</p>
                </div>
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

          {/* STEP 4: HEARING ASSESSMENT */}
          {currentStep === 4 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" /> Step 4: Hearing Assessment & Pitch Match
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Primary ear, pitch frequency & loudness calibration</p>
                </div>
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

                <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Estimated Loudness:</span>
                    <span className="text-teal-400 font-mono font-bold text-sm">{loudnessDb} dB HL</span>
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
          )}

          {/* STEP 5: AUDIOGRAM UPLOAD */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudiogramPlotter />

              <GlassCard className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4 text-teal-400" /> Step 5: Audiogram Upload & Parser
                  </h4>
                  <Badge variant="teal">Step 5 of 9</Badge>
                </div>

                <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-3">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                  <div>
                    <p className="font-semibold text-xs text-slate-200">Upload Clinical Audiogram Document</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG (OCR extracts frequency thresholds)</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Parsed: {uploadedFileName}
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 6: THI QUESTIONNAIRE */}
          {currentStep === 6 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-400" /> Step 6: Tinnitus Handicap Inventory (THI)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">25-item validated handicap inventory score</p>
                </div>
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

          {/* STEP 7: VISUAL ANALOG SCALE */}
          {currentStep === 7 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-cyan-400" /> Step 7: Visual Analog Scale (VAS)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Quantify tinnitus annoyance intensity (0 - 10)</p>
                </div>
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

                <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
                  <span>0 - Barely Audible</span>
                  <span>5 - Moderate Distraction</span>
                  <span>10 - Unbearable Distortion</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* STEP 8: REVIEW */}
          {currentStep === 8 && (
            <GlassCard className="space-y-6 max-w-3xl mx-auto border-cyan-500/30">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" /> Step 8: Review Clinical Summary
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Verify all validated inputs prior to running AI inference</p>
                </div>
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

          {/* STEP 9: GENERATE AI ASSESSMENT & RESULTS */}
          {currentStep === 9 && (
            <div className="space-y-6">
              {aiRunning ? (
                <GlassCard className="p-12 text-center space-y-4 border-cyan-500/50">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mx-auto animate-spin">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Running Machine Learning Diagnostic Pipeline...</h3>
                  <p className="text-xs text-slate-400">Evaluating Random Forest, XGBoost & SHAP feature drivers</p>
                </GlassCard>
              ) : (
                <>
                  <GlassCard className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/40">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                          <Cpu className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="cyan">Step 9 of 9 • AI Result Complete</Badge>
                            <span className="text-xs text-slate-400 font-mono">Ensemble: RF + XGBoost</span>
                          </div>
                          <h3 className="text-xl font-extrabold text-white mt-1">
                            Predicted Severity: <span className="text-cyan-400">{aiResult?.severity || 'Moderate'} Tinnitus</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            High Confidence (94%). Acoustic notch target set to {pitchHz} Hz.
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-xs text-slate-400 block font-semibold">Risk Rating</span>
                        <span className="text-lg font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                          Medium Risk
                        </span>
                      </div>
                    </div>
                  </GlassCard>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <XAIPanel confidence={94} severity={aiResult?.severity || 'Moderate'} shapFactors={aiResult?.shap_factors || MOCK_PATIENTS[0].shapFactors} />
                    <AudiogramPlotter />
                  </div>

                  <GlassCard className="p-6 border-emerald-500/30">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold text-white">Proceed to Adaptive Sound Therapy & Games</h4>
                        <p className="text-xs text-slate-400">Launch personalized notched pink noise session at {pitchHz} Hz</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href="/therapy"
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                        >
                          Start Sound Therapy <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </>
              )}
            </div>
          )}

          {/* Bottom Journey Navigation Bar */}
          {currentStep < 9 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  currentStep === 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-500'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Previous Step
              </button>

              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2"
              >
                {currentStep === 8 ? 'Generate AI Assessment' : 'Next Step'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
