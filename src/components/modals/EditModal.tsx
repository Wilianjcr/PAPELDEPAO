import React, { useState, useEffect } from 'react';
import { Pin, Copy, Trash2, Archive, Palette, X, Lock, CheckSquare, Play } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/helpers';
import type { Note, NoteColor, TodoItem } from '../../types';
import { generateId } from '../../utils/helpers';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

const COLORS: NoteColor[] = ['default','red','orange','yellow','green','teal','blue','darkblue','purple','pink','brown','gray'];
const COLOR_CLASSES: Record<NoteColor, string> = {
  default: 'bg-white dark:bg-slate-700 border border-slate-300', red: 'bg-red-300', orange: 'bg-orange-300',
  yellow: 'bg-yellow-300', green: 'bg-green-300', teal: 'bg-teal-300', blue: 'bg-blue-300',
  darkblue: 'bg-blue-500', purple: 'bg-purple-300', pink: 'bg-pink-300', brown: 'bg-amber-700', gray: 'bg-slate-300',
};

export default function EditModal({ isOpen, onClose, note }: EditModalProps) {
  const { updateNote, deleteNote, toggleArchive, labels, toggleLabelOnNote } = useApp();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isTodo, setIsTodo] = useState(false);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [todoInput, setTodoInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isMono, setIsMono] = useState(false);
  const [color, setColor] = useState<NoteColor>('default');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [password, setPassword] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsTodo(note.type === 'todo');
      setTodoItems(note.todoItems ? [...note.todoItems] : []);
      setIsPinned(note.isPinned);
      setIsMono(note.isMonospace);
      setColor(note.color);
      setDueDate(note.dueDate || '');
      setDueTime(note.dueTime || '');
      setPassword('');
      setIsRunningCode(false);
    }
  }, [note]);

  if (!note) return null;

  const handleSave = async () => {
    await updateNote(note.id, {
      title: title.trim() || 'Sem Título',
      content: isTodo ? '' : content,
      type: isTodo ? 'todo' : 'text',
      todoItems,
      isPinned,
      isMonospace: isMono,
      color,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      password: password.trim() || null,
    });
    onClose();
  };

  const handleCopy = () => {
    const text = isTodo ? todoItems.map(i => `[${i.completed?'x':' '}] ${i.text}`).join('\n') : content;
    navigator.clipboard.writeText(text).then(() => showToast('Copiado!'));
  };

  const addTodoItem = () => {
    if (!todoInput.trim()) return;
    setTodoItems(prev => [...prev, { id: generateId(), text: todoInput.trim(), completed: false }]);
    setTodoInput('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className={`p-4 flex items-center justify-between border-b border-[var(--border)] note-color-${color}`}>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsPinned(!isPinned)} className={cn("p-2 rounded-xl transition-colors", isPinned ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400")}>
            <Pin className="w-5 h-5" />
          </button>
          <button onClick={() => setIsMono(!isMono)} className={cn("p-2 rounded-xl transition-colors", isMono ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--accent)]")} title="Monospace">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>
          </button>
          <button onClick={handleCopy} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-emerald-500 transition-colors" title="Copiar">
            <Copy className="w-5 h-5" />
          </button>
          <button onClick={() => setIsTodo(!isTodo)} className={cn("p-2 rounded-xl transition-colors", isTodo ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} title="Lista">
            <CheckSquare className="w-5 h-5" />
          </button>
          {isMono && (
            <button onClick={() => setIsRunningCode(true)} className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors" title="Executar">
              <Play className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="relative group">
            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl">
              <Palette className="w-5 h-5" />
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex items-center gap-1.5 p-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 flex-wrap max-w-[200px]">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} className={cn("w-5 h-5 rounded-full transition-transform hover:scale-125", COLOR_CLASSES[c], color === c && "ring-2 ring-[var(--accent)] ring-offset-1")} />
              ))}
            </div>
          </div>
          <button onClick={() => { deleteNote(note.id); onClose(); showToast('Lixeira'); }} className="p-2 text-red-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors" title="Excluir">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={() => { toggleArchive(note.id); onClose(); showToast(note.isArchived ? 'Desarquivada' : 'Arquivada'); }} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-elevated)] transition-colors" title="Arquivar">
            <Archive className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isRunningCode && (
        <div className="p-4 border-b border-[var(--border)] bg-emerald-500/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-emerald-500">Playground</span>
            <button onClick={() => setIsRunningCode(false)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">Fechar</button>
          </div>
          <iframe srcDoc={content} sandbox="allow-scripts" className="w-full h-[60vh] rounded-xl border border-[var(--border)] bg-white" />
        </div>
      )}

      {!isRunningCode && (
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4 scrollbar-thin">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Sem título" className="w-full bg-transparent font-bold text-2xl outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />

          {!isTodo ? (
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Comece a digitar..." className={cn("w-full bg-transparent text-sm outline-none resize-none flex-1 min-h-[250px] scrollbar-thin text-[var(--text-primary)] placeholder:text-[var(--text-muted)]", isMono && "font-code")} />
          ) : (
            <div className="flex-1 flex flex-col gap-2 min-h-[250px]">
              {todoItems.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2 p-2 hover:bg-[var(--bg-elevated)] rounded-xl">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={item.completed} onChange={() => setTodoItems(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i))} className="accent-sky-500 w-4 h-4" />
                    <span className={cn("text-sm text-[var(--text-primary)]", item.completed && "line-through text-[var(--text-muted)]")}>{item.text}</span>
                  </div>
                  <button onClick={() => setTodoItems(prev => prev.filter(i => i.id !== item.id))} className="text-[var(--text-muted)] hover:text-red-500 p-1"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 border-t border-[var(--border)] pt-2">
                <input type="text" value={todoInput} onChange={e => setTodoInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTodoItem(); } }} placeholder="Adicionar tarefa..." className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />
                <button onClick={addTodoItem} className="p-1.5 bg-[var(--accent)] text-white rounded-xl"><CheckSquare className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Alarme</label>
              <div className="flex items-center gap-2">
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-transparent border border-[var(--border)] rounded-xl px-2 py-1.5 text-xs outline-none text-[var(--text-primary)]" />
                <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} className="bg-transparent border border-[var(--border)] rounded-xl px-2 py-1.5 text-xs outline-none text-[var(--text-primary)]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={note.passwordHash ? "••••••••" : "Definir senha..."} className="w-full bg-transparent border border-[var(--border)] rounded-xl px-2 py-1.5 text-xs outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Marcadores</p>
            <div className="flex flex-wrap gap-2">
              {labels.map(label => (
                <label key={label} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--bg-elevated)] rounded-xl cursor-pointer text-sm text-[var(--text-primary)]">
                  <input type="checkbox" className="accent-sky-500" checked={note.labels.includes(label)} onChange={() => toggleLabelOnNote(note.id, label)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isRunningCode && (
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]/50">
          <div className="text-xs text-[var(--text-muted)]">
            {note.updatedAt ? new Date(note.updatedAt).toLocaleString('pt-BR') : ''}
          </div>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-500/20 transition-all">
            Concluir
          </button>
        </div>
      )}
    </Modal>
  );
}