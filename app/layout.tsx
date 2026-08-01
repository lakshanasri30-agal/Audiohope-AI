import type { Metadata } from 'next';
import './globals.css';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { AIChatbotModal } from '@/components/chat/AIChatbotModal';

export const metadata: Metadata = {
  title: 'AudioHope AI - AI Tinnitus Assessment & Rehabilitation Platform',
  description: 'Production-ready AI healthcare platform for tinnitus assessment, adaptive sound therapy, gamified rehabilitation, and audiologist clinical support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b132b] text-slate-100 selection:bg-cyan-500 selection:text-white">
        <AuthGuard>
          {children}
          <AIChatbotModal />
        </AuthGuard>
      </body>
    </html>
  );
}
