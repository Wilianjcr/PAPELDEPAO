import React from 'react';
import { Lightbulb, CheckSquare, Pin, Archive, Trash2, Tag, Plus, History, Download, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/helpers';
import type { FilterType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLabelsModal: () => void;
  onOpenVersionModal: () => void;
  onImport: (file: File) => void;
}

const MENU_ITEMS: { filter: FilterType; label: string; icon: React.ReactNode }[] = [
  { filter: 'all', label: 'Notas', icon: <Lightbulb className="w-4 h-4" /> },
  { filter: 'todo', label: 'Tarefas', icon: <CheckSquare className="w-4 h-4" /> },
  { filter: 'pinned', label: 'Fixadas', icon: <Pin className="w-4 h-4" /> },
  { filter: 'archive', label: 'Arquivo', icon: <Archive className="w-4 h-4" /> },
  { filter: 'trash', label: 'Lixeira', icon: <Trash2 className="w-4 h-4" /> },
];

export default function Sidebar({ isOpen, onClose, onOpenLabelsModal, onOpenVersionModal, onImport }: SidebarProps) {
  const { notes, labels, activeFilter, setActiveFilter, exportNotes } = useApp();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    if (window.innerWidth < 768) onClose();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed top-[57px] left-0 h-[calc(100vh-57px)] w-72 z-50 flex flex-col",
        "bg-[var(--bg-surface)] border-r border-[var(--border)]",
        "transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
          {MENU_ITEMS.map(item => {
            const isActive = activeFilter === item.filter;
            return (
              <button
                key={item.filter}
                onClick={() => handleFilterClick(item.filter)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[var(--accent-muted)] text-[var(--accent)] font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="border-t border-[var(--border)] my-3 pt-3">
            <div className="px-4 flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              <span>Marcadores</span>
              <button onClick={onOpenLabelsModal} className="hover:text-[var(--accent)] transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-0.5">
              {labels.map(label => {
                const count = notes.filter(n => !n.isTrashed && !n.isArchived && n.labels.includes(label)).length;
                const isActive = activeFilter === label;
                return (
                  <button
                    key={label}
                    onClick={() => handleFilterClick(label)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-all",
                      isActive
                        ? "bg-[var(--accent-muted)] text-[var(--accent)] font-bold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4" />
                      <span className="truncate max-w-[140px]">{label}</span>
                    </div>
                    <span className="text-xs bg-[var(--bg-elevated)] px-2 py-0.5 rounded-full text-[var(--text-muted)]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[var(--border)] my-3 pt-3">
            <button onClick={() => { onOpenVersionModal(); if (window.innerWidth < 768) onClose(); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-all">
              <History className="w-4 h-4 text-[var(--accent)]" />
              <span>Histórico de Versões</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)]/50">
          <div className="flex items-center justify-between font-semibold mb-1 text-sm text-[var(--text-primary)]">
            <span>Papel de Pão</span>
            <span className="bg-[var(--accent-muted)] text-[var(--accent)] px-1.5 py-0.5 rounded text-[10px] font-bold">v4.0</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mb-3">Notas inteligentes com temas premium.</p>
          <div className="flex items-center justify-between">
            <button onClick={exportNotes} className="text-[var(--text-muted)] hover:text-[var(--accent)] font-medium hover:underline flex items-center gap-1 text-xs">
              <Download className="w-3 h-3" /> Exportar
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="text-[var(--text-muted)] hover:text-[var(--accent)] font-medium hover:underline flex items-center gap-1 text-xs">
              <Upload className="w-3 h-3" /> Importar
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>
      </aside>
    </>
  );
}
