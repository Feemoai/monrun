'use client';
import { Cloud, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import type { WeatherData } from '@/types';

interface Props { weather: WeatherData }

export function WeatherPanel({ weather }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Cuaca Luar</p>
        <Cloud className="w-4 h-4 text-white/20" />
      </div>

      {/* Main temp */}
      <div className="flex items-end gap-2 mb-4">
        <p className="text-4xl font-bold text-white">{weather.temp.toFixed(1)}</p>
        <p className="text-lg text-white/40 pb-0.5">°C</p>
        <p className="text-sm text-white/40 pb-0.5 ml-1 capitalize">{weather.description}</p>
      </div>

      <div className="gradient-line mb-4" />

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={<Gauge className="w-3.5 h-3.5" />}   label="Terasa"  value={`${weather.feelsLike.toFixed(1)}°C`} />
        <Stat icon={<Droplets className="w-3.5 h-3.5" />} label="Lembap"  value={`${weather.humidity}%`}              />
        <Stat icon={<Wind className="w-3.5 h-3.5" />}    label="Angin"   value={`${weather.windSpeed} m/s`}          />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/3 rounded-xl p-3 border border-white/5">
      <div className="flex items-center gap-1.5 mb-1.5 text-white/30">{icon}</div>
      <p className="text-[10px] text-white/30 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
