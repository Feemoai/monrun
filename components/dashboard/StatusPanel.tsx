'use client';
import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Battery, BatteryLow, BatteryFull, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DeviceData } from '@/types';

interface Props {
  data: DeviceData;
  isOnline: boolean;
}

function BatteryIcon({ pct }: { pct: number }) {
  if (pct > 70) return <BatteryFull className="w-4 h-4" />;
  if (pct > 30) return <Battery     className="w-4 h-4" />;
  return             <BatteryLow  className="w-4 h-4" />;
}

function batteryColor(pct: number) {
  if (pct > 70) return 'text-emerald-400';
  if (pct > 30) return 'text-amber-400';
  return 'text-red-400';
}

export function StatusPanel({ data, isOnline }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = () =>
      setElapsed(Math.floor(Date.now() / 1000 - data.lastSeen));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data.lastSeen]);

  const batPct = data.battery ?? 0;

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Status Perangkat</p>

      {/* Online / Offline */}
      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          {isOnline ? (
            <motion.div
              key="online"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <div className="relative flex items-center justify-center w-5 h-5">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </div>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Online</span>
            </motion.div>
          ) : (
            <motion.div
              key="offline"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Offline</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last seen */}
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <Clock className="w-3 h-3" />
          <span>
            {elapsed < 60
              ? `${elapsed}d lalu`
              : elapsed < 3600
              ? `${Math.floor(elapsed / 60)}m lalu`
              : `${Math.floor(elapsed / 3600)}j lalu`}
          </span>
        </div>
      </div>

      <div className="gradient-line" />

      {/* Battery */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center gap-2 ${batteryColor(batPct)}`}>
            <BatteryIcon pct={batPct} />
            <span className="text-sm font-semibold">{batPct}%</span>
          </div>
          <span className="text-[10px] text-white/30">Baterai</span>
        </div>
        {/* Bar */}
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${batPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              batPct > 70 ? 'bg-emerald-400'
              : batPct > 30 ? 'bg-amber-400'
              : 'bg-red-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
