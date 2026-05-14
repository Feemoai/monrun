'use client';
import { useEffect, useState } from 'react';
import { Wifi, WifiOff, BatteryFull, Battery, BatteryLow, Cpu } from 'lucide-react';
import type { DeviceData } from '@/types';

interface Props { data: DeviceData; isOnline: boolean }

export function DeviceStatusBar({ data, isOnline }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const pct = data.battery ?? 0;

  useEffect(() => {
    const tick = () => setElapsed(Math.floor(Date.now() / 1000 - data.lastSeen));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data.lastSeen]);

  const elapsedStr =
    elapsed < 60   ? `${elapsed} detik lalu`
    : elapsed < 3600 ? `${Math.floor(elapsed / 60)} menit lalu`
    : `${Math.floor(elapsed / 3600)} jam lalu`;

  const batColor  = pct > 70 ? 'text-emerald-400' : pct > 30 ? 'text-amber-400' : 'text-red-400';
  const batBarBg  = pct > 70 ? 'bg-emerald-400'   : pct > 30 ? 'bg-amber-400'   : 'bg-red-400';
  const BatIcon   = pct > 70 ? BatteryFull : pct > 30 ? Battery : BatteryLow;

  return (
    <div className="flex items-center gap-0 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs overflow-hidden">

      {/* Device name */}
      <div className="flex items-center gap-2 pr-5">
        <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="font-semibold text-white/70 tracking-wide">ESP32-01</span>
      </div>

      <Sep />

      {/* Connection */}
      <div className="flex items-center gap-2 px-5">
        {isOnline ? (
          <>
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-medium">Online</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <WifiOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-red-400 font-medium">Offline</span>
          </>
        )}
      </div>

      <Sep />

      {/* Last seen */}
      <span className="px-5 text-white/30">
        Terakhir:&nbsp;<span className="text-white/50">{elapsedStr}</span>
      </span>

      <Sep />

      {/* Battery */}
      <div className={`flex items-center gap-2 px-5 ${batColor}`}>
        <BatIcon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold tabular-nums">{pct}%</span>
        {/* Mini bar */}
        <div className="w-14 h-1 rounded-full bg-white/5 overflow-hidden shrink-0">
          <div
            className={`h-full rounded-full ${batBarBg} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Sep() {
  return <div className="h-3.5 w-px bg-white/8 shrink-0" />;
}
