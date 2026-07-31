'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { AudiogramPlotter } from '@/components/assessment/AudiogramPlotter';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PATIENTS, PatientRecord } from '@/lib/mockData';
import {
  Users,
  Stethoscope,
  Activity,
  CheckCircle2,
  Calendar,
  FileText,
  AlertTriangle,
  Search,
  Check,
} from 'lucide-react';

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(MOCK_PATIENTS[0]);
  const [doctorNotes, setDoctorNotes] = useState(selectedPatient.doctorNotes || '');
  const [planApproved, setPlanApproved] = useState(selectedPatient.status === 'Plan Approved');

  const handlePatientSelect = (p: PatientRecord) => {
    setSelectedPatient(p);
    setDoctorNotes(p.doctorNotes || '');
    setPlanApproved(p.status === 'Plan Approved');
  };

  const handleApprovePlan = () => {
    setPlanApproved(true);
    selectedPatient.status = 'Plan Approved';
    selectedPatient.doctorNotes = doctorNotes;
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
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Stethoscope className="w-7 h-7 text-teal-400" /> Audiologist & ENT Clinical Portal
                </h2>
                <Badge variant="teal" className="py-1">Dr. Sarah Jenkins, Au.D.</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Patient roster management, AI prediction reviews, treatment plan approvals & clinical notes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Roster Sidebar */}
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" /> Patient Roster ({MOCK_PATIENTS.length})
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Sorted by Risk</span>
              </div>

              <div className="space-y-2">
                {MOCK_PATIENTS.map((p) => {
                  const isSelected = selectedPatient.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handlePatientSelect(p)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500/50 shadow-md shadow-teal-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{p.name}</span>
                        <Badge variant={p.riskLevel === 'High' ? 'rose' : p.riskLevel === 'Medium' ? 'amber' : 'emerald'}>
                          {p.riskLevel} Risk
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span>{p.age}y / {p.gender}</span>
                        <span className="font-mono text-cyan-300 font-semibold">{p.tinnitusPitchHz} Hz</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Patient Detailed Clinical Workspace */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="space-y-6 border-teal-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-white">{selectedPatient.name}</h3>
                      <Badge variant="cyan">ID: {selectedPatient.id}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedPatient.occupation} • Primary Ear: <span className="text-teal-400 font-bold">{selectedPatient.primaryEar}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {planApproved ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Plan Approved
                      </span>
                    ) : (
                      <button
                        onClick={handleApprovePlan}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Rehab Plan
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Predicted Severity</span>
                    <span className="text-cyan-400 font-bold text-sm">{selectedPatient.severity}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">THI Score</span>
                    <span className="text-amber-400 font-bold text-sm">{selectedPatient.thiScore} / 100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Pitch</span>
                    <span className="text-teal-400 font-mono font-bold text-sm">{selectedPatient.tinnitusPitchHz} Hz</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Recovery Index</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{selectedPatient.recoveryScore}%</span>
                  </div>
                </div>

                {/* Audiogram Viewer */}
                <AudiogramPlotter />

                {/* Doctor Clinical Notes Editor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" /> Audiologist Clinical Progress Notes
                  </label>
                  <textarea
                    rows={3}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Enter clinical notes, acoustic notch adjustments, or follow-up instructions..."
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleApprovePlan}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-all"
                    >
                      Save Clinical Notes
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
