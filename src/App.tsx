import React, { useState, useCallback, useRef } from 'react';
import { useApp } from './context/AppContext';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreateNote from './components/CreateNote';
import NotesGrid from './components/NotesGrid';
import FAB from './components/FAB';
import Toast from './components/Toast';
import SplashAnimation from './components/SplashAnimation';
import ThemeModal from './components/modals/ThemeModal';
import EditModal from './components/modals/EditModal';
import PasswordModal from './components/modals/PasswordModal';
import DrawingModal from './components/modals/DrawingModal';
import AudioModal from './components/modals/AudioModal';
import CloudConfigModal from './components/modals/CloudConfigModal';
import LabelsModal from './components/modals/LabelsModal';
import VersionHistoryModal from './components/modals/VersionHistoryModal';
import AlarmModal from './components/modals/AlarmModal';
import type { Note } from './types';
import { verifyPassword } from './utils/crypto';

export default function App() {
  const { addNote, updateNote, notes } = useApp();
  const { toast, showToast } = useToast();

  // Splash
  const [showSplash, setShowSplash] = useState(true);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [drawingModalOpen, setDrawingModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);

  // Note being edited/opened
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);

  // Alarm
  const [alarmNote, setAlarmNote] = useState<Note | null>(null);
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const notesRef = useRef(notes);
  notesRef.current = notes;

  // Alarm scheduler
  React.useEffect(() => {
    alarmIntervalRef.current = setInterval(() => {
      const now = new Date();
      const currentNotes = notesRef.current;
      currentNotes.forEach(note => {
        if (!note.isTrashed && !note.isArchived && !note.alarmTriggered && note.dueDate && note.dueTime) {
          if (now >= new Date(`${note.dueDate}T${note.dueTime}`)) {
            updateNote(note.id, { alarmTriggered: true });
            setAlarmNote(note);
            setAlarmModalOpen(true);
          }
        }
      });
    }, 10000);
    return () => clearInterval(alarmIntervalRef.current);
  }, [updateNote]);

  const handleNoteOpen = useCallback(async (note: Note) => {
    if (note.passwordHash && !note.isTrashed) {
      setPendingNoteId(note.id);
      setPasswordModalOpen(true);
      return;
    }
    setSelectedNote(note);
    setEditModalOpen(true);
  }, []);

  const handlePasswordVerify = useCallback(async (password: string) => {
    if (!pendingNoteId) return;
    const note = notes.find(n => n.id === pendingNoteId);
    if (!note || !note.passwordHash) return;
    const valid = await verifyPassword(password, note.passwordHash);
    if (valid) {
      setPasswordModalOpen(false);
      setPendingNoteId(null);
      setSelectedNote(note);
      setEditModalOpen(true);
    } else {
      showToast('Senha inválida!');
    }
  }, [pendingNoteId, notes, showToast]);

  const handleDrawingSave = useCallback((dataUrl: string) => {
    addNote({ title: 'Desenho', imageData: dataUrl });
    showToast('Desenho salvo!');
  }, [addNote, showToast]);

  const handleAudioSave = useCallback((dataUrl: string) => {
    addNote({ title: 'Mensagem de Voz', audioData: dataUrl });
    showToast('Áudio salvo!');
  }, [addNote, showToast]);

  const handleImageSave = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        const max = 800;
        if (w > h) { if (w > max) { h *= max / w; w = max; } }
        else { if (h > max) { w *= max / h; h = max; } }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        const b64 = canvas.toDataURL('image/jpeg', 0.7);
        addNote({ title: 'Imagem', imageData: b64 });
        showToast('Imagem salva!');
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [addNote, showToast]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        let imported = 0;
        if (data.notes && Array.isArray(data.notes)) {
          for (const n of data.notes) {
            await addNote({
              title: n.title,
              content: n.content,
              type: n.type,
              todoItems: n.todoItems,
              color: n.color,
              isPinned: n.isPinned,
              isMonospace: n.isMonospace,
              labels: n.labels,
              imageData: n.imageData,
              audioData: n.audioData,
            });
            imported++;
          }
        }
        showToast(`${imported} nota(s) importada(s)!`);
      } catch {
        showToast('JSON inválido!');
      }
    };
    reader.readAsText(file);
  }, [addNote, showToast]);

  const handleFABText = () => {
    const el = document.querySelector('[data-create-note]') as HTMLButtonElement;
    el?.click();
  };

  return (
    <>
      {showSplash && <SplashAnimation onComplete={() => setShowSplash(false)} />}

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenThemeModal={() => setThemeModalOpen(true)}
          onOpenDriveModal={() => setDriveModalOpen(true)}
          driveStatus="disconnected"
        />

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenLabelsModal={() => { setSidebarOpen(false); setLabelsModalOpen(true); }}
          onOpenVersionModal={() => { setSidebarOpen(false); setVersionModalOpen(true); }}
          onImport={handleImport}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <div className="max-w-2xl mx-auto mb-8" data-create-note>
            <CreateNote onOpenDrawing={() => setDrawingModalOpen(true)} onOpenAudio={() => setAudioModalOpen(true)} />
          </div>

          <div className="max-w-7xl mx-auto">
            <NotesGrid onOpenNote={handleNoteOpen} />
          </div>
        </main>

        <FAB
          onText={handleFABText}
          onCode={() => { const el = document.querySelector('[data-create-note]') as HTMLElement; el?.scrollIntoView({ behavior: 'smooth' }); }}
          onDrawing={() => setDrawingModalOpen(true)}
          onImage={() => document.getElementById('image-input')?.click()}
          onAudio={() => setAudioModalOpen(true)}
          onList={() => { const el = document.querySelector('[data-create-note]') as HTMLElement; el?.scrollIntoView({ behavior: 'smooth' }); }}
        />

        <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageSave} />

        {/* Modals */}
        <ThemeModal isOpen={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
        <EditModal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedNote(null); }} note={selectedNote} />
        <PasswordModal isOpen={passwordModalOpen} onClose={() => { setPasswordModalOpen(false); setPendingNoteId(null); }} onVerify={handlePasswordVerify} />
        <DrawingModal isOpen={drawingModalOpen} onClose={() => setDrawingModalOpen(false)} onSave={handleDrawingSave} />
        <AudioModal isOpen={audioModalOpen} onClose={() => setAudioModalOpen(false)} onSave={handleAudioSave} />
        <CloudConfigModal isOpen={driveModalOpen} onClose={() => setDriveModalOpen(false)} />
        <LabelsModal isOpen={labelsModalOpen} onClose={() => setLabelsModalOpen(false)} />
        <VersionHistoryModal isOpen={versionModalOpen} onClose={() => setVersionModalOpen(false)} />
        <AlarmModal isOpen={alarmModalOpen} onClose={() => { setAlarmModalOpen(false); setAlarmNote(null); }} note={alarmNote} />

        <Toast message={toast.message} visible={toast.visible} />
      </div>
    </>
  );
}
