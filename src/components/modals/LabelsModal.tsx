import React, { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import Modal from './Modal';
import { useApp } from '../../context/AppContext';
import { escapeHTML } from '../../utils/helpers';

interface LabelsModalProps { isOpen: boolean; onClose: () => void; }

export default function LabelsModal({ isOpen, onClose }: LabelsModalProps) {
  const { labels, addLabel, removeLabel } = useApp();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() && !labels.includes(input.trim())) {
      addLabel(input.trim());
      setInput('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="font-bold text-lg text-[var(--text-primary)]">Editar Marcadores</h3>
      </div>
      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-[var(--text-muted)]" />
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} placeholder="Criar marcador..." className="w-full bg-transparent text-sm outline-none border-b border-[var(--border)] focus:border-[var(--accent)] py-1 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />
          <button onClick={handleAdd} className="p-1.5 bg-[var(--accent)] text-white rounded-xl"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="space-y-1">
          {labels.map(label => (
            <div key={label} className="flex items-center justify-between gap-2 p-2 hover:bg-[var(--bg-elevated)] rounded-xl">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">{escapeHTML(label)}</span>
              </div>
              <button onClick={() => removeLabel(label)} className="p-1 hover:text-red-500 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-[var(--border)] flex justify-end">
        <button onClick={onClose} className="px-4 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--accent-muted)] text-sm font-semibold rounded-xl text-[var(--text-secondary)] transition-colors">Pronto</button>
      </div>
    </Modal>
  );
}