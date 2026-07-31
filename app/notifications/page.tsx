'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/lib/store';
import {
  Bell,
  AlertTriangle,
  Volume2,
  Moon,
  HeartPulse,
  Headphones,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export default function SmartNotificationsPage() {
  const { notifications, markNotificationRead } = useAppStore();
  const [filterType, setFilterType] = useState<'All' | 'Critical' | 'Therapy' | 'Lifestyle'>('All');

  const defaultAlerts = [
    {
      id: 'alt_101',
      title: 'Acoustic Overexposure Warning',
      type: 'Critical',
      category: 'Noise',
      icon: <Volume2 className="w-5 h-5 text-rose-400" />,
      message: 'Headphone volume exceeded 85 dB for > 4.0 hours today. Rest your ears to prevent temporary threshold shift.',
      timestamp: '10 mins ago',
      read: false,
      actionUrl: '/therapy',
      actionText: 'Start Low-Volume Masking',
    },
    {
      id: 'alt_102',
      title: 'Sleep Deficit Alert',
      type: 'Lifestyle',
      category: 'Sleep',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      message: 'Nightly sleep duration dropped below 6.5 hours. Low sleep reduces central tinnitus habituation capacity.',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/monitoring',
      actionText: 'Log Sleep Metrics',
    },
    {
      id: 'alt_103',
      title: 'Elevated Perceived Stress Marker',
      type: 'Lifestyle',
      category: 'Stress',
      icon: <HeartPulse className="w-5 h-5 text-amber-400" />,
      message: 'Stress rating spiked to 7/10. Launch recommended 4-7-8 CBT vagal breathing session.',
      timestamp: '5 hours ago',
      read: false,
      actionUrl: '/therapy',
      actionText: 'Start CBT Session',
    },
    {
      id: 'alt_104',
      title: 'Therapy & Game Session Reminder',
      type: 'Therapy',
      category: 'Therapy',
      icon: <Headphones className="w-5 h-5 text-cyan-400" />,
      message: 'You have 1 pending daily sound therapy session and 1 auditory game remaining for today.',
      timestamp: '1 day ago',
      read: true,
      actionUrl: '/games',
      actionText: 'Launch Rehab Games',
    },
  ];

  const alerts = notifications.length > 0 ? notifications : defaultAlerts;

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'Critical') return a.type === 'Critical' || a.category === 'Noise';
    if (filterType === 'Therapy') return a.category === 'Therapy';
    if (filterType === 'Lifestyle') return a.category === 'Sleep' || a.category === 'Stress';
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Continuous Monitoring', href: '/monitoring' },
              { label: 'Smart Alert Engine' },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Bell className="w-7 h-7 text-amber-400" /> AI Smart Alert & Clinical Engine
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Automated risk detection for noise exposure, sleep deficits, stress spikes, and missed rehab tasks
              </p>
            </div>
            <Badge variant="amber" className="py-1.5 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Live Rule Engine
            </Badge>
          </div>

          {/* Alert Filter Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['All', 'Critical', 'Therapy', 'Lifestyle'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === tab
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {filteredAlerts.filter((a) => !a.read).length} Unread Notifications
            </span>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <GlassCard
                key={alert.id}
                className={`p-5 transition-all ${
                  !alert.read
                    ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                      {alert.icon || <ShieldAlert className="w-6 h-6 text-amber-400" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                        <Badge variant={alert.type === 'Critical' ? 'rose' : 'amber'}>
                          {alert.type || 'Alert'}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={alert.actionUrl || '/therapy'}
                      onClick={() => markNotificationRead(alert.id)}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                    >
                      {alert.actionText || 'Take Action'} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
