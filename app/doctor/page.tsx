'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { AudiogramPlotter } from '@/components/assessment/AudiogramPlotter';
import { XAIPanel } from '@/components/assessment/XAIPanel';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PATIENTS, PatientRecord } from '@/lib/mockData';
import { approveDoctorPlan } from '@/lib/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
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
  Cpu,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Sliders,
  Save,
} from 'lucide-react';

export default function EnhancedDoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(MOCK_PATIENTS[0]);
  const [doctorNotes, setDoctorNotes] = useState<string>(selectedPatient.doctorNotes || '');
  const [planApproved, setPlanApproved] = useState<boolean>(selectedPatient.status === 'Plan Approved');
  const [notchFreq, setNotchFreq] = useState<number>(selectedPatient.tinnitusPitchHz || 4200);
  const [filterRole, setFilterRole] = useState<'All' | 'Priority' | 'Approved'>('All');

  // Appointments List
  const appointmentsList = [
    { id: 'apt_1', patient: 'Eleanor Vance', date: 'Today, 02:30 PM', type: 'High Risk Audiometry Review', status: 'Upcoming' },
    { id: 'apt_2', patient: 'Alex Mercer', date: 'Tomorrow, 10:00 AM', type: 'Teleconsultation & Notch Check', status: 'Scheduled' },
    { id: 'apt_3', patient: 'Marcus Brody', date: 'Aug 04, 11:15 AM', type: 'Progress Evaluation', status: 'Scheduled' },
  ];

  // Progress Comparison Baseline vs Current Data
  const progressComparisonData = [
    { metric: 'THI Score', baseline: 68, current: selectedPatient.thiScore, unit: 'pts' },
    { metric: 'VAS Annoyance', baseline: 82, current: selectedPatient.vasScore * 10, unit: 'pts' },
    { metric: 'Stress Index', baseline: 80, current: 60, unit: 'pts' },
    { metric: 'Sleep Efficiency', baseline: 55, current: 75, unit: '%' },
  ];

  const handlePatientSelect = (p: PatientRecord) => {
    setSelectedPatient(p);
    setDoctorNotes(p.doctorNotes || '');
    setPlanApproved(p.status === 'Plan Approved');
    setNotchFreq(p.tinnitusPitchHz || 4200);
  };

  const handleApprovePlan = async () => {
    setPlanApproved(true);
    selectedPatient.status = 'Plan Approved';
    selectedPatient.doctorNotes = doctorNotes;

    await approveDoctorPlan({
      patient_id: selectedPatient.id,
      doctor_notes: doctorNotes,
      notch_frequency_hz: notchFreq,
    });
  };

  const filteredPatients = MOCK_PATIENTS.filter((p) => {
    if (filterRole === 'Priority') return p.riskLevel === 'High' || p.status === 'Needs Review';
    if (filterRole === 'Approved') return p.status === 'Plan Approved';
    return true;
  });

  const priorityCount = MOCK_PATIENTS.filter((p) => p.riskLevel === 'High' || p.status === 'Needs Review').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb items={[{ label: 'Audiologist Clinical Portal' }]} />

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
                Patient roster review, priority risk alerts, audiometric plotting, treatment approvals & appointments
              </p>
            </div>
          </div>

          {/* Priority Patients Alert Banner */}
          {priorityCount > 0 && (
            <GlassCard className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border-rose-500/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="rose">Priority Clinical Alert</Badge>
                      <span className="text-xs text-slate-400">{priorityCount} Priority Patients Require Action</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Eleanor Vance (PAT-4309) flagged for High Risk & Unilateral Hearing Drop
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setFilterRole('Priority')}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-500/30 transition-all shrink-0"
                >
                  View Priority Patients
                </button>
              </div>
            </GlassCard>
          )}

          {/* Main 3-Column Clinical Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Patient List & Appointments */}
            <div className="space-y-6">
              {/* Patient List */}
              <GlassCard className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> Patient Roster ({filteredPatients.length})
                  </h3>

                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
                    {(['All', 'Priority', 'Approved'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilterRole(tab)}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${
                          filterRole === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredPatients.map((p) => {
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

              {/* Appointments List */}
              <GlassCard className="space-y-3 border-indigo-500/30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" /> Scheduled Appointments
                  </h3>
                  <Badge variant="purple">3 Upcoming</Badge>
                </div>

                <div className="space-y-2">
                  {appointmentsList.map((apt) => (
                    <div key={apt.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-200">
                        <span>{apt.patient}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">{apt.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{apt.type}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right 2 Columns: Detailed Clinical Workspace */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Patient Overview Header */}
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
                        <Check className="w-4 h-4" /> Plan Approved & Synced
                      </span>
                    ) : (
                      <button
                        onClick={handleApprovePlan}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Treatment Plan
                      </button>
                    )}
                  </div>
                </div>

                {/* Patient Summary Metrics */}
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
                    <span className="text-teal-400 font-mono font-bold text-sm">{notchFreq} Hz</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Recovery Index</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{selectedPatient.recoveryScore}%</span>
                  </div>
                </div>

                {/* Progress Comparison Chart: Baseline vs Current */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" /> Patient Clinical Progress Comparison (Baseline vs Current)
                  </h4>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="baseline" fill="#f43f5e" name="Initial Baseline" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="current" fill="#06d6a0" name="Current Assessment" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Treatment Plan Prescriptions Deck */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                  <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-400" /> Prescribed Treatment Plan Parameters
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">Prescribed Notched Therapy Frequency:</span>
                      <span className="text-teal-400 font-mono font-bold">{notchFreq} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="12000"
                      step="100"
                      value={notchFreq}
                      onChange={(e) => setNotchFreq(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                  </div>
                </div>

                {/* Explainable AI SHAP & Audiogram Visualizer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <XAIPanel confidence={selectedPatient.confidenceScore || 94} severity={selectedPatient.severity} shapFactors={selectedPatient.shapFactors} />
                  <AudiogramPlotter />
                </div>

                {/* Audiologist Clinical Notes Editor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" /> Audiologist Progress Notes & Prescriptions
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
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Clinical Notes & Sync Plan
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
