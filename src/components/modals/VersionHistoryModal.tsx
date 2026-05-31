import React from 'react';
import { History } from 'lucide-react';
import Modal from './Modal';

interface VersionHistoryModalProps { isOpen: boolean; onClose: () => void; }

const versions = [
  { version: 'v4.0.0 (Atual)', title: 'Migração React + TypeScript', items: ['Reescrita completa em React, TypeScript, Vite e Tailwind CSS', 'Sistema de temas modernizado com 8 opções', 'Senhas protegidas com SHA-256', 'Busca com debounce, animações suaves', 'Interface responsiva e acessível'] },
  { version: 'v3.5.0', title: 'Splash Screen com Soco & Google Drive', items: ['Animação cinematográfica de splash', 'Google Drive com guia passo-a-passo', 'Reconexão inteligente de sessão'] },
  { version: 'v3.4.0', title: 'Splash Screen & Sidebar', items: ['Animação de splash, sidebar drawer, novo logo'] },
  { version: 'v3.3.0', title: 'Correção de Bugs Críticos', items: ['Contador de palavras, cores, lixeira, importação JSON'] },
];

export default function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-2 text-[var(--accent)]">
        <History className="w-5 h-5" />
        <h3 className="font-bold text-base text-[var(--text-primary)]">Histórico de Versões</h3>
      </div>
      <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin text-sm">
        {versions.map((v, i) => (
          <div key={v.version} className="relative pl-6 border-l-2 border-[var(--border)] last:border-[var(--accent)]">
            <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${i === 0 ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
            <span className={`text-xs font-black uppercase tracking-widest block ${i === 0 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{v.version}</span>
            <h4 className="font-bold mt-1 text-[var(--text-primary)]">{v.title}</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-[var(--text-secondary)]">
              {v.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[var(--border)] flex justify-end">
        <button onClick={onClose} className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20">Fechar</button>
      </div>
    </Modal>
  );
}