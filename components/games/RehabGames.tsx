'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { audioEngine } from '@/lib/audio/synthesizer';
import { GlassCard } from '@/components/ui/GlassCard';
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
} from 'lucide-react';

export const RehabGames: React.FC = () => {
  const { user, userPoints, userLevel, addGamePoints } = useAppStore();
  const [activeGame, setActiveGame] = useState<number>(1);

  // Game 1: Frequency Matching State
  const [targetFreq, setTargetFreq] = useState(4200);
  const [guessedFreq, setGuessedFreq] = useState(3000);
  const [freqSubmitted, setFreqSubmitted] = useState(false);
  const [freqScore, setFreqScore] = useState<number | null>(null);

  // Game 2: Sound Localization State
  const [panTarget, setPanTarget] = useState<'Left' | 'Center' | 'Right'>('Left');
  const [panUserChoice, setPanUserChoice] = useState<string | null>(null);
  const [panStreak, setPanStreak] = useState(0);

  // Game 3: Mask the Ringing Notch State
  const [notchTarget, setNotchTarget] = useState(user.tinnitusPitchHz || 4200);
  const [notchGuess, setNotchGuess] = useState(2500);
  const [notchSuccess, setNotchSuccess] = useState(false);

  // Game 4: Memory Sound Sequence State
  const [seqTarget, setSeqTarget] = useState<number[]>([1000, 2000, 3000]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [seqRound, setSeqRound] = useState(1);
  const [seqStatus, setSeqStatus] = useState<string>('Click Play Sequence to Listen');

  // Game 5: Reaction Challenge State
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'done'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionMs, setReactionMs] = useState<number | null>(null);

  // Start Frequency Matching Game Tone
  const handlePlayTargetTone = () => {
    audioEngine.playPureTone(targetFreq, 40);
    setTimeout(() => audioEngine.stopPureTone(), 2500);
  };

  const handlePlayGuessTone = () => {
    audioEngine.playPureTone(guessedFreq, 40);
    setTimeout(() => audioEngine.stopPureTone(), 2500);
  };

  const handleEvaluateFreq = () => {
    const diff = Math.abs(targetFreq - guessedFreq);
    const score = Math.max(0, 100 - Math.floor(diff / 50));
    setFreqScore(score);
    setFreqSubmitted(true);
    if (score > 70) {
      addGamePoints(150);
    }
  };

  const handleResetFreq = () => {
    const newTarget = Math.floor(1000 + Math.random() * 6000);
    setTargetFreq(newTarget);
    setGuessedFreq(2500);
    setFreqSubmitted(false);
    setFreqScore(null);
  };

  // Game 2 Logic
  const handleStartLocalizationRound = () => {
    const options: ('Left' | 'Center' | 'Right')[] = ['Left', 'Center', 'Right'];
    const chosen = options[Math.floor(Math.random() * options.length)];
    setPanTarget(chosen);
    setPanUserChoice(null);

    // Play tone with simulated spatial panning
    const freq = chosen === 'Left' ? 800 : chosen === 'Right' ? 3000 : 1800;
    audioEngine.playPureTone(freq, 45);
    setTimeout(() => audioEngine.stopPureTone(), 1500);
  };

  const handleLocalizationGuess = (choice: 'Left' | 'Center' | 'Right') => {
    setPanUserChoice(choice);
    if (choice === panTarget) {
      setPanStreak((prev) => prev + 1);
      addGamePoints(100);
    } else {
      setPanStreak(0);
    }
  };

  // Game 4 Logic (Auditory Memory)
  const handlePlayMemorySequence = () => {
    setSeqStatus('Listening to sequence...');
    setUserSeq([]);
    seqTarget.forEach((freq, idx) => {
      setTimeout(() => {
        audioEngine.playPureTone(freq, 45);
        setTimeout(() => audioEngine.stopPureTone(), 600);
      }, idx * 1000);
    });

    setTimeout(() => {
      setSeqStatus('Your turn! Click the pitch buttons in exact sequence.');
    }, seqTarget.length * 1000 + 400);
  };

  const handleMemoryButtonClick = (freq: number) => {
    audioEngine.playPureTone(freq, 40);
    setTimeout(() => audioEngine.stopPureTone(), 400);

    const nextSeq = [...userSeq, freq];
    setUserSeq(nextSeq);

    // Check if match
    for (let i = 0; i < nextSeq.length; i++) {
      if (nextSeq[i] !== seqTarget[i]) {
        setSeqStatus('Incorrect sequence! Try again.');
        setUserSeq([]);
        return;
      }
    }

    if (nextSeq.length === seqTarget.length) {
      setSeqStatus(`Awesome! Round ${seqRound} complete! +200 Points`);
      addGamePoints(200);
      setSeqRound((r) => r + 1);
      setSeqTarget((prev) => [...prev, Math.floor(1000 + Math.random() * 4000)]);
      setUserSeq([]);
    }
  };

  // Game 5 Reaction Logic
  const handleStartReaction = () => {
    setReactionState('waiting');
    setReactionMs(null);
    const delay = 1500 + Math.random() * 3000;
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
      addGamePoints(Math.max(50, 300 - Math.floor(elapsed / 2)));
    } else if (reactionState === 'waiting') {
      setReactionState('idle');
      alert('Too early! Wait for the chime before tapping.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Gamification Header Banner */}
      <GlassCard className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="purple">Level {userLevel} Auditory Master</Badge>
                <span className="text-xs text-slate-400 font-mono">{userPoints} Total Points</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Gamified Auditory Rehabilitation</h3>
              <p className="text-xs text-slate-400">
                Interactive acoustic games retrain brain auditory pathways & decrease tinnitus awareness.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Streak</span>
              <span className="text-lg font-bold text-amber-400">7 Days 🔥</span>
            </div>
            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Badges</span>
              <span className="text-lg font-bold text-cyan-400">4 Unlocked 🏅</span>
            </div>
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
          { id: 5, name: 'Reaction Time', icon: <Zap className="w-4 h-4" /> },
        ].map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold border transition-all ${
              activeGame === g.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {g.icon}
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* GAME 1: FREQUENCY MATCHING */}
      {activeGame === 1 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Game 1: Frequency Pitch Matching
              </h4>
              <p className="text-xs text-slate-400">
                Listen to the reference tone and adjust your tone slider until it matches the exact frequency.
              </p>
            </div>
            <Badge variant="cyan">+150 XP</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step 1: Listen Reference Tone</h5>
              <button
                onClick={handlePlayTargetTone}
                className="px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all font-semibold flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-current" /> Play Reference Tone
              </button>
              <p className="text-[11px] text-slate-500">Listen carefully to the pitch</p>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-4">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step 2: Adjust & Test Your Pitch</h5>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Guess Tone:</span>
                <span>{guessedFreq} Hz</span>
              </div>
              <input
                type="range"
                min="1000"
                max="8000"
                step="50"
                value={guessedFreq}
                onChange={(e) => setGuessedFreq(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
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
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95"
              >
                Submit Pitch Match
              </button>
            ) : (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                  <CheckCircle className="w-5 h-5" /> Match Score: {freqScore}% Accurate! Target was {targetFreq} Hz
                </div>
                <div>
                  <button
                    onClick={handleResetFreq}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 mx-auto hover:bg-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Next Round
                  </button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* GAME 2: SOUND LOCALIZATION */}
      {activeGame === 2 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-teal-400" /> Game 2: Stereo Sound Localization
              </h4>
              <p className="text-xs text-slate-400">
                Identify which directional origin (Left, Center, Right) the acoustic chime originated from.
              </p>
            </div>
            <Badge variant="teal">+100 XP / Round</Badge>
          </div>

          <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
            <button
              onClick={handleStartLocalizationRound}
              className="px-8 py-4 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all font-bold flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5 fill-current" /> Play Spatial Chime
            </button>

            <p className="text-xs text-slate-400">Where did the sound come from?</p>

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
                {panUserChoice === panTarget ? 'Correct Direction! +100 Points' : `Incorrect! Sound originated from ${panTarget}`}
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
                Adjust notch filter frequency until background tinnitus tone becomes completely suppressed.
              </p>
            </div>
            <Badge variant="purple">Notch Retraining</Badge>
          </div>

          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-purple-300">
              <span>Target Tinnitus Pitch: {notchTarget} Hz</span>
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
                  setNotchSuccess(true);
                  addGamePoints(120);
                } else {
                  setNotchSuccess(false);
                }
              }}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />

            {notchSuccess ? (
              <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-center text-purple-300 font-bold text-sm animate-bounce">
                🎉 Perfect Notch Alignment! Ringing Masked (+120 Points)
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">Slide to match target notch frequency</p>
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
                Memorize and repeat the pitch sequence played by the AI synthesizer.
              </p>
            </div>
            <Badge variant="purple">Round {seqRound}</Badge>
          </div>

          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-center space-y-6">
            <button
              onClick={handlePlayMemorySequence}
              className="px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all font-bold flex items-center gap-2 mx-auto"
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
                Tap as fast as possible when you hear the high-frequency auditory chime!
              </p>
            </div>
            <Badge variant="amber">Reaction Speed</Badge>
          </div>

          <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800 text-center space-y-6">
            {reactionState === 'idle' && (
              <button
                onClick={handleStartReaction}
                className="px-8 py-4 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-bold text-sm mx-auto"
              >
                Start Reaction Test
              </button>
            )}

            {reactionState === 'waiting' && (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 font-bold text-sm animate-pulse">
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
                <p className="text-xs text-slate-400">Great reflexes! Response recorded.</p>
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
