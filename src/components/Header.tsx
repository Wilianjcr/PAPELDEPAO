import React, { useState, useEffect } from 'react';
import { Menu, Search, X, Cloud, CloudOff, Settings, LayoutGrid, Palette, Layers, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';
import { cn } from '../utils/helpers';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenThemeModal: () => void;
  onOpenDriveModal: () => void;
  driveStatus: string;
}

export default function Header({ onToggleSidebar, onOpenThemeModal, onOpenDriveModal, driveStatus }: HeaderProps) {
  const { searchQuery, setSearchQuery, viewLayout, setViewLayout, activeNotesCount } = useApp();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const driveStatusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    disconnected: { icon: <CloudOff className="w-4 h-4" />, color: 'text-[var(--text-muted)]', label: 'Drive' },
    connecting: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-amber-400', label: 'Conectando...' },
    connected: { icon: <Cloud className="w-4 h-4" />, color: 'text-emerald-400', label: 'Sincronizado' },
    syncing: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-amber-400', label: 'Sincronizando...' },
    error: { icon: <CloudOff className="w-4 h-4" />, color: 'text-red-400', label: 'Erro' },
  };

  const ds = driveStatusConfig[driveStatus] || driveStatusConfig.disconnected;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-[var(--accent-muted)] transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center">
            <img src="/icon.png" alt="Papel de Pão" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-extrabold text-base tracking-tight hidden sm:inline bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            Papel de Pão
          </span>
        </div>

        <div className="flex-1 max-w-lg mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Pesquisar notas..."
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] focus:border-[var(--accent)] outline-none transition-all text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-elevated)] text-xs font-semibold text-[var(--text-secondary)]">
            <Layers className="w-3 h-3" />
            {activeNotesCount}
          </span>

          <button
            onClick={onOpenDriveModal}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all",
              driveStatus === 'connected' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
              driveStatus === 'syncing' && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
              driveStatus === 'error' && "bg-red-500/10 text-red-400 border border-red-500/20",
              !['connected','syncing','error'].includes(driveStatus) && "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]"
            )}
          >
            {ds.icon}
            <span className="hidden md:inline">{ds.label}</span>
          </button>

          <button onClick={onOpenDriveModal} className="p-2 rounded-xl hover:bg-[var(--accent-muted)] transition-colors text-[var(--text-muted)] hover:text-[var(--accent)]" aria-label="Configurações Google Drive">
            <Settings className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-[var(--border)] mx-1 hidden sm:block" />

          <button
            onClick={() => setViewLayout(viewLayout === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-xl hover:bg-[var(--accent-muted)] transition-colors text-[var(--text-muted)]"
            aria-label="Alternar visualização"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          <button onClick={onOpenThemeModal} className="p-2 rounded-xl hover:bg-[var(--accent-muted)] transition-colors text-[var(--accent)]" aria-label="Temas">
            <Palette className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
