'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Cpu, Info, ShieldCheck, HelpCircle, Activity } from 'lucide-react';

export interface SHAPFeature {
  name: string;
  category: 'Stress' | 'Sleep' | 'Noise Exposure' | 'Duration' | 'Hearing Loss';
  impact: number; // 0.0 to 1.0 (e.g., 0.35 = 35%)
  colorClass: string;
  explanation: string;
}

interface XAIPanelProps {
  confidence: number;
  severity: string;
  shapFactors?: SHAPFeature[];
}

export const XAIPanel: React.FC<XAIPanelProps> = ({
  confidence = 94.2,
  severity = 'Moderate',
  shapFactors,
}) => {
  // Default 5 clinical features if custom list not passed
  const defaultFeatures: SHAPFeature[] = [
    {
      name: 'High Frequency Hearing Loss',
      category: 'Hearing Loss',
      impact: 0.38,
      colorClass: 'from-cyan-500 to-teal-400',
      explanation: 'Notched audiometric threshold drop detected at 4.2 kHz frequency band.',
    },
    {
      name: 'Elevated Perceived Stress Marker',
      category: 'Stress',
      impact: 0.24,
      colorClass: 'from-rose-500 to-amber-400',
      explanation: 'VAS stress rating (6/10) increases sympathetic nervous system auditory cortex reactivity.',
    },
    {
      name: 'Sleep Duration & Efficiency Deficit',
      category: 'Sleep',
      impact: 0.18,
      colorClass: 'from-indigo-500 to-purple-400',
      explanation: 'Average 6.5h sleep duration lowers nocturnal habituation and central acoustic masking.',
    },
    {
      name: 'Acoustic Overexposure & Headphone Usage',
      category: 'Noise Exposure',
      impact: 0.12,
      colorClass: 'from-teal-500 to-emerald-400',
      explanation: 'Daily 4.0h headphone usage exceeds safe noise exposure guidelines (80 dB limit).',
    },
    {
      name: 'Symptom Duration & Central Chronicity',
      category: 'Duration',
      impact: 0.08,
      colorClass: 'from-purple-500 to-pink-400',
      explanation: 'Persistent symptom history > 12 months reflects established neuroplastic neural loop.',
    },
  ];

  const features = shapFactors || defaultFeatures;

  return (
    <GlassCard className="space-y-5 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      {/* Header & Confidence Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Explainable AI (XAI) SHAP Diagnostic Panel
          </h4>
        </div>
        <Badge variant="cyan" className="py-1">
          Prediction Confidence: {confidence}%
        </Badge>
      </div>

      {/* Overview Callout */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-slate-200">
            Why AI Classified Tinnitus Severity as <span className="text-cyan-400 font-bold">{severity}</span>:
          </p>
          <p className="text-slate-400 leading-relaxed">
            SHAP (SHapley Additive exPlanations) values quantify how each clinical feature pushed the model prediction relative to baseline.
          </p>
        </div>
      </div>

      {/* SHAP Feature Contribution List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
          <span>Clinical Feature Drivers</span>
          <span className="text-[10px] text-slate-500 font-mono">SHAP Contribution Weight</span>
        </div>

        {features.map((feature, idx) => {
          const percent = Math.round(feature.impact * 100);
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              {/* Feature Title & Percentage */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white">{feature.name}</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">{feature.category}</Badge>
                </div>
                <span className="font-mono font-extrabold text-cyan-300">{percent}% Impact</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${feature.colorClass} rounded-full transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Clinical Explanation Beside Feature */}
              <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5 flex items-start gap-1.5">
                <span className="text-cyan-400 font-semibold shrink-0">Explanation:</span>
                <span>{feature.explanation}</span>
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
