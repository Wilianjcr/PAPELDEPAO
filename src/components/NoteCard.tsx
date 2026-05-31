import React from 'react';
import { Pin, Play, Copy, Archive, Trash2, Undo2, Lock, StickyNote, Mic } from 'lucide-react';
import type { Note } from '../types';
import { useApp } from '../context/AppContext';
import { escapeHTML, truncateText, isPastDue, formatDateShort, cn } from '../utils/helpers';
import { useToast } from '../hooks/useToast';

interface NoteCardProps {
  note: Note;
  onOpen: (note: Note) => void;
}

export default function NoteCard({ note, onOpen }: NoteCardProps) {
  const { togglePin, toggleArchive, deleteNote, permanentlyDeleteNote, restoreFromTrash, toggleTodoItem } = useApp();
  const { showToast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = note.type === 'todo'
      ? note.todoItems.map(i => `[${i.completed ? 'x' : ' '}] ${i.text}`).join('\n')
      : note.content;
    navigator.clipboard.writeText(text).then(() => showToast('Copiado!'));
  };

  const colorClass = `note-color-${note.color || 'default'}`;

  if (note.passwordHash && note.isTrashed === false) {
    return (
      <div
        onClick={() => onOpen(note)}
        className={cn(
          "group relative rounded-2xl border border-[var(--border)] p-6 flex flex-col items-center justify-center min-h-[180px] cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[var(--accent)]/30",
          colorClass
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-bold text-sm text-[var(--text-primary)]">Nota Protegida</h4>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">Toque para inserir senha</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpen(note)}
      className={cn(
        "group relative rounded-2xl border border-[var(--border)] p-4 flex flex-col justify-between cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:border-[var(--accent)]/20 hover:-translate-y-0.5",
        "min-h-[180px] max-h-[420px] overflow-hidden",
        colorClass
      )}
    >
      <div>
        {note.imageData && (
          <div className="w-full h-28 mb-3 rounded-xl overflow-hidden border border-[var(--border)]">
            <img src={note.imageData} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {note.isMonospace ? (
              <span className="font-bold font-code text-[var(--accent)] text-xs bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded-lg border border-[var(--border)]">
                {'>_'}
              </span>
            ) : (
              <StickyNote className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            )}
            <h3 className="font-semibold text-sm leading-tight truncate text-[var(--text-primary)]">
              {escapeHTML(note.title || 'Sem Título')}
            </h3>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
            className={cn(
              "p-1 rounded-full transition-all shrink-0",
              note.isPinned
                ? "text-amber-400 fill-amber-400 opacity-100"
                : "text-[var(--text-muted)] opacity-0 group-hover:opacity-100 hover:text-amber-400"
            )}
          >
            <Pin className="w-4 h-4" />
          </button>
        </div>

        {note.type === 'todo' ? (
          <div className="mt-3 space-y-1.5">
            {(() => {
              const checked = note.todoItems.filter(i => i.completed).length;
              const total = note.todoItems.length;
              const pct = total > 0 ? (checked / total) * 100 : 0;
              return (
                <>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)]">
                    <span>Progresso</span>
                    <span>{checked}/{total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  {note.todoItems.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleTodoItem(note.id, item.id)}
                        className="accent-sky-500 w-3.5 h-3.5 rounded cursor-pointer"
                      />
                      <span className={cn("truncate", item.completed && "line-through text-[var(--text-muted)]")}>
                        {escapeHTML(item.text)}
                      </span>
                    </div>
                  ))}
                  {note.todoItems.length > 4 && (
                    <span className="text-[10px] text-[var(--text-muted)]">+{note.todoItems.length - 4} mais</span>
                  )}
                  {total === 0 && (
                    <span className="text-xs text-[var(--text-muted)] italic">Lista vazia</span>
                  )}
                </>
              );
            })()}
          </div>
        ) : note.isMonospace ? (
          <pre className="font-code text-xs whitespace-pre-wrap break-all mt-3 text-[var(--text-secondary)] opacity-90 overflow-hidden max-h-[120px]">
            {escapeHTML(truncateText(note.content || '', 300))}
          </pre>
        ) : (
          <p className="text-sm mt-3 text-[var(--text-secondary)] whitespace-pre-wrap break-words leading-relaxed overflow-hidden max-h-[120px]">
            {escapeHTML(truncateText(note.content || '', 300))}
          </p>
        )}

        {note.audioData && (
          <div className="mt-2 flex items-center gap-2 text-[var(--accent)] text-xs font-semibold bg-[var(--accent-muted)] px-2.5 py-1.5 rounded-lg" onClick={e => e.stopPropagation()}>
            <Mic className="w-3.5 h-3.5" />
            <audio src={note.audioData} controls className="max-w-[180px] h-5" />
          </div>
        )}

        {note.dueDate && note.dueTime && (
          <div className={cn(
            "mt-2.5 inline-flex items-center gap-1 text-[10px] font-semibold border px-2.5 py-1 rounded-full",
            isPastDue(note.dueDate, note.dueTime)
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          )}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {formatDateShort(note.dueDate)} {note.dueTime}
          </div>
        )}

        {note.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {note.labels.map(l => (
              <span key={l} className="px-2 py-0.5 bg-[var(--bg-elevated)] rounded-full text-[10px] font-medium text-[var(--text-secondary)]">
                {escapeHTML(l)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-0.5">
          {note.isMonospace && !note.isTrashed && (
            <button onClick={(e) => { e.stopPropagation(); onOpen(note); }} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-emerald-500" title="Executar">
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-emerald-500" title="Copiar">
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          {note.isTrashed ? (
            <>
              <button onClick={(e) => { e.stopPropagation(); restoreFromTrash(note.id); showToast('Nota restaurada!'); }} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 text-xs font-semibold" title="Restaurar">
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); permanentlyDeleteNote(note.id); showToast('Excluída!'); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500" title="Excluir">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={(e) => { e.stopPropagation(); toggleArchive(note.id); showToast(note.isArchived ? 'Desarquivada' : 'Arquivada'); }} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]" title={note.isArchived ? 'Desarquivar' : 'Arquivar'}>
                <Archive className="w-3.5 h-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); showToast('Lixeira'); }} className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-500" title="Excluir">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
