'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PDFReportView } from '@/components/reports/PDFReportView';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, CheckCircle2, Home } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <Navbar />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Daily Monitoring', href: '/monitoring' },
              { label: 'Clinical Progress & AI Report' },
            ]}
          />

          {/* Journey Completion Banner */}
          <GlassCard className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-emerald-500/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald">Patient Journey Complete</Badge>
                    <span className="text-xs text-slate-400">Official Clinical Summary</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    Your Tinnitus AI Clinical Report is Ready
                  </h3>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Home className="w-4 h-4" /> Return to Dashboard
              </Link>
            </div>
          </GlassCard>

          <PDFReportView />
        </main>
    </div>
  );
}
