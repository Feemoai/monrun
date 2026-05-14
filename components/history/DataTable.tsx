'use client';
import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HistoryEntry, RoomId } from '@/types';
import { COMFORT_COLORS, COMFORT_DOT } from '@/lib/utils/comfort';

const PAGE_SIZE = 15;
const ROOMS: Array<RoomId | 'ALL'> = ['ALL', 'A', 'B', 'C'];

interface Props { history: HistoryEntry[] }

export function DataTable({ history }: Props) {
  const [room, setRoom]       = useState<RoomId | 'ALL'>('ALL');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [from, setFrom]       = useState('');
  const [to, setTo]           = useState('');

  const filtered = useMemo(() => {
    return history.filter((h) => {
      if (room !== 'ALL' && h.room !== room) return false;
      const ts = new Date(h.timestamp * 1000);
      if (from && ts < new Date(from)) return false;
      if (to   && ts > new Date(to + 'T23:59:59')) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          h.comfort.toLowerCase().includes(q) ||
          h.room.toLowerCase().includes(q) ||
          h.temp.toString().includes(q)
        );
      }
      return true;
    });
  }, [history, room, search, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="glass-card overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-white/5 flex flex-wrap gap-3">
        {/* Room filter */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {ROOMS.map((r) => (
            <button
              key={r}
              onClick={() => { setRoom(r); setPage(1); }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                room === r
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {r === 'ALL' ? 'Semua' : `Room ${r}`}
            </button>
          ))}
        </div>

        {/* Date range */}
        <input
          type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none focus:border-cyan-500/40"
        />
        <input
          type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }}
          className="bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none focus:border-cyan-500/40"
        />

        {/* Search */}
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Cari..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/60 outline-none focus:border-cyan-500/40 w-40"
          />
        </div>

        <span className="text-xs text-white/20 self-center">{filtered.length} entri</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Timestamp', 'Room', 'Suhu', 'Kelembapan', 'Heat Index', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-white/20">
                  Tidak ada data
                </td>
              </tr>
            ) : pageData.map((row, i) => (
              <tr key={i} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-xs text-white/40 font-mono">
                  {new Date(row.timestamp * 1000).toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
                    {row.room}
                  </span>
                </td>
                <td className="px-4 py-3 text-white font-medium">{row.temp.toFixed(1)} °C</td>
                <td className="px-4 py-3 text-blue-400">{Math.round(row.humidity)}%</td>
                <td className="px-4 py-3 text-amber-400">{row.heatIndex.toFixed(1)} °C</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${COMFORT_DOT[row.comfort]}`} />
                    <span className={`text-xs ${COMFORT_COLORS[row.comfort]}`}>{row.comfort}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
        <p className="text-xs text-white/30">
          Hal {page} dari {totalPages}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
