'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Cpu, ShieldCheck, Info, HelpCircle } from 'lucide-react';

interface XAIPanelProps {
  confidence: number;
  severity: string;
  shapFactors: { name: string; impact: number; description: string }[];
}

export const XAIPanel: React.FC<XAIPanelProps> = ({
  confidence = 94,
  severity = 'Moderate',
  shapFactors,
}) => {
  return (
    <GlassCard className="space-y-5 border-cyan-500/30">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explainable AI (XAI) Diagnostic Driver</h4>
        </div>
        <Badge variant="cyan">Confidence {confidence}%</Badge>
      </div>

      {/* Model Insight Callout */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-slate-200">
            Why AI Classified Tinnitus Severity as <span className="text-cyan-400">{severity}</span>:
          </p>
          <p className="text-slate-400 leading-relaxed">
            The Ensemble Random Forest & XGBoost prognostic pipeline analyzed audiometric thresholds, stress markers, sleep efficiency, and symptom duration.
          </p>
        </div>
      </div>

      {/* SHAP Feature Importance Breakdown */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>SHAP Feature Contribution Weights</span>
          <span className="text-[10px] text-slate-500 font-mono">Sum = 1.0</span>
        </h5>

        {shapFactors.map((factor, idx) => {
          const percent = Math.round(factor.impact * 100);
          return (
            <div key={idx} className="space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{factor.name}</span>
                <span className="font-mono font-bold text-cyan-400">{percent}% Impact</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 pt-0.5">{factor.description}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
