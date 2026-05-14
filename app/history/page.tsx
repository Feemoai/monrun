'use client';
import { useHistory } from '@/lib/hooks/useHistory';
import { DataTable }  from '@/components/history/DataTable';

export default function HistoryPage() {
  const { history, loading } = useHistory(500);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">History</h1>
        <p className="text-sm text-white/40 mt-0.5">Riwayat data sensor semua ruangan</p>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white/5 rounded-xl h-96" />
      ) : (
        <DataTable history={history} />
      )}
    </div>
  );
}
