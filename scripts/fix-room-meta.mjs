/**
 * fix-room-meta.mjs
 * Restore label, description, icon ke setiap ruangan
 * TANPA menyentuh data sensor (latest/history) yang sudah ada.
 *
 * Pakai: node scripts/fix-room-meta.mjs
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';

const firebaseConfig = {
  apiKey:            "AIzaSyCmuvYAk9l7uRtX7P5lXvszzXk7a2gFTUs",
  authDomain:        "monrun-c8243.firebaseapp.com",
  databaseURL:       "https://monrun-c8243-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "monrun-c8243",
  storageBucket:     "monrun-c8243.firebasestorage.app",
  messagingSenderId: "820312856570",
  appId:             "1:820312856570:web:36593e2e709c7c1bb23643",
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ── Isi deskripsi ruangan di sini ────────────────────────────────
const ROOM_META = {
  A: { label: 'Ruangan A', description: 'Ruang Kelas TI-1', icon: 'school' },
  B: { label: 'Ruangan B', description: 'Ruang Server',     icon: 'cpu'    },
  C: { label: 'Ruangan C', description: 'Laboratorium',     icon: 'flask'  },
};

async function fixMeta() {
  console.log('🔧 Memperbaiki metadata ruangan...');

  for (const [id, meta] of Object.entries(ROOM_META)) {
    // update() = partial merge, tidak menghapus field lain (latest, dll)
    await update(ref(db, `devices/esp1/rooms/${id}`), meta);
    console.log(`   ✅ Ruangan ${id}: "${meta.description}"`);
  }

  console.log('\n✅ Selesai! Label & deskripsi sudah diperbarui.');
  console.log('   Data sensor (latest/history) tidak terpengaruh.');
  process.exit(0);
}

fixMeta().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
