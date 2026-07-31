'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface JourneyStep {
  id: number;
  title: string;
  shortLabel: string;
}

interface JourneyProgressProps {
  currentStep: number;
  steps: JourneyStep[];
  onStepClick?: (stepId: number) => void;
}

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="w-full space-y-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
      {/* Top Header & Percentage Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white uppercase tracking-wider">
          Patient Journey Progress
        </span>
        <span className="font-mono font-bold text-cyan-400">
          Step {currentStep} of {steps.length} ({progressPercent}%)
        </span>
      </div>

      {/* Progress Line */}
      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Indicators Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-2">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
              disabled={!isCompleted && !isCurrent}
              className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/20'
                  : isCurrent
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                  : 'bg-slate-950/60 text-slate-500 border border-slate-800/60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : isCurrent
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
              </div>
              <span className="text-[10px] font-semibold truncate w-full">
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
