import type { HistoryEntry, RoomId } from '@/types';

export function toCSV(data: HistoryEntry[]): string {
  const header = 'Timestamp,Room,Temperature (°C),Humidity (%),Heat Index (°C),Comfort\n';
  const rows = data.map((d) => {
    const ts = new Date(d.timestamp * 1000).toLocaleString('id-ID');
    return `"${ts}",${d.room},${d.temp},${d.humidity},${d.heatIndex},"${d.comfort}"`;
  });
  return header + rows.join('\n');
}

export function downloadCSV(data: HistoryEntry[], filename = 'monitoring_data.csv') {
  const blob = new Blob([toCSV(data)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: HistoryEntry[], filename = 'monitoring_data.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function filterByDateRange(
  data: HistoryEntry[],
  from: Date | null,
  to: Date | null,
  room: RoomId | 'ALL'
): HistoryEntry[] {
  return data.filter((d) => {
    const ts = new Date(d.timestamp * 1000);
    if (room !== 'ALL' && d.room !== room) return false;
    if (from && ts < from) return false;
    if (to   && ts > to)   return false;
    return true;
  });
}
