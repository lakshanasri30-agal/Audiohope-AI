'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Building2,
  BarChart3,
  Bell,
  Cpu,
  FileCheck2,
  Search,
  Plus,
  RefreshCw,
  Send,
  Lock,
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export default function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Users' | 'Doctors' | 'Hospitals' | 'Analytics' | 'Notifications' | 'AI Models' | 'Audit Logs'
  >('Overview');

  // Management Mock Data
  const [usersList, setUsersList] = useState([
    { id: 'usr_101', name: 'Alex Mercer', role: 'Patient', status: 'Active', plan: 'Premium Rehab', joined: '2026-01-15' },
    { id: 'usr_102', name: 'Eleanor Vance', role: 'Patient', status: 'Active', plan: 'Clinical Care', joined: '2026-02-01' },
    { id: 'usr_103', name: 'Marcus Brody', role: 'Patient', status: 'Suspended', plan: 'Basic', joined: '2026-03-10' },
  ]);

  const [doctorsList, setDoctorsList] = useState([
    { id: 'doc_201', name: 'Dr. Sarah Jenkins, Au.D.', specialty: 'Audiology Lead', license: 'AUD-8921-US', status: 'Verified', patients: 48 },
    { id: 'doc_202', name: 'Dr. Robert Vance, MD', specialty: 'ENT Specialist', license: 'ENT-4410-NY', status: 'Verified', patients: 32 },
    { id: 'doc_203', name: 'Dr. Maya Lin, Ph.D.', specialty: 'Neuro-Audiologist', license: 'AUD-1102-CA', status: 'Pending Review', patients: 12 },
  ]);

  const [hospitalsList, setHospitalsList] = useState([
    { id: 'hosp_301', name: 'Johns Hopkins Audiology Center', location: 'Baltimore, MD', status: 'API Connected', patients: 340 },
    { id: 'hosp_302', name: 'Mayo Clinic Hearing Health', location: 'Rochester, MN', status: 'API Connected', patients: 520 },
    { id: 'hosp_303', name: 'Stanford Otolaryngology Clinic', location: 'Stanford, CA', status: 'Pending Approval', patients: 180 },
  ]);

  const [aiModelsList, setAiModelsList] = useState([
    { name: 'Ensemble Tinnitus Severity Classifier', version: 'v2.4-Ensemble', algorithm: 'Random Forest + XGBoost', accuracy: '94.2%', status: 'Active Production' },
    { name: 'Audiogram OCR Reader Engine', version: 'v1.8-OCR', algorithm: 'Vision Transformer', accuracy: '98.5%', status: 'Active Production' },
    { name: 'Habituation Risk Prognosticator', version: 'v3.0-Beta', algorithm: 'Neural ODE', accuracy: '91.8%', status: 'Staging' },
  ]);

  const [auditLogsList, setAuditLogsList] = useState([
    { id: 'log_901', timestamp: '2026-07-31 18:42:10', actor: 'Admin (System)', action: 'AI_MODEL_RETRAIN_COMPLETE', target: 'v2.4-Ensemble', ip: '192.168.1.1' },
    { id: 'log_902', timestamp: '2026-07-31 18:35:44', actor: 'Dr. Sarah Jenkins', action: 'DOCTOR_PLAN_APPROVED', target: 'PAT-4309', ip: '10.0.4.12' },
    { id: 'log_903', timestamp: '2026-07-31 18:10:02', actor: 'Patient Alex Mercer', action: 'ASSESSMENT_COMPLETED', target: 'ASM-1092', ip: '172.16.0.4' },
  ]);

  // Analytics Datasets
  const platformAnalyticsData = [
    { month: 'Jan', assessments: 320, activeUsers: 450, therapyHours: 1200 },
    { month: 'Feb', assessments: 480, activeUsers: 680, therapyHours: 1850 },
    { month: 'Mar', assessments: 620, activeUsers: 890, therapyHours: 2400 },
    { month: 'Apr', assessments: 850, activeUsers: 1120, therapyHours: 3100 },
    { month: 'May', assessments: 1100, activeUsers: 1420, therapyHours: 4200 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb items={[{ label: 'System Admin & Operations Center' }]} />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-indigo-400" /> Admin & Healthcare Operations Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage users, doctors, hospitals, system analytics, AI models, broadcast alerts & HIPAA audit logs
              </p>
            </div>
            <Badge variant="purple" className="py-1.5 px-3">
              <Lock className="w-3.5 h-3.5 mr-1" /> Super Admin Credentials Active
            </Badge>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex overflow-x-auto gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 scrollbar-none">
            {[
              { id: 'Overview', label: 'System Overview', icon: <Activity className="w-4 h-4" /> },
              { id: 'Users', label: 'Users', icon: <Users className="w-4 h-4" /> },
              { id: 'Doctors', label: 'Doctors', icon: <Stethoscope className="w-4 h-4" /> },
              { id: 'Hospitals', label: 'Hospitals', icon: <Building2 className="w-4 h-4" /> },
              { id: 'Analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'Notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'AI Models', label: 'AI Models', icon: <Cpu className="w-4 h-4" /> },
              { id: 'Audit Logs', label: 'Audit Logs', icon: <FileCheck2 className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 1. OVERVIEW & METRICS HUB */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="p-5 border-cyan-500/30">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Total Registered Patients</span>
                  <span className="text-3xl font-extrabold text-white font-mono mt-1 block">1,420</span>
                  <span className="text-[11px] text-teal-400 font-semibold">+18% Monthly Growth</span>
                </GlassCard>

                <GlassCard className="p-5 border-teal-500/30">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">Verified Audiologists</span>
                  <span className="text-3xl font-extrabold text-teal-300 font-mono mt-1 block">48</span>
                  <span className="text-[11px] text-teal-400 font-semibold">12 Hospital Affiliations</span>
                </GlassCard>

                <GlassCard className="p-5 border-purple-500/30">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">AI Model Accuracy</span>
                  <span className="text-3xl font-extrabold text-purple-300 font-mono mt-1 block">94.2%</span>
                  <span className="text-[11px] text-purple-400 font-semibold">v2.4-Ensemble Engine</span>
                </GlassCard>

                <GlassCard className="p-5 border-emerald-500/30">
                  <span className="text-xs text-slate-400 font-semibold uppercase block">System Health & Uptime</span>
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">99.98%</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">HIPAA / GDPR Compliant</span>
                </GlassCard>
              </div>

              {/* Platform Analytics Preview Chart */}
              <GlassCard className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" /> Platform Growth & Monthly Assessment Volume
                  </h3>
                  <Badge variant="cyan">Real-time Telemetry</Badge>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={platformAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="assessments" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} name="Assessments Completed" />
                      <Area type="monotone" dataKey="activeUsers" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} name="Active Users" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          )}

          {/* 2. USERS MANAGEMENT */}
          {activeTab === 'Users' && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" /> Patient & User Account Management
                </h3>
                <Badge variant="cyan">{usersList.length} Active Accounts</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">User ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Subscription</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-cyan-400">{u.id}</td>
                        <td className="p-3 font-bold text-white">{u.name}</td>
                        <td className="p-3">{u.role}</td>
                        <td className="p-3">{u.plan}</td>
                        <td className="p-3">
                          <Badge variant={u.status === 'Active' ? 'emerald' : 'rose'}>{u.status}</Badge>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setUsersList(usersList.map(x => x.id === u.id ? { ...x, status: x.status === 'Active' ? 'Suspended' : 'Active' } : x));
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-[11px]"
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* 3. DOCTORS MANAGEMENT */}
          {activeTab === 'Doctors' && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" /> Audiologist & ENT Specialist Verifications
                </h3>
                <Badge variant="teal">{doctorsList.length} Specialists</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Doctor Name</th>
                      <th className="p-3">Specialty</th>
                      <th className="p-3">License Number</th>
                      <th className="p-3">Assigned Patients</th>
                      <th className="p-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {doctorsList.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white">{d.name}</td>
                        <td className="p-3">{d.specialty}</td>
                        <td className="p-3 font-mono text-cyan-300">{d.license}</td>
                        <td className="p-3 font-bold">{d.patients} Patients</td>
                        <td className="p-3">
                          <Badge variant={d.status === 'Verified' ? 'emerald' : 'amber'}>{d.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* 4. HOSPITALS MANAGEMENT */}
          {activeTab === 'Hospitals' && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" /> Partner Hospitals & Clinical Networks
                </h3>
                <Badge variant="purple">{hospitalsList.length} Connected Clinics</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Hospital Center</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Patient Volume</th>
                      <th className="p-3">Integration Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {hospitalsList.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-bold text-white">{h.name}</td>
                        <td className="p-3">{h.location}</td>
                        <td className="p-3 font-bold text-cyan-300">{h.patients} Patients</td>
                        <td className="p-3">
                          <Badge variant={h.status === 'API Connected' ? 'emerald' : 'amber'}>{h.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* 5. AI MODELS MANAGEMENT */}
          {activeTab === 'AI Models' && (
            <GlassCard className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Machine Learning Model Orchestrator
                </h3>
                <button
                  onClick={() => alert('Triggered model retraining pipeline on FastAPI backend!')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Trigger Model Retrain
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiModelsList.map((m, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="cyan">{m.version}</Badge>
                      <span className="text-xs font-mono font-bold text-emerald-400">{m.accuracy} Acc</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{m.name}</h4>
                    <p className="text-xs text-slate-400">Algorithm: <span className="text-slate-200">{m.algorithm}</span></p>
                    <Badge variant={m.status.includes('Active') ? 'emerald' : 'amber'}>{m.status}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* 6. SYSTEM NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <GlassCard className="space-y-4 max-w-2xl mx-auto">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" /> Broadcast System Announcement
                </h3>
                <p className="text-xs text-slate-400">Send emergency or clinical updates to active patient sessions</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Announcement Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Scheduled Sound Therapy Maintenance..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Broadcast Content</label>
                  <textarea
                    rows={3}
                    placeholder="Message body..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => alert('System notification broadcast sent to active patient sessions!')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Broadcast
                </button>
              </div>
            </GlassCard>
          )}

          {/* 7. AUDIT LOGS & COMPLIANCE */}
          {activeTab === 'Audit Logs' && (
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" /> HIPAA & Security Audit Log Trail
                </h3>
                <Badge variant="emerald">Encrypted Audit Stream</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor / User</th>
                      <th className="p-3">Action Event</th>
                      <th className="p-3">Target ID</th>
                      <th className="p-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                    {auditLogsList.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/50">
                        <td className="p-3 text-slate-400">{l.timestamp}</td>
                        <td className="p-3 font-bold text-white">{l.actor}</td>
                        <td className="p-3 text-cyan-400 font-bold">{l.action}</td>
                        <td className="p-3 text-emerald-400">{l.target}</td>
                        <td className="p-3 text-slate-500">{l.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </main>
      </div>
    </div>
  );
}
