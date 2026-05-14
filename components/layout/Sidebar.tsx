'use client';
import Link              from 'next/link';
import { usePathname }   from 'next/navigation';
import { motion }        from 'framer-motion';
import {
  LayoutDashboard, History, Download,
  Sparkles, Cpu, ChevronRight,
} from 'lucide-react';

const NAV = [
  { href: '/',        label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/history', label: 'History',    icon: History         },
  { href: '/export',  label: 'Export',     icon: Download        },
  { href: '/ai',      label: 'Monrun AI',  icon: Sparkles        },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
        <Cpu className="w-4 h-4 text-cyan-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white leading-tight">Monrun</p>
        <p className="text-[10px] text-white/40 leading-none">IoT Dashboard</p>
      </div>
    </div>
  );
}

// ── 1. Mobile header (top bar, column layout) ─────────────────────
export function MobileHeader() {
  return (
    <header className="flex md:hidden items-center px-4 py-3 border-b border-white/5 bg-[#080e1d] shrink-0">
      <Logo />
    </header>
  );
}

// ── 2. Desktop sidebar (left column, row layout) ──────────────────
export function DesktopSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/5 bg-[#080e1d] overflow-y-auto">
      <div className="px-5 py-5 border-b border-white/5">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                  transition-all duration-150 cursor-pointer
                  ${active
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium">{label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto text-cyan-400/60" />}
                {label === 'Monrun AI' && !active && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
                    AI
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[10px] text-white/20">ESP32 v4.2 • 3 Ruangan</p>
      </div>
    </aside>
  );
}

// ── 3. Mobile bottom nav (tab bar, column layout) ─────────────────
export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="flex md:hidden items-stretch border-t border-white/5 bg-[#080e1d] shrink-0">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className="flex-1">
            <div className={`
              flex flex-col items-center justify-center gap-1 py-2.5
              transition-colors duration-150
              ${active ? 'text-cyan-400' : 'text-white/35 active:text-white/70'}
            `}>
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium leading-none">{label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
