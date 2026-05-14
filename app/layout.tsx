import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DesktopSidebar, MobileHeader, MobileBottomNav } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Monrun — IoT Monitoring Dashboard',
  description: 'Real-time ESP32 environmental monitoring dashboard',
};

/**
 * App Shell Layout — Pure Flexbox (tanpa fixed positioning)
 *
 * Mobile  (< md):  kolom  →  [MobileHeader | main scroll | MobileBottomNav]
 * Desktop (>= md): baris  →  [DesktopSidebar | main scroll]
 *
 * Kunci: flex-col md:flex-row + h-full pada wrapper + flex-1 min-h-0 pada main
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable} style={{ height: '100%' }}>
      <body
        className="bg-[#070d1a] text-white antialiased"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Wrapper: column on mobile, row on desktop */}
        <div
          className="flex flex-col md:flex-row"
          style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
        >
          {/* 1. Mobile top header (hanya muncul di mobile) */}
          <MobileHeader />

          {/* 2. Desktop sidebar (hanya muncul di desktop md+) */}
          <DesktopSidebar />

          {/* 3. Main content — flex-1 agar isi sisa ruang, overflow-y-auto untuk scroll */}
          <main
            className="flex-1 overflow-y-auto"
            style={{ minHeight: 0, minWidth: 0 }}
          >
            {children}
          </main>

          {/* 4. Mobile bottom nav (hanya muncul di mobile) */}
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
