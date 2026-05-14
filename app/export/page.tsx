'use client';
import { useHistory }  from '@/lib/hooks/useHistory';
import { ExportPanel } from '@/components/export/ExportPanel';

export default function ExportPage() {
  const { history, loading } = useHistory(1000);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Export Data</h1>
        <p className="text-sm text-white/40 mt-0.5">Download data sensor dalam format CSV atau JSON</p>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white/5 rounded-xl h-64 max-w-xl mx-auto" />
      ) : (
        <ExportPanel history={history} />
      )}
    </div>
  );
}
