import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  showClose?: boolean;
}

export default function Modal({ isOpen, onClose, children, maxWidth = 'max-w-lg', showClose = true }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full bg-[var(--bg-surface)] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-[var(--border)] overflow-hidden animate-scale-in", maxWidth)}>
        {showClose && (
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-xl hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]">
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}