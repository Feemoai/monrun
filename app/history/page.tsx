'use client';
import { useState }   from 'react';
import { useHistory } from '@/lib/hooks/useHistory';
import { DataTable }  from '@/components/history/DataTable';
import { clearAllHistory } from '@/lib/firebase-actions';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
  const { history, loading } = useHistory(500);
  const [clearing, setClearing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClear = async () => {
    // Password statis untuk melindungi penghapusan (bisa diganti jika perlu)
    const ADMIN_PASSWORD = 'FORSENCE';
    
    if (confirmText !== ADMIN_PASSWORD) {
      setErrorMsg('Password salah! Penghapusan dibatalkan.');
      return;
    }
    
    setErrorMsg('');
    setClearing(true);
    try {
      await clearAllHistory();
      setShowModal(false);
      setConfirmText('');
      // Kita pakai toast custom kalau ada, tapi sementara alert biasa cukup,
      // atau biarkan saja karena modal tertutup otomatis.
      // alert('Data history berhasil dihapus (disisakan 2 data terakhir per ruangan)!');
    } catch (err: any) {
      setErrorMsg('Gagal menghapus: ' + err.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">History</h1>
          <p className="text-sm text-white/40 mt-0.5">Riwayat data sensor semua ruangan</p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={() => {
              setShowModal(true);
              setConfirmText('');
              setErrorMsg('');
            }}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 
              text-red-400 border border-red-500/20 rounded-xl transition-all disabled:opacity-50 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Bersihkan Data History
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse bg-white/5 rounded-xl h-96" />
      ) : (
        <DataTable history={history} />
      )}

      {/* Modal Konfirmasi Interaktif */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !clearing && setShowModal(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
            >
              <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {/* Aksen merah di atas */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/50" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 text-red-400">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Hapus Data History</h2>
                  </div>
                  <button 
                    onClick={() => !clearing && setShowModal(false)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-sm text-white/60 leading-relaxed">
                    Tindakan ini akan menghapus semua riwayat data sensor secara permanen, namun akan <strong className="text-white/90">menyisakan 2 data terakhir</strong> untuk setiap ruangan.
                  </p>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <label className="block text-xs font-medium text-white/50 mb-2">
                      Masukkan Password Admin untuk mengonfirmasi:
                    </label>
                    <input
                      type="password"
                      autoFocus
                      value={confirmText}
                      onChange={(e) => {
                        setConfirmText(e.target.value);
                        setErrorMsg('');
                      }}
                      disabled={clearing}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-red-500/50 transition-colors placeholder:text-white/20 font-mono tracking-widest"
                      placeholder="••••••••"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleClear();
                      }}
                    />
                    {errorMsg && (
                      <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> {errorMsg}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={clearing}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={clearing || !confirmText}
                    className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {clearing ? (
                      <>
                        <span className="animate-spin text-lg leading-none">↻</span>
                        Memproses...
                      </>
                    ) : (
                      <>Hapus Data Secara Permanen</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
