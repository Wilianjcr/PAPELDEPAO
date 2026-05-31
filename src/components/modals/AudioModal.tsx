import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import Modal from './Modal';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export default function AudioModal({ isOpen, onClose, onSave }: AudioModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState('0:00');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startTime = useRef(0);
  const timerInterval = useRef<ReturnType<typeof setInterval>>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];
      recorder.ondataavailable = e => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          onSave(reader.result as string);
          onClose();
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      setIsRecording(true);
      startTime.current = Date.now();
      timerInterval.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTime.current) / 1000);
        setTimer(`${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`);
      }, 500);
    } catch {
      alert('Microfone bloqueado ou indisponível.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    clearInterval(timerInterval.current);
    setTimer('0:00');
  };

  const handleClose = () => {
    if (isRecording) stopRecording();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-sm">
      <div className="p-6 text-center space-y-5">
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isRecording ? 'bg-red-100 dark:bg-red-950/40 text-red-500 animate-pulse' : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20'}`}>
          <Mic className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">Gravador de Voz</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">{isRecording ? timer : 'Clique para começar.'}</p>
        </div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full py-3 font-bold rounded-xl shadow-md transition-all ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-500/20'}`}
        >
          {isRecording ? 'Finalizar Gravação' : 'Iniciar Gravação'}
        </button>
        <button onClick={handleClose} className="w-full py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-muted)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] transition-colors">
          Cancelar
        </button>
      </div>
    </Modal>
  );
}