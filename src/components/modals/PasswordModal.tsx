import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import Modal from './Modal';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (password: string) => void;
}

export default function PasswordModal({ isOpen, onClose, onVerify }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!password.trim()) return;
    onVerify(password);
    setPassword('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-6 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-[var(--text-primary)]">Nota Bloqueada</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Insira a senha para visualizar.</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="Digite a senha..."
          className={`w-full bg-transparent border rounded-xl px-3 py-2.5 text-sm text-center outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] ${error ? 'border-red-500 animate-shake' : 'border-[var(--border)] focus:border-[var(--accent)]'}`}
          autoFocus
        />
        {error && <p className="text-xs text-red-500 font-semibold">Senha inválida!</p>}
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-muted)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] transition-colors">Cancelar</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-sky-500/20 transition-all">Acessar</button>
        </div>
      </div>
    </Modal>
  );
}