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

  // Format pendek untuk mobile, lengkap untuk desktop
  const elapsedShort =
    elapsed < 60    ? `${elapsed}d`
    : elapsed < 3600 ? `${Math.floor(elapsed / 60)}m`
    : `${Math.floor(elapsed / 3600)}j`;

  const elapsedFull =
    elapsed < 60    ? `${elapsed} detik lalu`
    : elapsed < 3600 ? `${Math.floor(elapsed / 60)} menit lalu`
    : `${Math.floor(elapsed / 3600)} jam lalu`;

  const batColor = pct > 70 ? 'text-emerald-400' : pct > 30 ? 'text-amber-400' : 'text-red-400';
  const batBarBg = pct > 70 ? 'bg-emerald-400'   : pct > 30 ? 'bg-amber-400'   : 'bg-red-400';
  const BatIcon  = pct > 70 ? BatteryFull : pct > 30 ? Battery : BatteryLow;

  return (
    <div className="flex items-center px-3 md:px-5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] overflow-x-auto gap-0">

      {/* Device */}
      <div className="flex items-center gap-1.5 pr-3 md:pr-5 shrink-0">
        <Cpu className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] md:text-xs font-semibold text-white/60 tracking-wide">
          <span className="hidden md:inline">ESP32-01</span>
          <span className="md:hidden">ESP32</span>
        </span>
      </div>

      <Sep />

      {/* Connection */}
      <div className="flex items-center gap-1.5 px-3 md:px-5 shrink-0">
        {isOnline ? (
          <>
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <Wifi className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[10px] md:text-xs text-emerald-400 font-medium">Online</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <WifiOff className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-[10px] md:text-xs text-red-400 font-medium">Offline</span>
          </>
        )}
      </div>

      <Sep />

      {/* Last seen — short on mobile */}
      <span className="px-3 md:px-5 shrink-0 text-white/30 text-[10px] md:text-xs">
        <span className="md:hidden">{elapsedShort} lalu</span>
        <span className="hidden md:inline">Terakhir:&nbsp;<span className="text-white/50">{elapsedFull}</span></span>
      </span>

      <Sep />

      {/* Battery */}
      <div className={`flex items-center gap-1.5 pl-3 md:pl-5 shrink-0 ${batColor}`}>
        <BatIcon className="w-3 h-3 shrink-0" />
        <span className="text-[10px] md:text-xs font-semibold tabular-nums">{pct}%</span>
        {/* Bar — hanya desktop */}
        <div className="hidden md:block w-12 h-1 rounded-full bg-white/5 overflow-hidden shrink-0">
          <div className={`h-full rounded-full ${batBarBg} transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Active room — hanya jika ada */}
      {data.activeRoom && (
        <>
          <Sep />
          <div className="flex items-center gap-1 pl-3 md:pl-5 shrink-0">
            <span className="text-[9px] text-white/25 hidden md:inline">Aktif:</span>
            <span className="text-[10px] md:text-xs font-bold text-cyan-400">R.{data.activeRoom}</span>
          </div>
        </>
      )}
    </div>
  );
}

function Sep() {
  return <div className="h-3 w-px bg-white/8 shrink-0 mx-0.5 md:mx-0" />;
}
