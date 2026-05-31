import React from 'react';
import { Check } from 'lucide-react';
import { useTheme, type ThemeName } from '../../context/ThemeContext';
import Modal from './Modal';

interface ThemeModalProps { isOpen: boolean; onClose: () => void; }

const THEMES: { name: ThemeName; label: string; preview: string; gradient: string }[] = [
  { name: 'dark', label: 'Dark', preview: '#0b1121', gradient: 'from-slate-800 to-slate-900' },
  { name: 'light', label: 'Light', preview: '#f8fafc', gradient: 'from-white to-slate-100' },
  { name: 'solarized-dark', label: 'Solarized Dark', preview: '#002b36', gradient: 'from-teal-900 to-teal-950' },
  { name: 'solarized-light', label: 'Solarized Light', preview: '#fdf6e3', gradient: 'from-amber-50 to-orange-50' },
  { name: 'rose', label: 'Rose', preview: '#fff1f2', gradient: 'from-rose-100 to-pink-100' },
  { name: 'violet', label: 'Violet', preview: '#0f0a1e', gradient: 'from-purple-900 to-violet-950' },
  { name: 'amber', label: 'Amber', preview: '#0f1210', gradient: 'from-amber-900 to-yellow-950' },
  { name: 'glass', label: 'Glass', preview: '#030712', gradient: 'from-gray-900 to-black' },
];

export default function ThemeModal({ isOpen, onClose }: ThemeModalProps) {
  const { theme, setTheme } = useTheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6 text-center border-b border-[var(--border)]">
        <h3 className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">Selecionar Tema</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">Escolha a aparência do seu Papel de Pão</p>
      </div>
      <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3 scrollbar-thin">
        {THEMES.map(t => (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`group flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
              theme === t.name ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : 'border-[var(--border)] hover:border-[var(--accent)]/50'
            }`}
          >
            <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${t.gradient} p-2 flex flex-col gap-1.5 relative overflow-hidden`}>
              <div className="h-1.5 w-1/3 bg-[var(--accent)] rounded-full" />
              <div className="h-1 w-5/6 bg-white/20 rounded-full" />
              <div className="h-1 w-4/6 bg-white/20 rounded-full" />
              {theme === t.name && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)] mt-2">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-[var(--border)] flex justify-center">
        <button onClick={onClose} className="px-8 py-2.5 w-full bg-[var(--bg-elevated)] hover:bg-[var(--accent-muted)] text-[var(--text-secondary)] font-bold text-xs rounded-xl border border-[var(--border)] transition-all">
          Fechar
        </button>
      </div>
    </Modal>
  );
}