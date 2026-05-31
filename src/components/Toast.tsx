import React from 'react';
import { cn } from '../utils/helpers';

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div className={cn(
      "fixed top-6 right-6 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 pointer-events-none",
      "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)]",
      visible ? "translate-y-0 opacity-100" : "translate-y-[-20px] opacity-0"
    )}>
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
