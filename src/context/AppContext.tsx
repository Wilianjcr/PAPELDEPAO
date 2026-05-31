import React, { createContext, useContext, useCallback, useState } from 'react';
import type { Note, FilterType, ViewLayout } from '../types';
import { generateId } from '../utils/helpers';
import { hashPassword } from '../utils/crypto';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  notes: Note[];
  labels: string[];
  activeFilter: FilterType;
  viewLayout: ViewLayout;
  searchQuery: string;
  setActiveFilter: (f: FilterType) => void;
  setViewLayout: (l: ViewLayout) => void;
  setSearchQuery: (q: string) => void;
  addNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  togglePin: (id: string) => void;
  toggleArchive: (id: string) => void;
  addLabel: (label: string) => void;
  removeLabel: (label: string) => void;
  toggleLabelOnNote: (noteId: string, labelName: string) => void;
  toggleTodoItem: (noteId: string, itemId: string) => void;
  filteredNotes: Note[];
  activeNotesCount: number;
  exportNotes: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_NOTES: Note[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Papel de Pão!',
    content: 'Seu bloco de notas inteligente.\n\nExperimente criar notas, checklists, desenhos, códigos executáveis e gravações de voz. Tudo salvo localmente!',
    color: 'default',
    type: 'text',
    todoItems: [],
    isPinned: true,
    isArchived: false,
    isTrashed: false,
    isMonospace: false,
    labels: [],
    dueDate: null,
    dueTime: null,
    password: null,
    passwordHash: null,
    imageData: null,
    audioData: null,
    alarmTriggered: false,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
];

const DEFAULT_LABELS = ['Trabalho', 'Códigos', 'Pessoal', 'Ideias'];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useLocalStorage<Note[]>('pdp_notes_v4', DEFAULT_NOTES);
  const [labels, setLabels] = useLocalStorage<string[]>('pdp_labels_v4', DEFAULT_LABELS);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewLayout, setViewLayout] = useLocalStorage<ViewLayout>('pdp_layout_v4', 'grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotesCount, setActiveNotesCount] = useState(0);

  const addNote = useCallback(async (partial: Partial<Note>) => {
    let passwordHash: string | null = null;
    if (partial.password && partial.password.trim()) {
      passwordHash = await hashPassword(partial.password.trim());
    }
    const newNote: Note = {
      id: generateId(),
      title: partial.title || 'Sem Título',
      content: partial.content || '',
      type: partial.type || 'text',
      todoItems: partial.todoItems || [],
      color: partial.color || 'default',
      isPinned: partial.isPinned || false,
      isArchived: false,
      isTrashed: false,
      isMonospace: partial.isMonospace || false,
      labels: partial.labels || [],
      dueDate: partial.dueDate || null,
      dueTime: partial.dueTime || null,
      password: partial.password?.trim() || null,
      passwordHash,
      imageData: partial.imageData || null,
      audioData: partial.audioData || null,
      alarmTriggered: false,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
  }, [setNotes]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    if (updates.password !== undefined) {
      if (updates.password && updates.password.trim()) {
        updates.passwordHash = await hashPassword(updates.password.trim());
      } else {
        updates.passwordHash = null;
        updates.password = null;
      }
    }
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    ));
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isTrashed: true, isPinned: false, updatedAt: Date.now() } : n
    ));
  }, [setNotes]);

  const permanentlyDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, [setNotes]);

  const restoreFromTrash = useCallback((id: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isTrashed: false, updatedAt: Date.now() } : n
    ));
  }, [setNotes]);

  const togglePin = useCallback((id: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n
    ));
  }, [setNotes]);

  const toggleArchive = useCallback((id: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, isArchived: !n.isArchived, isPinned: false, updatedAt: Date.now() } : n
    ));
  }, [setNotes]);

  const addLabel = useCallback((label: string) => {
    setLabels(prev => {
      if (prev.includes(label)) return prev;
      return [...prev, label];
    });
  }, [setLabels]);

  const removeLabel = useCallback((label: string) => {
    setLabels(prev => prev.filter(l => l !== label));
    setNotes(prev => prev.map(n => ({
      ...n,
      labels: n.labels.filter(l => l !== label),
    })));
  }, [setLabels, setNotes]);

  const toggleLabelOnNote = useCallback((noteId: string, labelName: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      const has = n.labels.includes(labelName);
      return {
        ...n,
        labels: has ? n.labels.filter(l => l !== labelName) : [...n.labels, labelName],
        updatedAt: Date.now(),
      };
    }));
  }, [setNotes]);

  const toggleTodoItem = useCallback((noteId: string, itemId: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        todoItems: n.todoItems.map(i =>
          i.id === itemId ? { ...i, completed: !i.completed } : i
        ),
        updatedAt: Date.now(),
      };
    }));
  }, [setNotes]);

  const filteredNotes = React.useMemo(() => {
    let result = notes;

    if (activeFilter === 'trash') return result.filter(n => n.isTrashed);
    if (activeFilter === 'archive') return result.filter(n => n.isArchived && !n.isTrashed);
    if (activeFilter === 'pinned') return result.filter(n => n.isPinned && !n.isTrashed && !n.isArchived);
    if (activeFilter === 'todo') return result.filter(n => n.type === 'todo' && !n.isTrashed && !n.isArchived);
    if (labels.includes(activeFilter)) {
      result = result.filter(n => n.labels.includes(activeFilter) && !n.isTrashed && !n.isArchived);
    } else {
      result = result.filter(n => !n.isTrashed && !n.isArchived);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        n.labels.some(l => l.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, activeFilter, searchQuery, labels]);

  React.useEffect(() => {
    const count = notes.filter(n => !n.isTrashed && !n.isArchived).length;
    setActiveNotesCount(count);
  }, [notes]);

  const exportNotes = useCallback(() => {
    const data = JSON.stringify({ version: '4.0.0', exportedAt: Date.now(), labels, notes }, null, 2);
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    a.download = `Backup_PapeldePao_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [notes, labels]);

  return (
    <AppContext.Provider value={{
      notes, labels, activeFilter, viewLayout, searchQuery,
      setActiveFilter, setViewLayout, setSearchQuery,
      addNote, updateNote, deleteNote, permanentlyDeleteNote,
      restoreFromTrash, togglePin, toggleArchive,
      addLabel, removeLabel, toggleLabelOnNote, toggleTodoItem,
      filteredNotes, activeNotesCount, exportNotes,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
