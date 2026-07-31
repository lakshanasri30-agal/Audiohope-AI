'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/lib/store';
import { Settings, User, Bell, Shield, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAppStore();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Settings className="w-7 h-7 text-cyan-400" /> Account & System Settings
              </h2>
              <p className="text-xs text-slate-400 mt-1">Manage profile, notifications & health data integrations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <User className="w-4 h-4 text-cyan-400" /> Personal Profile Info
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Smartphone className="w-4 h-4 text-teal-400" /> Wearable & Health Kit Integrations
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Apple Health Sync', status: 'Connected' },
                  { name: 'Google Fit / Fitbit Sync', status: 'Available' },
                  { name: 'Bluetooth Hearing Aid Link', status: 'Paired (Phonak Audéo)' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className="text-cyan-400 font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
