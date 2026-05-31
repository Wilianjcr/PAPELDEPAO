import React, { useState } from 'react';
import { Code, CheckSquare, Palette, Tag, Calendar, Lock, Plus, X, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId, cn } from '../utils/helpers';
import type { NoteColor, TodoItem } from '../types';

const COLORS: { name: NoteColor; class: string }[] = [
  { name: 'default', class: 'bg-white dark:bg-slate-700 border border-slate-300' },
  { name: 'red', class: 'bg-red-300' },
  { name: 'orange', class: 'bg-orange-300' },
  { name: 'yellow', class: 'bg-yellow-300' },
  { name: 'green', class: 'bg-green-300' },
  { name: 'teal', class: 'bg-teal-300' },
  { name: 'blue', class: 'bg-blue-300' },
  { name: 'darkblue', class: 'bg-blue-500' },
  { name: 'purple', class: 'bg-purple-300' },
  { name: 'pink', class: 'bg-pink-300' },
  { name: 'brown', class: 'bg-amber-700' },
  { name: 'gray', class: 'bg-slate-300' },
];

interface CreateNoteProps {
  onOpenDrawing: () => void;
  onOpenAudio: () => void;
}

export default function CreateNote({ onOpenDrawing, onOpenAudio }: CreateNoteProps) {
  const { addNote, labels } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isTodo, setIsTodo] = useState(false);
  const [isMono, setIsMono] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState<NoteColor>('default');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [todoInput, setTodoInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [showReminder, setShowReminder] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<string | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const reset = () => {
    setTitle(''); setContent(''); setIsTodo(false); setIsMono(false);
    setIsPinned(false); setColor('default'); setSelectedLabels([]);
    setTodoItems([]); setDueDate(''); setDueTime('');
    setShowReminder(false); setPassword(''); setShowPassword(false);
    setAttachedImage(null); setAttachedAudio(null);
    setIsExpanded(false);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim() && todoItems.length === 0 && !attachedImage && !attachedAudio) {
      reset();
      return;
    }
    await addNote({
      title: title.trim() || 'Sem Título',
      content: isTodo ? '' : content.trim(),
      type: isTodo ? 'todo' : 'text',
      todoItems,
      color,
      isPinned,
      isMonospace: isMono,
      labels: selectedLabels,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      password: password.trim() || null,
      imageData: attachedImage,
      audioData: attachedAudio,
    });
    reset();
  };

  const addTodoItem = () => {
    if (!todoInput.trim()) return;
    setTodoItems(prev => [...prev, { id: generateId(), text: todoInput.trim(), completed: false }]);
    setTodoInput('');
  };

  const removeTodoItem = (id: string) => {
    setTodoItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  if (!isExpanded) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm hover:shadow-md transition-all">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <span className="text-sm text-[var(--text-muted)]">Escreva uma nota...</span>
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); setIsMono(true); }}
            className="p-2 hover:bg-[var(--accent-muted)] rounded-xl transition-colors text-[var(--text-muted)]"
            title="Código"
          >
            <Code className="w-4 h-4" />
          </button>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg transition-all", `note-color-${color}`)}>
      <div className="flex items-center justify-between px-4 pt-3">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Título"
          className="w-full bg-transparent font-semibold text-base outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
        />
        <button onClick={() => setIsPinned(!isPinned)} className={cn("p-1.5 rounded-full transition-all", isPinned ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400")}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22M17 7L12 2L7 7M7 7L7 17L12 22L17 17L7 7Z"/></svg>
        </button>
      </div>

      {attachedImage && (
        <div className="px-4 py-2">
          <div className="relative max-h-40 rounded-xl overflow-hidden border border-[var(--border)]">
            <img src={attachedImage} alt="" className="w-full h-full object-contain bg-[var(--bg-elevated)]" />
            <button onClick={() => setAttachedImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {attachedAudio && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 p-2 bg-[var(--accent-muted)] rounded-xl border border-[var(--accent)]/20">
            <span className="text-xs font-semibold text-[var(--accent)]">Voz</span>
            <audio src={attachedAudio} controls className="flex-1 h-6" />
            <button onClick={() => setAttachedAudio(null)} className="text-[var(--text-muted)] hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!isTodo ? (
        <div className="px-4 py-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escreva seu texto..."
            rows={4}
            className={cn("w-full bg-transparent text-sm outline-none resize-y min-h-[120px] max-h-[400px] scrollbar-thin text-[var(--text-primary)] placeholder:text-[var(--text-muted)]", isMono && "font-code")}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-[var(--text-muted)] px-2 py-0.5 bg-[var(--bg-elevated)] rounded-full">{wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}</span>
          </div>
        </div>
      ) : (
        <div className="px-4 py-2 space-y-1.5">
          {todoItems.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-2 p-1.5 hover:bg-[var(--bg-elevated)] rounded-lg">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={item.completed} onChange={() => setTodoItems(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i))} className="accent-sky-500 w-4 h-4" />
                <span className={cn("text-sm text-[var(--text-primary)]", item.completed && "line-through text-[var(--text-muted)]")}>{item.text}</span>
              </div>
              <button onClick={() => removeTodoItem(item.id)} className="text-[var(--text-muted)] hover:text-red-500 p-1"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <div className="flex items-center gap-2 border-t border-[var(--border)] pt-2">
            <input
              type="text"
              value={todoInput}
              onChange={e => setTodoInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTodoItem(); } }}
              placeholder="Adicionar tarefa..."
              className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <button onClick={addTodoItem} className="p-1 text-[var(--accent)]"><Plus className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 mb-2">
          {selectedLabels.map(l => (
            <span key={l} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-elevated)] rounded-full text-xs font-semibold text-[var(--text-secondary)]">
              {l}
              <button onClick={() => toggleLabel(l)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      {showReminder && (
        <div className="mx-4 my-2 p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Lembrete:</span>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-transparent border border-[var(--border)] rounded-lg px-2 py-1 text-xs outline-none text-[var(--text-primary)]" />
          <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="bg-transparent border border-[var(--border)] rounded-lg px-2 py-1 text-xs outline-none text-[var(--text-primary)]" />
          <button onClick={() => { setDueDate(''); setDueTime(''); setShowReminder(false); }} className="text-xs text-red-400 hover:underline">Limpar</button>
        </div>
      )}

      {showPassword && (
        <div className="mx-4 my-2 p-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl items-center gap-3 flex">
          <Lock className="w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Definir senha..."
            className="bg-transparent border border-[var(--border)] rounded-lg px-2 py-1 text-xs outline-none flex-1 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <button onClick={() => { setPassword(''); setShowPassword(false); }} className="text-xs text-red-400 hover:underline">Limpar</button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1">
          <div className="relative group">
            <button className="p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] rounded-xl" title="Cor">
              <Palette className="w-4 h-4" />
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex items-center gap-1.5 p-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 flex-wrap max-w-[200px]">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={cn("w-5 h-5 rounded-full transition-transform hover:scale-125", c.class, color === c.name && "ring-2 ring-[var(--accent)] ring-offset-1")}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <button onClick={() => setIsTodo(!isTodo)} className={cn("p-1.5 rounded-xl hover:bg-[var(--bg-elevated)]", isTodo ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} title="Checklist">
            <CheckSquare className="w-4 h-4" />
          </button>
          <button onClick={() => setIsMono(!isMono)} className={cn("p-1.5 rounded-xl hover:bg-[var(--bg-elevated)]", isMono ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} title="Monospace">
            <Code className="w-4 h-4" />
          </button>
          <button onClick={() => setShowReminder(!showReminder)} className={cn("p-1.5 rounded-xl hover:bg-[var(--bg-elevated)]", showReminder ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} title="Lembrete">
            <Calendar className="w-4 h-4" />
          </button>
          <button onClick={() => setShowPassword(!showPassword)} className={cn("p-1.5 rounded-xl hover:bg-[var(--bg-elevated)]", showPassword ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} title="Senha">
            <Lock className="w-4 h-4" />
          </button>
          <div className="relative group">
            <button className="p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] rounded-xl" title="Marcadores">
              <Tag className="w-4 h-4" />
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-1 px-2">Marcadores</p>
              <div className="max-h-32 overflow-y-auto space-y-0.5 scrollbar-thin">
                {labels.map(label => (
                  <label key={label} className="flex items-center gap-2 p-1.5 px-2 hover:bg-[var(--bg-elevated)] rounded-lg cursor-pointer text-sm text-[var(--text-primary)]">
                    <input type="checkbox" className="accent-sky-500" checked={selectedLabels.includes(label)} onChange={() => toggleLabel(label)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
