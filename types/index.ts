// ================================================================
// TYPES — ESP32 Monitoring Dashboard
// ================================================================

export type RoomId = 'A' | 'B' | 'C';

/** Data sensor terkini untuk 1 ruangan (tanpa field room) */
export interface RoomLatest {
  temp:      number;
  humidity:  number;
  heatIndex: number;
  comfort:   ComfortLevel;
  timestamp: number;
}

export interface RoomMeta {
  label:       string;
  description: string;
  icon:        string;
  /**
   * Data sensor terakhir yang diukur untuk ruangan ini.
   * Disimpan di Firebase: devices/esp1/rooms/{id}/latest
   * Ini yang dipakai dashboard untuk tampilkan data per-room secara independen.
   */
  latest?: RoomLatest;
}

export interface HistoryEntry {
  room:      RoomId;
  temp:      number;
  humidity:  number;
  heatIndex: number;
  comfort:   ComfortLevel;
  timestamp: number;
}

export type ComfortLevel =
  | 'Nyaman'
  | 'Waspada - Agak Panas'
  | 'Berbahaya - Panas!'
  | 'Ekstrem - Sangat Berbahaya!';

export interface WeatherData {
  temp:        number;
  feelsLike:   number;
  humidity:    number;
  windSpeed:   number;
  description: string;
}

export interface DeviceData {
  lastSeen:   number;
  battery:    number;
  /**
   * Room ID yang sedang aktif diukur oleh ESP32 (A/B/C).
   * Dikirim via PATCH setiap 15 detik.
   */
  activeRoom: RoomId;
  rooms:      Record<RoomId, RoomMeta>;
  weather:    WeatherData;
}

export interface ChartDataPoint {
  time:      string;
  temp:      number;
  humidity:  number;
  heatIndex: number;
}
