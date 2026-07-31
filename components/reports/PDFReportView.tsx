'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PATIENTS, MOCK_WEEKLY_TRENDS } from '@/lib/mockData';
import { Printer, Download, FileCheck, Stethoscope, ShieldCheck } from 'lucide-react';

export const PDFReportView: React.FC = () => {
  const patient = MOCK_PATIENTS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Clinical Progress & AI Report</h3>
          <p className="text-xs text-slate-400">Official medical summary formatted for Audiologist review</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:opacity-95"
        >
          <Printer className="w-4 h-4" /> Download / Print PDF Report
        </button>
      </div>

      {/* Report Document Box */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6 print:bg-white print:text-black print:p-0">
        {/* Document Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-lg">
              T
            </div>
            <div>
              <h2 className="text-lg font-bold text-white print:text-black">AudioHope AI Clinical Diagnostic Report</h2>
              <p className="text-xs text-slate-400 print:text-gray-600">Report Reference ID: #TC-2026-8921</p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block print:text-gray-600">Generated Date</span>
            <span className="font-bold text-white print:text-black font-mono">July 31, 2026</span>
          </div>
        </div>

        {/* Patient Demographic Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-gray-100 print:border-gray-300 print:text-black">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Patient Name</span>
            <span className="text-xs font-bold text-white print:text-black">{patient.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Age / Gender</span>
            <span className="text-xs font-bold text-white print:text-black">{patient.age} yrs / {patient.gender}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Primary Ear</span>
            <span className="text-xs font-bold text-cyan-400">{patient.primaryEar}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Tinnitus Pitch</span>
            <span className="text-xs font-bold text-teal-400 font-mono">{patient.tinnitusPitchHz} Hz</span>
          </div>
        </div>

        {/* AI Severity & Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:border-gray-300">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">AI Severity Rating</span>
            <span className="text-lg font-bold text-cyan-300">{patient.severity} ({patient.thiScore}/100 THI)</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:border-gray-300">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Overall Recovery Index</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{patient.recoveryScore}%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:border-gray-300">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Therapy Adherence</span>
            <span className="text-lg font-bold text-purple-400 font-mono">92% (14 Sessions)</span>
          </div>
        </div>

        {/* Doctor Recommendations */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2 print:bg-gray-50 print:border-gray-400 print:text-black">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 print:text-black">
            <Stethoscope className="w-4 h-4" /> Audiologist Clinical Notes & Plan Approval
          </div>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            {patient.doctorNotes}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="text-[10px] text-slate-500 print:text-gray-500 border-t border-slate-800 pt-4 flex items-center justify-between">
          <span>AudioHope AI Healthcare Platform v1.0 • Clinical Decision Support Systems</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-cyan-400" /> HIPAA / GDPR Compliant Standards</span>
        </div>
      </div>
    </div>
  );
};
