'use client';
import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import type { HistoryEntry, RoomId } from '@/types';
import { formatTimestamp } from '@/lib/utils/comfort';

const ROOMS: RoomId[] = ['A', 'B', 'C'];
const METRICS = [
  { key: 'temp',      label: 'Suhu',        color: '#f59e0b', unit: '°C' },
  { key: 'humidity',  label: 'Kelembapan',  color: '#06b6d4', unit: '%'  },
  { key: 'heatIndex', label: 'Heat Index',  color: '#f97316', unit: '°C' },
] as const;

interface Props { history: HistoryEntry[] }

export function ChartPanel({ history }: Props) {
  const [selectedRoom, setSelectedRoom] = useState<RoomId>('A');

  const chartData = useMemo(() => {
    const filtered = history
      .filter((h) => h.room === selectedRoom)
      .slice(0, 20)
      .reverse();
    return filtered.map((h) => ({
      time: new Date(h.timestamp * 1000).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
      }),
      temp:      h.temp,
      humidity:  h.humidity,
      heatIndex: h.heatIndex,
    }));
  }, [history, selectedRoom]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white">Tren Data</p>
          <p className="text-xs text-white/30 mt-0.5">20 titik terakhir</p>
        </div>
        {/* Room tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {ROOMS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoom(r)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedRoom === r
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Room {r}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-xs text-white/20">Belum ada data untuk Room {selectedRoom}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <defs>
              {METRICS.map((m) => (
                <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={m.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={m.color} stopOpacity={0}   />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0d1526',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                color: 'white',
                fontSize: 12,
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', paddingTop: 12 }}
            />
            {METRICS.map((m) => (
              <Area
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                fill={`url(#grad-${m.key})`}
                dot={false}
                activeDot={{ r: 4, fill: m.color }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
