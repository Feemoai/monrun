// ================================================================
// lib/constants.ts — Single source of truth untuk semua konstanta
// ================================================================

/** ID perangkat ESP32 di Firebase (dari .env.local) */
export const DEVICE_ID = process.env.NEXT_PUBLIC_DEVICE_ID ?? 'esp1';

/** Path Firebase root untuk device ini */
export const DEVICE_PATH = `devices/${DEVICE_ID}` as const;

/** Batas karakter untuk input yang ditulis ke Firebase */
export const INPUT_LIMITS = {
  DESCRIPTION: 100,
  LABEL:       50,
} as const;

/** Room IDs — JANGAN diubah, harus cocok dengan ESP32 */
export const ROOM_IDS = ['A', 'B', 'C'] as const;

/** Ikon yang diizinkan untuk room */
export const ALLOWED_ICONS = ['school', 'cpu', 'flask'] as const;

/**
 * Threshold untuk status online/offline (detik).
 * ESP32 mengirim heartbeat setiap 10 detik.
 * Set ke 25 detik: toleransi 2x heartbeat + buffer jaringan.
 */
export const ONLINE_THRESHOLD_SECONDS = 25;
