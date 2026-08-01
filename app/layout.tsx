import type { Metadata } from 'next';
import './globals.css';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { AIChatbotModal } from '@/components/chat/AIChatbotModal';

export const metadata: Metadata = {
  title: 'AudioHope Clinical AI - Patient Clinical Portal',
  description: 'Production-ready AI healthcare platform for tinnitus assessment, adaptive sound therapy, gamified rehabilitation, and patient monitoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="antialiased bg-[#f4f7fb] text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
        <AuthGuard>
          {children}
          <AIChatbotModal />
        </AuthGuard>
      </body>
    </html>
  );
}
