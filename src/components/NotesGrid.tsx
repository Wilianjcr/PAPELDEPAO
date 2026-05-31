import React from 'react';
import { Pin, ListTodo } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NoteCard from './NoteCard';

interface NotesGridProps {
  onOpenNote: (note: import('../types').Note) => void;
}

export default function NotesGrid({ onOpenNote }: NotesGridProps) {
  const { filteredNotes, viewLayout, activeFilter } = useApp();

  const pinned = filteredNotes.filter(n => n.isPinned);
  const others = filteredNotes.filter(n => !n.isPinned);

  const showPinned = pinned.length > 0 && !['pinned', 'trash', 'archive'].includes(activeFilter);

  const gridClass = viewLayout === 'grid'
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    : "flex flex-col gap-4 max-w-3xl mx-auto";

  return (
    <div className="space-y-6">
      {showPinned && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[var(--text-muted)] flex items-center gap-2">
            <Pin className="w-3.5 h-3.5" />
            Fixadas
          </h2>
          <div className={gridClass}>
            {pinned.map(n => <NoteCard key={n.id} note={n} onOpen={onOpenNote} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[var(--text-muted)]">
          {activeFilter === 'archive' ? 'Arquivadas' : activeFilter === 'trash' ? 'Lixeira' : activeFilter === 'todo' ? 'Listas de Tarefas' : activeFilter === 'pinned' ? 'Todas Fixadas' : 'Notas'}
        </h2>
        {(showPinned ? others : filteredNotes).length > 0 ? (
          <div className={gridClass}>
            {(showPinned ? others : filteredNotes).map(n => <NoteCard key={n.id} note={n} onOpen={onOpenNote} />)}
          </div>
        ) : filteredNotes.length === 0 && (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  const { activeFilter } = useApp();
  const configs: Record<string, { title: string; desc: string; icon: React.ReactNode }> = {
    archive: { title: 'Sem notas arquivadas', desc: 'Arquive notas para organizar o painel.', icon: <ListTodo className="w-10 h-10" /> },
    trash: { title: 'Lixeira vazia', desc: 'Nenhum rascunho amassado por aqui.', icon: <ListTodo className="w-10 h-10" /> },
    todo: { title: 'Nenhuma lista', desc: 'Crie uma checklist pelo menu "+"!', icon: <ListTodo className="w-10 h-10" /> },
    pinned: { title: 'Nenhuma nota fixada', desc: 'Fixe notas importantes para acesso rápido.', icon: <ListTodo className="w-10 h-10" /> },
  };
  const cfg = configs[activeFilter] || { title: 'Suas anotações começam aqui!', desc: 'Use o "+" para criar notas, códigos, áudios ou desenhos.', icon: <ListTodo className="w-10 h-10" /> };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-20 h-20 bg-[var(--accent-muted)] text-[var(--accent)] rounded-3xl flex items-center justify-center mb-4">
        {cfg.icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--text-primary)]">{cfg.title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mt-1">{cfg.desc}</p>
    </div>
  );
}
