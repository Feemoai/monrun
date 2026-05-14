import type { ComfortLevel } from '@/types';

export const COMFORT_COLORS: Record<ComfortLevel, string> = {
  'Nyaman':                        'text-emerald-400',
  'Waspada - Agak Panas':          'text-amber-400',
  'Berbahaya - Panas!':            'text-orange-500',
  'Ekstrem - Sangat Berbahaya!':   'text-red-500',
};

export const COMFORT_BG: Record<ComfortLevel, string> = {
  'Nyaman':                        'bg-emerald-500/10 border-emerald-500/30',
  'Waspada - Agak Panas':          'bg-amber-500/10 border-amber-500/30',
  'Berbahaya - Panas!':            'bg-orange-500/10 border-orange-500/30',
  'Ekstrem - Sangat Berbahaya!':   'bg-red-500/10 border-red-500/30',
};

export const COMFORT_DOT: Record<ComfortLevel, string> = {
  'Nyaman':                        'bg-emerald-400',
  'Waspada - Agak Panas':          'bg-amber-400',
  'Berbahaya - Panas!':            'bg-orange-500',
  'Ekstrem - Sangat Berbahaya!':   'bg-red-500',
};

export function getComfortLevel(heatIndex: number): ComfortLevel {
  if (heatIndex < 27)  return 'Nyaman';
  if (heatIndex < 32)  return 'Waspada - Agak Panas';
  if (heatIndex < 40)  return 'Berbahaya - Panas!';
  return 'Ekstrem - Sangat Berbahaya!';
}

export function getTempColor(temp: number): string {
  if (temp < 24) return 'text-blue-400';
  if (temp < 28) return 'text-emerald-400';
  if (temp < 32) return 'text-amber-400';
  return 'text-red-400';
}

export function formatTimestamp(unix: number): string {
  return new Date(unix * 1000).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function secondsAgo(unix: number): number {
  return Math.floor(Date.now() / 1000 - unix);
}
