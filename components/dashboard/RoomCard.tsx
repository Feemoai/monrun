'use client';
import { useState, useCallback }     from 'react';
import { motion, AnimatePresence }   from 'framer-motion';
import {
  Thermometer, Droplets, Flame,
  School, Server, FlaskConical,
  Pencil, Check, X, Radio,
} from 'lucide-react';
import { updateRoomDescription }     from '@/lib/firebase-actions';
import { INPUT_LIMITS }              from '@/lib/constants';
import type { RoomId, RoomMeta, HistoryEntry, ComfortLevel } from '@/types';
import { COMFORT_COLORS, COMFORT_BG, COMFORT_DOT, getTempColor } from '@/lib/utils/comfort';

const ICONS: Record<string, React.ReactNode> = {
  school: <School       className="w-5 h-5" />,
  cpu:    <Server       className="w-5 h-5" />,
  flask:  <FlaskConical className="w-5 h-5" />,
};

interface Props {
  roomId:   RoomId;
  meta:     RoomMeta;
  latest?:  HistoryEntry;
  isActive: boolean;
}

export function RoomCard({ roomId, meta, latest, isActive }: Props) {
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(meta.description);
  const [saving,  setSaving]    = useState(false);
  const comfort = latest?.comfort as ComfortLevel | undefined;

  const [error,   setError]     = useState<string | null>(null);

  const saveDescription = useCallback(async () => {
    const trimmed = draft.trim();
    if (trimmed === meta.description) { setEditing(false); return; }
    if (!trimmed) { setError('Deskripsi tidak boleh kosong'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateRoomDescription(roomId, trimmed);
      setEditing(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan');
      setDraft(meta.description); // revert on error
    } finally {
      setSaving(false);
    }
  }, [draft, meta.description, roomId]);

  const cancelEdit = useCallback(() => {
    setDraft(meta.description);
    setError(null);
    setEditing(false);
  }, [meta.description]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`
        relative overflow-hidden rounded-2xl border p-5 flex flex-col gap-4
        transition-all duration-300 cursor-default
        ${isActive
          ? 'border-cyan-500/30 bg-[#0d1a2e] shadow-[0_0_32px_rgba(6,182,212,0.07)]'
          : 'border-white/[0.06] bg-[#0d1526] hover:border-white/10'
        }
      `}
    >
      {/* Active glow */}
      {isActive && (
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Room icon */}
          <div className={`
            w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            ${isActive
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
              : 'bg-white/5 text-white/35 border border-white/5'
            }
          `}>
            {ICONS[meta.icon] ?? <School className="w-5 h-5" />}
          </div>

          {/* Label + description */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-white truncate">{meta.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-white/25 font-mono border border-white/5 shrink-0">
                {roomId}
              </span>
              {isActive && (
                <span className="flex items-center gap-1 text-[9px] text-cyan-400 shrink-0">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  AKTIF
                </span>
              )}
            </div>

            {/* Editable description */}
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex flex-col gap-1 mt-1"
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      autoFocus
                      value={draft}
                      maxLength={INPUT_LIMITS.DESCRIPTION}
                      onChange={(e) => { setDraft(e.target.value); setError(null); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveDescription();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-1 min-w-0 bg-white/8 border border-cyan-500/30 rounded-lg
                        px-2 py-1 text-xs text-white outline-none focus:border-cyan-400/50"
                    />
                    <button
                      onClick={saveDescription}
                      disabled={saving}
                      className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {error && (
                    <p className="text-[10px] text-red-400 pl-0.5">{error}</p>
                  )}
                  <p className="text-[9px] text-white/20 pl-0.5">
                    {draft.length}/{INPUT_LIMITS.DESCRIPTION} karakter
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 group/desc"
                >
                  <p className="text-[11px] text-white/35 truncate">{meta.description}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="opacity-0 group-hover/desc:opacity-100 transition-opacity p-0.5 rounded hover:text-cyan-400 text-white/30"
                    title="Edit deskripsi"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Comfort badge */}
        {comfort && (
          <div className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-medium ${COMFORT_BG[comfort]}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${COMFORT_DOT[comfort]}`} />
            <span className={COMFORT_COLORS[comfort]}>{comfort.split(' - ')[0]}</span>
          </div>
        )}
      </div>

      {/* ── Data grid ──────────────────────────────────── */}
      {latest ? (
        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          <DataCell
            icon={<Thermometer className="w-3 h-3" />}
            label="Suhu"
            value={latest.temp.toFixed(1)}
            unit="°C"
            valueClass={getTempColor(latest.temp)}
          />
          <DataCell
            icon={<Droplets className="w-3 h-3" />}
            label="Lembap"
            value={Math.round(latest.humidity).toString()}
            unit="% RH"
            valueClass="text-blue-400"
          />
          <DataCell
            icon={<Flame className="w-3 h-3" />}
            label="Heat Index"
            value={latest.heatIndex.toFixed(1)}
            unit="°C"
            valueClass={comfort ? COMFORT_COLORS[comfort] : 'text-white'}
            highlight
          />
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center">
          <p className="text-xs text-white/15">Belum ada data sensor</p>
        </div>
      )}

      {/* ── Comfort strip ──────────────────────────────── */}
      {comfort && (
        <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${COMFORT_BG[comfort]} relative z-10`}>
          <span className={COMFORT_COLORS[comfort]}>{comfort}</span>
        </div>
      )}
    </motion.div>
  );
}

function DataCell({
  icon, label, value, unit, valueClass, highlight = false,
}: {
  icon: React.ReactNode; label: string; value: string;
  unit: string; valueClass: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 border transition-colors ${
      highlight
        ? 'bg-white/5 border-white/8'
        : 'bg-white/[0.025] border-white/[0.04]'
    }`}>
      <div className="flex items-center gap-1 text-white/25 mb-2">{icon}</div>
      <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold leading-none ${valueClass}`}>{value}</p>
      <p className="text-[9px] text-white/20 mt-0.5">{unit}</p>
    </div>
  );
}
