'use client';
import { AlertTriangle, TrendingUp, Award } from 'lucide-react';
import type { DeviceData, HistoryEntry, RoomId } from '@/types';
import { COMFORT_COLORS, getTempColor } from '@/lib/utils/comfort';

interface Props {
  data:    DeviceData;
  history: HistoryEntry[];   // dari useHistory — per-room, tidak hilang
}

export function InsightsPanel({ data, history }: Props) {
  // Gunakan rooms[id].latest untuk data terkini per-room
  const latestPerRoom: Record<string, number> = {};

  (Object.keys(data.rooms ?? {}) as RoomId[]).forEach((id) => {
    const latest = data.rooms[id]?.latest;
    if (latest) latestPerRoom[id] = latest.temp;
  });
  // Fallback ke history jika latest belum ada di room
  history.forEach((h) => {
    if (!latestPerRoom[h.room]) latestPerRoom[h.room] = h.temp;
  });

  const hottestRoomId = Object.entries(latestPerRoom)
    .sort(([, a], [, b]) => b - a)[0]?.[0] as RoomId | undefined;

  const hottestTemp  = hottestRoomId ? latestPerRoom[hottestRoomId] : null;
  const hottestLabel = hottestRoomId
    ? (data.rooms[hottestRoomId]?.label ?? `Room ${hottestRoomId}`)
    : '—';

  // Warnings: cek per-room latest comfort
  const warnings = (Object.keys(data.rooms ?? {}) as RoomId[]).filter((id) => {
    const comfort = data.rooms[id]?.latest?.comfort;
    return comfort === 'Berbahaya - Panas!' || comfort === 'Ekstrem - Sangat Berbahaya!';
  });

  // Data ruangan aktif
  const activeId      = data.activeRoom;
  const activeMeta    = activeId ? data.rooms[activeId] : undefined;
  const activeLatest  = activeMeta?.latest;

  return (
    <div className="glass-card p-5 space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Insights</p>

      {/* Hottest room */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <p className="text-xs text-white/40">Suhu Tertinggi</p>
          <p className="text-sm font-semibold text-white mt-0.5">{hottestLabel}</p>
          {hottestTemp != null && (
            <p className={`text-xs font-bold mt-0.5 ${getTempColor(hottestTemp)}`}>
              {hottestTemp.toFixed(1)} °C
            </p>
          )}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 ? (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Peringatan</p>
            {warnings.map((id) => (
              <p key={id} className="text-xs font-medium text-red-400 mt-0.5">
                {data.rooms[id]?.label ?? `Room ${id}`} — Kondisi berbahaya!
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Status Kondisi</p>
            <p className="text-sm font-semibold text-emerald-400 mt-0.5">Semua Ruangan Normal</p>
          </div>
        </div>
      )}

      {/* Ruangan aktif */}
      {activeLatest && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-white/3 border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Sedang Diukur</p>
          <p className="text-xs font-semibold text-white">
            {activeMeta?.label ?? `Room ${activeId}`}
          </p>
          <p className={`text-xs mt-0.5 ${COMFORT_COLORS[activeLatest.comfort]}`}>
            {activeLatest.comfort}
          </p>
        </div>
      )}
    </div>
  );
}
