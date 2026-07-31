'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { PDFReportView } from '@/components/reports/PDFReportView';

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <PDFReportView />
        </main>
      </div>
    </div>
  );
}
