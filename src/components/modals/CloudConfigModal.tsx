import React, { useState } from 'react';
import { Cloud, Link, HelpCircle, ChevronDown, Check, Unplug } from 'lucide-react';
import Modal from './Modal';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CloudConfigModal({ isOpen, onClose }: CloudConfigModalProps) {
  const [clientId, setClientId] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const steps = [
    { num: 1, title: 'Acesse o Google Cloud Console', desc: 'Abra console.cloud.google.com e faça login.' },
    { num: 2, title: 'Crie um Projeto', desc: 'Clique em "Selecionar projeto" > "Novo Projeto".' },
    { num: 3, title: 'Ative a Google Drive API', desc: 'Vá em APIs & Serviços > Biblioteca > pesquise "Google Drive API" > Ativar.' },
    { num: 4, title: 'Configure a Tela de Consentimento', desc: 'Escolha "Externo", adicione escopo drive.file e seu email como teste.' },
    { num: 5, title: 'Crie Credenciais OAuth', desc: 'Tipo "Web". Adicione sua URL em origens autorizadas. Copie o Client ID.' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-2 text-[var(--accent)]">
        <Cloud className="w-5 h-5" />
        <h3 className="font-bold text-lg text-[var(--text-primary)]">Google Drive</h3>
      </div>
      <div className="p-5 space-y-4 text-sm overflow-y-auto scrollbar-thin">
        <div className="p-3 bg-[var(--bg-elevated)] rounded-xl flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span className="text-[var(--text-secondary)] text-xs font-semibold">Desconectado</span>
        </div>
        <div className="space-y-1.5">
          <label className="block font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">Client ID do Google</label>
          <input type="text" value={clientId} onChange={e => setClientId(e.target.value)} placeholder="123456789-abc.apps.googleusercontent.com" className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-xs outline-none focus:border-[var(--accent)] transition-colors font-code text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2">
          <Link className="w-3.5 h-3.5" /> Conectar ao Drive
        </button>
        <div>
          <button onClick={() => setShowGuide(!showGuide)} className="w-full py-2 rounded-xl bg-amber-500/5 border border-dashed border-amber-500/30 text-xs font-bold text-amber-500 flex items-center justify-center gap-2 hover:bg-amber-500/10 transition-colors">
            <HelpCircle className="w-4 h-4" /> Como obter o Client ID
            <ChevronDown className={`w-4 h-4 transition-transform ${showGuide ? 'rotate-180' : ''}`} />
          </button>
          {showGuide && (
            <div className="mt-3 space-y-0">
              {steps.map(s => (
                <div key={s.num} className="flex gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-black flex items-center justify-center shrink-0">{s.num}</div>
                  <div>
                    <h4 className="font-bold text-xs text-[var(--text-primary)]">{s.title}</h4>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 py-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white text-xs font-black flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5" /></div>
                <div>
                  <h4 className="font-bold text-xs text-[var(--text-primary)]">Pronto!</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Cole o Client ID e clique "Conectar".</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 bg-sky-500/5 border border-sky-500/20 rounded-xl text-[11px] text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-[var(--accent)]">100% Gratuito:</strong> 15GB de armazenamento e cota generosa. Seus dados vão direto da tela para o Drive.
        </div>
      </div>
      <div className="p-4 border-t border-[var(--border)] flex justify-between items-center">
        <button className="text-xs text-red-500 hover:underline font-semibold flex items-center gap-1 hidden">
          <Unplug className="w-3 h-3" /> Desconectar
        </button>
        <div />
        <button onClick={onClose} className="px-5 py-2 bg-[var(--bg-elevated)] hover:bg-[var(--accent-muted)] text-xs font-semibold rounded-xl text-[var(--text-secondary)] transition-colors">Fechar</button>
      </div>
    </Modal>
  );
}