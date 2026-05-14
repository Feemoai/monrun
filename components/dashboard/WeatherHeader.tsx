'use client';
import { useState, useEffect } from 'react';
import { MapPin, Droplets, Wind, Gauge } from 'lucide-react';
import type { WeatherData } from '@/types';

const DAYS    = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS  = ['Januari','Februari','Maret','April','Mei','Juni',
                  'Juli','Agustus','September','Oktober','November','Desember'];

function getGreeting(h: number) {
  if (h >= 5  && h < 11) return { text: 'Selamat Pagi',  emoji: '🌅' };
  if (h >= 11 && h < 15) return { text: 'Selamat Siang', emoji: '☀️'  };
  if (h >= 15 && h < 18) return { text: 'Selamat Sore',  emoji: '🌤️' };
  return                         { text: 'Selamat Malam', emoji: '🌙' };
}

interface Props { weather: WeatherData | null }

export function WeatherHeader({ weather }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const { text: greetText, emoji } = getGreeting(h);
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const clockStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/7"
      style={{ background: 'linear-gradient(135deg, #0d1526 0%, #0a1020 60%, #0d1a30 100%)' }}
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-cyan-500/6 blur-3xl" />
        <div className="absolute -bottom-8 left-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl" />
      </div>

      <div className="relative z-10 px-8 py-6 flex items-center gap-0">

        {/* ── LEFT: Weather ─────────────────────────────── */}
        <div className="flex items-center gap-10 flex-1">
          {/* Location + temp */}
          <div className="shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 tracking-wide">Semarang</span>
            </div>
            <p className="text-xs text-white/30 mb-4">{dateStr}</p>
            {weather ? (
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold text-white leading-none">
                  {Math.round(weather.temp)}
                </span>
                <div className="pb-1.5">
                  <span className="text-2xl text-white/30 font-light">°C</span>
                  <p className="text-sm text-white/45 mt-1 capitalize">{weather.description}</p>
                </div>
              </div>
            ) : (
              <div className="h-16 flex items-center">
                <span className="text-white/20 text-sm">Memuat cuaca…</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-20 w-px bg-white/6 shrink-0" />

          {/* Stats */}
          {weather && (
            <div className="flex gap-8">
              <Stat label="Terasa"  value={`${weather.feelsLike.toFixed(1)}°C`} color="text-white" />
              <Stat label="Lembap"  value={`${weather.humidity}%`}              color="text-blue-400" />
              <Stat label="Angin"   value={`${weather.windSpeed} m/s`}          color="text-white" />
            </div>
          )}
        </div>

        {/* ── RIGHT: Greeting + Clock ───────────────────── */}
        <div className="text-right shrink-0 pl-10 border-l border-white/6 ml-10">
          <p className="text-base text-white/40 font-light mb-1">
            {emoji}&nbsp;{greetText}
          </p>
          <p className="text-5xl font-bold text-white font-mono tracking-tight tabular-nums">
            {clockStr}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
