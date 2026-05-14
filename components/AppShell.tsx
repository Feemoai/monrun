'use client';
import { useState, useEffect } from 'react';
import { EntryGate } from '@/components/EntryGate';

/**
 * Wrapper client component untuk EntryGate.
 * Disimpan terpisah agar layout.tsx bisa tetap server component.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Jika user sudah pernah masuk (session storage), skip entry gate
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('forsence_entered');
      if (seen) setEntered(true);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('forsence_entered', '1');
    setEntered(true);
  };

  if (!mounted) return null; // hindari hydration mismatch

  return (
    <>
      {!entered && <EntryGate onEnter={handleEnter} />}
      <div style={{ visibility: entered ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  );
}
