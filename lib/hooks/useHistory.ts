'use client';
import { useEffect, useRef, useState } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { db }          from '@/lib/firebase';
import { DEVICE_PATH } from '@/lib/constants';
import type { HistoryEntry, RoomId } from '@/types';

const ROOM_IDS = ['A', 'B', 'C'] as const;

/**
 * History tersimpan per ruangan di Firebase:
 *   devices/esp1/history/A → {"-Nxyz": {...}}
 *   devices/esp1/history/B → {"-Nabc": {...}}
 *   devices/esp1/history/C → {"-Ndef": {...}}
 *
 * Ini memastikan Room A & C tidak kehilangan data saat ESP32 aktif di Room B.
 */
export function useHistory(limitPerRoom = 60) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Cache per room — persist across re-renders tanpa trigger re-subscribe
  const cache       = useRef<Record<string, HistoryEntry[]>>({ A: [], B: [], C: [] });
  const loadedCount = useRef(0);

  useEffect(() => {
    loadedCount.current = 0;
    cache.current = { A: [], B: [], C: [] };

    const merge = () => {
      const all = ([] as HistoryEntry[])
        .concat(...ROOM_IDS.map((r) => cache.current[r] ?? []))
        .sort((a, b) => b.timestamp - a.timestamp);
      setHistory(all);
    };

    const unsubs = ROOM_IDS.map((room) =>
      onValue(
        query(
          ref(db, `${DEVICE_PATH}/history/${room}`),
          orderByChild('timestamp'),
          limitToLast(limitPerRoom)
        ),
        (snap) => {
          const entries: HistoryEntry[] = [];
          snap.forEach((child) => {
            const v = child.val();
            if (v) entries.push({ ...v, room: room as RoomId });
          });
          cache.current[room] = entries;
          loadedCount.current = Math.min(loadedCount.current + 1, ROOM_IDS.length);
          if (loadedCount.current >= ROOM_IDS.length) setLoading(false);
          merge();
        }
      )
    );

    return () => {
      unsubs.forEach((u) => u());
      loadedCount.current = 0;
    };
  }, [limitPerRoom]);

  const filterByRoom = (room: RoomId | 'ALL') =>
    room === 'ALL' ? history : history.filter((h) => h.room === room);

  return { history, loading, filterByRoom };
}
