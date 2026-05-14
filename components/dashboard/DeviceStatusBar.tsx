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
    <div className="glass-card px-3 md:px-5 py-2.5">
      {/* Row tunggal, semua item shrink jika perlu */}
      <div className="flex items-center gap-2 md:gap-0 overflow-x-auto no-scrollbar">

        {/* Device name */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-semibold text-white/60 tracking-wide">ESP32</span>
        </div>

        <Sep />

        {/* Connection */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isOnline ? (
            <>
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <Wifi className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-emerald-400 font-medium">Online</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <WifiOff className="w-3 h-3 text-red-400 shrink-0" />
              <span className="text-[11px] text-red-400 font-medium">Offline</span>
            </>
          )}
        </div>

        <Sep />

        {/* Last seen — short on mobile, full on desktop */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] text-white/30">
            <span className="hidden md:inline">Terakhir: </span>
            <span className="text-white/50">
              {/* Short format on mobile, full on desktop */}
              <span className="md:hidden">{elapsedStr} lalu</span>
              <span className="hidden md:inline">{elapsedFull}</span>
            </span>
          </span>
        </div>

        <Sep />

        {/* Battery */}
        <div className={`flex items-center gap-1.5 shrink-0 ${batColor}`}>
          <BatIcon className="w-3 h-3 shrink-0" />
          <span className="text-[11px] font-semibold tabular-nums">{pct}%</span>
          {/* Bar — only on desktop */}
          <div className="hidden md:block w-14 h-1 rounded-full bg-white/5 overflow-hidden shrink-0">
            <div
              className={`h-full rounded-full ${batBarBg} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Active room chip */}
        {data.activeRoom && (
          <>
            <Sep />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] text-white/30">Aktif:</span>
              <span className="text-[11px] font-bold text-cyan-400">
                Room {data.activeRoom}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Sep() {
  return <div className="h-3 w-px bg-white/10 shrink-0 mx-1 md:mx-3" />;
}
