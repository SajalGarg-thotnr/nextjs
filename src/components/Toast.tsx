"use client";
import React, { useEffect, useState } from 'react';

export default function Toast() {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  useEffect(() => {
    const handler = (e: any) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 5000);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);
  if (!toast) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-3 py-3 text-[13px] rounded shadow-lg text-white transition ${toast.type === 'error' ? 'bg-[red]' : 'bg-[green]'}`}>
      {toast.message}
    </div>
  );
} 