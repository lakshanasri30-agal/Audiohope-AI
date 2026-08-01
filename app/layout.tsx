import type { Metadata } from 'next';
import './globals.css';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AIChatbotModal } from '@/components/chat/AIChatbotModal';

export const metadata: Metadata = {
  title: 'AudioHope AI - AI Tinnitus Assessment & Rehabilitation Platform',
  description: 'Production-ready AI healthcare platform for tinnitus assessment, adaptive sound therapy, gamified rehabilitation, and patient monitoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AuthGuard>
            {children}
            <AIChatbotModal />
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
