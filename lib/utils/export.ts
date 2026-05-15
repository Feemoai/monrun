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

export async function downloadPDF(data: HistoryEntry[], filename = 'monitoring_data.pdf', deviceData?: any, selectedRoom?: string) {
  // Dynamic import agar tidak memberatkan bundle Next.js saat initial load
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // ── Header Background ──
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');
  
  // ── Title ──
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FORSENCE IOT REPORT', 14, 20);
  
  // ── Subtitle ──
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(6, 182, 212); // cyan-500
  doc.text('by Kelompok 5 TI-1B', 14, 27);
  
  // ── Meta Info ──
  doc.setTextColor(15, 23, 42); // reset ke gelap
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Waktu Cetak  :`, 14, 48);
  doc.text(`Total Data   :`, 14, 54);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${new Date().toLocaleString('id-ID')}`, 45, 48);
  doc.text(`${data.length} Baris Data`, 45, 54);

  // ── Room Descriptions ──
  let tableStartY = 64;
  if (deviceData && deviceData.rooms) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Profil Ruangan:', 14, 66);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let y = 73;
    ['A', 'B', 'C'].forEach(r => {
      if (selectedRoom === 'ALL' || selectedRoom === r) {
        const rData = deviceData.rooms[r];
        if (rData) {
          const label = rData.label || `Room ${r}`;
          const desc  = rData.desc  || '-';
          doc.text(`• Room ${r} (${label}) - ${desc}`, 14, y);
          y += 6;
        }
      }
    });
    tableStartY = y + 4;
  }
  
  const tableData = data.map(d => [
    new Date(d.timestamp * 1000).toLocaleString('id-ID'),
    `Room ${d.room}`,
    `${d.temp}°C`,
    `${d.humidity}%`,
    `${d.heatIndex}°C`,
    d.comfort
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [['Waktu (Timestamp)', 'Ruang', 'Suhu (°C)', 'Lembap (%)', 'Heat Index', 'Status (Kenyamanan)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(filename);
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
