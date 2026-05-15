'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Wifi } from 'lucide-react';

interface Props { onEnter: () => void }

const LETTERS = 'FORSENCE'.split('');

// Baris status boot yang muncul satu per satu
const BOOT_LINES = [
  'SYS :: Initializing FORSENCE v2.0...',
  'NET :: Connecting to Firebase RTDB...',
  'IOT :: ESP32 sensor handshake OK',
  'ENV :: Loading room configuration [A·B·C]',
  'READY',
];

export function EntryGate({ onEnter }: Props) {
  const [lineIdx,   setLineIdx]   = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showBtn,   setShowBtn]   = useState(false);
  const [exiting,   setExiting]   = useState(false);

  // Munculkan boot lines satu per satu
  useEffect(() => {
    if (lineIdx < BOOT_LINES.length - 1) {
      const t = setTimeout(() => setLineIdx((i) => i + 1), 380);
      return () => clearTimeout(t);
    } else {
      // Setelah semua lines, tampilkan title
      const t = setTimeout(() => setShowTitle(true), 300);
      return () => clearTimeout(t);
    }
  }, [lineIdx]);

  useEffect(() => {
    if (showTitle) {
      const t = setTimeout(() => setShowBtn(true), 1800);
      return () => clearTimeout(t);
    }
  }, [showTitle]);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 900);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#020810' }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ── Background glow ─────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)' }} />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
          </div>

          {/* ── Grid overlay ─────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* ── Boot console (atas) ───────────────────────── */}
          <motion.div
            className="absolute top-8 md:top-12 left-6 md:left-12 font-mono text-[10px] md:text-xs space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {BOOT_LINES.slice(0, lineIdx + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-2 ${
                  line === 'READY'
                    ? 'text-emerald-400 font-bold'
                    : i === lineIdx
                    ? 'text-cyan-400/80'
                    : 'text-white/20'
                }`}
              >
                {line === 'READY' ? (
                  <Activity className="w-3 h-3" />
                ) : (
                  <span className="text-white/10">›</span>
                )}
                {line}
                {i === lineIdx && line !== 'READY' && (
                  <motion.span
                    className="w-1.5 h-3 bg-cyan-400 inline-block"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* ── Corner indicators ────────────────────────── */}
          {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-5 h-5 opacity-20`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className={`w-full h-px bg-cyan-400 ${i < 2 ? '' : 'mt-auto'}`} />
              <div className={`w-px h-full bg-cyan-400 ${i % 2 === 0 ? '' : 'ml-auto'}`} style={{ marginTop: i < 2 ? '-1px' : undefined }} />
            </motion.div>
          ))}

          {/* ── Center content ─────────────────────────────── */}
          <div className="relative flex flex-col items-center text-center px-6">

            {/* Icon */}
            <AnimatePresence>
              {showTitle && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="mb-8 w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center"
                >
                  <Cpu className="w-8 h-8 text-cyan-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* FORSENCE — letter reveal */}
            <AnimatePresence>
              {showTitle && (
                <div className="flex items-center gap-0 mb-3">
                  {LETTERS.map((char, i) => (
                    <motion.span
                      key={i}
                      className="text-5xl md:text-7xl font-bold text-white tracking-tight"
                      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        delay: i * 0.07,
                        duration: 0.7,
                        ease: [0.33, 1, 0.68, 1],
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence>
              {showTitle && (
                <motion.p
                  className="text-xs md:text-sm font-mono text-cyan-400/60 tracking-[0.3em] uppercase mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  IoT Environmental Monitoring
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showTitle && (
                <motion.p
                  className="text-[11px] text-white/20 font-mono tracking-widest mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  ESP32 · Firebase 
                </motion.p>
              )}
            </AnimatePresence>

            {/* Enter button */}
            <AnimatePresence>
              {showBtn && (
                <motion.button
                  onClick={handleEnter}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-10 py-3.5 border border-cyan-500/30 rounded-lg font-mono text-sm tracking-[0.25em] text-cyan-400/80 uppercase overflow-hidden transition-all duration-400 hover:border-cyan-500/60 hover:text-cyan-300"
                >
                  <span className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-all duration-400" />
                  {/* Pulse ring */}
                  <motion.span
                    className="absolute inset-0 border border-cyan-500/15 rounded-lg"
                    animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5" />
                    [ Masuk ke Dashboard ]
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer ─────────────────────────────────────── */}
          <motion.div
            className="absolute bottom-6 flex items-center gap-4 text-[10px] font-mono text-white/15 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <span>FORSENCE by Kelompok 5 TI-1B</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span>v2.0</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span>{new Date().getFullYear()}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
