'use client';
import { Sparkles } from 'lucide-react';
import type { DeviceData } from '@/types';

interface Props { data: DeviceData | null }

export function Chatbot({ data: _ }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-purple-400" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-2">Monrun.ai</h2>
        <p className="text-sm text-white/40 max-w-xs">
          AI assistant akan segera hadir. <br />
          Integrasi OpenRouter sedang disiapkan.
        </p>
      </div>
      <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
        Coming Soon
      </div>
    </div>
  );
}
