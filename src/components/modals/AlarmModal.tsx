import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import Modal from './Modal';
import type { Note } from '../../types';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export default function AlarmModal({ isOpen, onClose, note }: AlarmModalProps) {
  useEffect(() => {
    if (isOpen) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playBeep = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        };
        playBeep();
        const interval = setInterval(playBeep, 1200);
        return () => { clearInterval(interval); ctx.close(); };
      } catch {}
    }
  }, [isOpen]);

  if (!note) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center animate-pulse">
          <Bell className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-black text-xl text-red-500">LEMBRETE ATIVO!</h3>
          <p className="text-sm font-bold text-[var(--text-primary)] mt-2">{note.title || 'Lembrete'}</p>
          <div className="bg-[var(--bg-elevated)] p-3 rounded-xl text-xs text-[var(--text-secondary)] mt-2 max-h-32 overflow-y-auto scrollbar-thin whitespace-pre-wrap">
            {note.type === 'todo'
              ? note.todoItems.filter(i => !i.completed).map(i => `• ${i.text}`).join('\n') || 'Sem tarefas pendentes'
              : note.content || 'Lembrete programado.'}
          </div>
        </div>
        <button onClick={onClose} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors">
          Parar Alarme
        </button>
      </div>
    </Modal>
  );
}