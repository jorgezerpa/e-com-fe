'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: "error"|"success"
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-500' 
              : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-xs font-black uppercase tracking-widest">{message}</span>
            </div>
          </div>
        </div>
  );
}