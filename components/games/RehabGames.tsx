'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { audioEngine } from '@/lib/audio/synthesizer';
import { submitGameScore } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/Badge';
import {
  Gamepad2,
  Trophy,
  Zap,
  Target,
  Brain,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle,
  Award,
  Sparkles,
  TrendingUp,
  Activity,
  Flame,
} from 'lucide-react';

export const RehabGames: React.FC = () => {
  const { user, setUser, userPoints, userLevel, addGamePoints } = useAppStore();
  const [activeGame, setActiveGame] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<number>(1);

  // Canvas Refs for HTML5 Visualizers
  const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const canvasRef3 = useRef<HTMLCanvasElement | null>(null);

  // Game 1: Frequency Matching
  const [targetFreq, setTargetFreq] = useState(4200);
  const [guessedFreq, setGuessedFreq] = useState(3000);
  const [freqSubmitted, setFreqSubmitted] = useState(false);
  const [freqScore, setFreqScore] = useState<number | null>(null);

  // Game 2: Sound Localization
  const [panTarget, setPanTarget] = useState<'Left' | 'Center' | 'Right'>('Left');
  const [panUserChoice, setPanUserChoice] = useState<string | null>(null);

  // Game 3: Mask the Ringing
  const [notchTarget, setNotchTarget] = useState(user.tinnitusPitchHz || 4200);
  const [notchGuess, setNotchGuess] = useState(2500);
  const [notchSuccess, setNotchSuccess] = useState(false);

  // Game 4: Memory Sound
  const [seqTarget, setSeqTarget] = useState<number[]>([1000, 2000, 3000]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [seqRound, setSeqRound] = useState(1);
  const [seqStatus, setSeqStatus] = useState<string>('Click Play Sequence to Listen');

  // Game 5: Reaction Challenge
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'done'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionMs, setReactionMs] = useState<number | null>(null);

  // Helper to recalculate and increase user Recovery Score
  const triggerRecoveryScoreIncrease = (pts: number) => {
    addGamePoints(pts);
    const newRecovery = Math.min(99, (user.recoveryScore || 85) + 1);
    setUser({ recoveryScore: newRecovery });
  };

  // Canvas 1 Waveform Animation (Frequency Match)
  useEffect(() => {
    if (activeGame === 1 && canvasRef1.current) {
      const canvas = canvasRef1.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animId: number;
      let step = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;

        // Target Wave (Cyan)
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin((x * targetFreq) / 15000 + step) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // User Guessed Wave (Teal)
        ctx.beginPath();
        ctx.strokeStyle = '#06d6a0';
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin((x * guessedFreq) / 15000 + step) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        step += 0.05;
        animId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animId);
    }
  }, [activeGame, targetFreq, guessedFreq]);

  // Canvas 2 Spatial Panning Head Diagram (Localization)
  useEffect(() => {
    if (activeGame === 2 && canvasRef2.current) {
      const canvas = canvasRef2.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Head Circle
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Ears
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - 48, cy - 10, 8, 20); // Left Ear
      ctx.fillRect(cx + 40, cy - 10, 8, 20); // Right Ear

      // Draw Pulse Rings based on panTarget
      const pulseX = panTarget === 'Left' ? cx - 60 : panTarget === 'Right' ? cx + 60 : cx;
      ctx.beginPath();
      ctx.arc(pulseX, cy, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#06d6a0';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [activeGame, panTarget]);

  // Game 1 Handlers
  const handlePlayTargetTone = () => {
    audioEngine.playPureTone(targetFreq, 40);
    setTimeout(() => audioEngine.stopPureTone(), 2000);
  };

  const handlePlayGuessTone = () => {
    audioEngine.playPureTone(guessedFreq, 40);
    setTimeout(() => audioEngine.stopPureTone(), 2000);
  };

  const handleEvaluateFreq = () => {
    const diff = Math.abs(targetFreq - guessedFreq);
    const score = Math.max(0, 100 - Math.floor(diff / 40));
    setFreqScore(score);
    setFreqSubmitted(true);

    if (score > 60) {
      const xp = 150 + difficulty * 25;
      triggerRecoveryScoreIncrease(xp);
      submitGameScore({
        patient_id: user.id || 'usr_patient_101',
        game_name: 'Frequency Pitch Matching',
        score: score,
        xp_earned: xp,
      });
    }
  };

  const handleResetFreq = () => {
    const newTarget = Math.floor(1200 + Math.random() * 5500);
    setTargetFreq(newTarget);
    setGuessedFreq(2500);
    setFreqSubmitted(false);
    setFreqScore(null);
    setDifficulty((prev) => prev + 1);
  };

  // Game 2 Handlers
  const handleStartLocalizationRound = () => {
    const options: ('Left' | 'Center' | 'Right')[] = ['Left', 'Center', 'Right'];
    const chosen = options[Math.floor(Math.random() * options.length)];
    setPanTarget(chosen);
    setPanUserChoice(null);

    const balanceVal = chosen === 'Left' ? -0.9 : chosen === 'Right' ? 0.9 : 0.0;
    audioEngine.startTherapy('pink', 55, 3000, balanceVal);
    setTimeout(() => audioEngine.stopTherapy(), 1500);
  };

  const handleLocalizationGuess = (choice: 'Left' | 'Center' | 'Right') => {
    setPanUserChoice(choice);
    if (choice === panTarget) {
      const xp = 120 + difficulty * 20;
      triggerRecoveryScoreIncrease(xp);
      submitGameScore({
        patient_id: user.id || 'usr_patient_101',
        game_name: 'Sound Localization',
        score: 100,
        xp_earned: xp,
      });
      setDifficulty((d) => d + 1);
    }
  };

  // Game 4 Memory Handlers
  const handlePlayMemorySequence = () => {
    setSeqStatus('Listening to sequence...');
    setUserSeq([]);
    seqTarget.forEach((freq, idx) => {
      setTimeout(() => {
        audioEngine.playPureTone(freq, 45);
        setTimeout(() => audioEngine.stopPureTone(), 500);
      }, idx * 800);
    });

    setTimeout(() => {
      setSeqStatus('Your turn! Click the pitch buttons in exact sequence.');
    }, seqTarget.length * 800 + 400);
  };

  const handleMemoryButtonClick = (freq: number) => {
    audioEngine.playPureTone(freq, 40);
    setTimeout(() => audioEngine.stopPureTone(), 300);

    const nextSeq = [...userSeq, freq];
    setUserSeq(nextSeq);

    for (let i = 0; i < nextSeq.length; i++) {
      if (nextSeq[i] !== seqTarget[i]) {
        setSeqStatus('Incorrect sequence! Try again.');
        setUserSeq([]);
        return;
      }
    }

    if (nextSeq.length === seqTarget.length) {
      const xp = 200 + seqRound * 30;
      setSeqStatus(`Awesome! Round ${seqRound} complete! +${xp} XP`);
      triggerRecoveryScoreIncrease(xp);
      submitGameScore({
        patient_id: user.id || 'usr_patient_101',
        game_name: 'Memory Sound Challenge',
        score: seqRound * 100,
        xp_earned: xp,
      });
      setSeqRound((r) => r + 1);
      setSeqTarget((prev) => [...prev, Math.floor(1200 + Math.random() * 4000)]);
      setUserSeq([]);
    }
  };

  // Game 5 Reaction Handlers
  const handleStartReaction = () => {
    setReactionState('waiting');
    setReactionMs(null);
    const delay = 1200 + Math.random() * 2500;
    setTimeout(() => {
      audioEngine.playPureTone(user.tinnitusPitchHz || 4200, 50);
      setStartTime(Date.now());
      setReactionState('ready');
    }, delay);
  };

  const handlePressReaction = () => {
    if (reactionState === 'ready') {
      const elapsed = Date.now() - startTime;
      audioEngine.stopPureTone();
      setReactionMs(elapsed);
      setReactionState('done');
      const xp = Math.max(50, 300 - Math.floor(elapsed / 2));
      triggerRecoveryScoreIncrease(xp);
      submitGameScore({
        patient_id: user.id || 'usr_patient_101',
        game_name: 'Reaction Challenge',
        score: Math.max(0, 1000 - elapsed),
        xp_earned: xp,
      });
    } else if (reactionState === 'waiting') {
      setReactionState('idle');
      alert('Too early! Wait for the chime before tapping.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Rehabilitation Center Master Header */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-indigo-500/40">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="purple">Level {userLevel} Auditory Retraining Master</Badge>
                <span className="text-xs text-slate-400 font-mono">{userPoints} Total XP</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                Auditory Retraining Rehabilitation Center
              </h3>
              <p className="text-xs text-slate-400">
                HTML5 Canvas visualizers & Web Audio API games for central auditory retuning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Recovery Score</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">{user.recoveryScore}%</span>
            </div>
            <ProgressRing value={user.recoveryScore || 85} size={64} strokeWidth={6} colorClass="text-emerald-400" />
          </div>
        </div>
      </GlassCard>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 1, name: 'Frequency Match', icon: <Target className="w-4 h-4" /> },
          { id: 2, name: 'Localization', icon: <Volume2 className="w-4 h-4" /> },
          { id: 3, name: 'Notch Masking', icon: <Sparkles className="w-4 h-4" /> },
          { id: 4, name: 'Memory Sound', icon: <Brain className="w-4 h-4" /> },
          { id: 5, name: 'Reaction Speed', icon: <Zap className="w-4 h-4" /> },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
              activeGame === g.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {g.icon}
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* GAME 1: FREQUENCY MATCHING WITH CANVAS */}
      {activeGame === 1 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Game 1: Frequency Pitch Matching
              </h4>
              <p className="text-xs text-slate-400">
                HTML5 Canvas sine wave visualizer. Match your tone wave to the target reference wave.
              </p>
            </div>
            <Badge variant="cyan">Difficulty: Level {difficulty}</Badge>
          </div>

          {/* HTML5 Waveform Canvas */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
            <canvas ref={canvasRef1} width={600} height={100} className="w-full max-w-xl mx-auto rounded-xl bg-slate-900/80 border border-slate-800" />
            <div className="flex justify-center gap-6 text-xs font-mono">
              <span className="text-cyan-400 flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Target Tone: {targetFreq} Hz</span>
              <span className="text-teal-400 flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" /> Your Guess: {guessedFreq} Hz</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Listen Reference Tone</h5>
              <button
                onClick={handlePlayTargetTone}
                className="px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all font-semibold flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-current" /> Play Reference Tone
              </button>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Adjust Your Pitch</h5>
              <input
                type="range"
                min="1000"
                max="8000"
                step="50"
                value={guessedFreq}
                onChange={(e) => setGuessedFreq(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <button
                onClick={handlePlayGuessTone}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5 mx-auto"
              >
                <Volume2 className="w-3.5 h-3.5" /> Test My Tone
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
            {!freqSubmitted ? (
              <button
                onClick={handleEvaluateFreq}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95"
              >
                Submit Pitch Match
              </button>
            ) : (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  <CheckCircle className="w-5 h-5" /> Match Accuracy: {freqScore}%! Recovery Score +1%
                </div>
                <div>
                  <button
                    onClick={handleResetFreq}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 mx-auto hover:bg-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Next Level ({difficulty + 1})
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* GAME 2: SOUND LOCALIZATION WITH CANVAS */}
      {activeGame === 2 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-teal-400" /> Game 2: Stereo Sound Localization
              </h4>
              <p className="text-xs text-slate-400">
                HTML5 Canvas 3D spatial head diagram. Identify which ear origin the sound came from.
              </p>
            </div>
            <Badge variant="teal">Difficulty: Level {difficulty}</Badge>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-6">
            <canvas ref={canvasRef2} width={300} height={140} className="mx-auto" />

            <button
              onClick={handleStartLocalizationRound}
              className="px-8 py-4 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all font-bold flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5 fill-current" /> Play Spatial Chime
            </button>

            <div className="flex justify-center gap-4">
              {(['Left', 'Center', 'Right'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => handleLocalizationGuess(pos)}
                  className={`px-8 py-4 rounded-xl border font-bold text-sm transition-all ${
                    panUserChoice === pos
                      ? pos === panTarget
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {pos} Ear
                </button>
              ))}
            </div>

            {panUserChoice && (
              <p className="text-xs font-semibold text-cyan-400">
                {panUserChoice === panTarget ? 'Correct Direction! Recovery Score +1%' : `Sound originated from ${panTarget}`}
              </p>
            )}
          </div>
        </GlassCard>
      )}

      {/* GAME 3: MASK THE RINGING */}
      {activeGame === 3 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Game 3: Mask The Ringing (Notch Filter Puzzle)
              </h4>
              <p className="text-xs text-slate-400">
                Adjust notch filter slider until target background tinnitus tone is suppressed.
              </p>
            </div>
            <Badge variant="purple">Notch Retraining</Badge>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-purple-300">
              <span>Target Pitch: {notchTarget} Hz</span>
              <span>Notch Filter: {notchGuess} Hz</span>
            </div>

            <input
              type="range"
              min="1000"
              max="8000"
              step="100"
              value={notchGuess}
              onChange={(e) => {
                setNotchGuess(Number(e.target.value));
                if (Math.abs(Number(e.target.value) - notchTarget) < 150) {
                  if (!notchSuccess) {
                    setNotchSuccess(true);
                    triggerRecoveryScoreIncrease(150);
                  }
                } else {
                  setNotchSuccess(false);
                }
              }}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />

            {notchSuccess ? (
              <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-center text-purple-300 font-bold text-sm">
                🎉 Perfect Notch Alignment! Ringing Masked (+150 XP & Recovery Score Updated)
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">Slide notch filter to align with tinnitus pitch</p>
            )}
          </div>
        </GlassCard>
      )}

      {/* GAME 4: MEMORY SOUND CHALLENGE */}
      {activeGame === 4 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" /> Game 4: Auditory Memory Sequence
              </h4>
              <p className="text-xs text-slate-400">
                Memorize and repeat the pitch sequence generated by the synthesizer.
              </p>
            </div>
            <Badge variant="purple">Round {seqRound}</Badge>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-6">
            <button
              onClick={handlePlayMemorySequence}
              className="px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all font-bold flex items-center gap-2 mx-auto text-xs"
            >
              <Play className="w-4 h-4 fill-current" /> Play Sequence (Length: {seqTarget.length})
            </button>

            <p className="text-xs font-semibold text-cyan-400">{seqStatus}</p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[1000, 2000, 3000, 4000, 5000, 6000].map((freq, idx) => (
                <button
                  key={freq}
                  onClick={() => handleMemoryButtonClick(freq)}
                  className="py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-cyan-300 font-mono text-xs font-bold transition-all hover:bg-slate-800"
                >
                  Tone {idx + 1}
                  <span className="block text-[10px] text-slate-500">{freq} Hz</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* GAME 5: REACTION CHALLENGE */}
      {activeGame === 5 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Game 5: High-Frequency Reaction Challenge
              </h4>
              <p className="text-xs text-slate-400">
                Tap as fast as possible when you hear the auditory chime!
              </p>
            </div>
            <Badge variant="amber">Reaction Speed</Badge>
          </div>

          <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
            {reactionState === 'idle' && (
              <button
                onClick={handleStartReaction}
                className="px-8 py-4 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-bold text-xs mx-auto"
              >
                Start Reaction Test
              </button>
            )}

            {reactionState === 'waiting' && (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs animate-pulse">
                Get Ready... Listen for the chime!
              </div>
            )}

            {reactionState === 'ready' && (
              <button
                onClick={handlePressReaction}
                className="w-full py-12 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl animate-ping cursor-pointer"
              >
                TAP NOW!
              </button>
            )}

            {reactionState === 'done' && (
              <div className="space-y-4">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {reactionMs} ms
                </div>
                <p className="text-xs text-slate-400">Response recorded! Recovery Score updated.</p>
                <button
                  onClick={handleStartReaction}
                  className="px-6 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold mx-auto hover:bg-slate-700"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
