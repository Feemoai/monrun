import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Monrun — IoT Monitoring Dashboard',
  description: 'Real-time ESP32 environmental monitoring dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="bg-[#070d1a] text-white antialiased h-full overflow-hidden">
        {/*
          Layout "app shell":
          - Outer div: full height flex container
          - Sidebar: fixed width di desktop, hidden di mobile
          - Main: flex-1 + min-h-0 (wajib agar overflow-y-auto bisa scroll di flexbox)
                  pt/pb di mobile untuk ruang topbar & bottom nav yang fixed
        */}
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 min-h-0 overflow-y-auto
            pt-14 pb-16
            md:pt-0 md:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
