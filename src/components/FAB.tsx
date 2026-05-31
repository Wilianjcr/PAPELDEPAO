import React from 'react';
import { Plus, Mic, Code, PenTool, Image, CheckSquare, Type } from 'lucide-react';
import { cn } from '../utils/helpers';

interface FABProps {
  onText: () => void;
  onCode: () => void;
  onDrawing: () => void;
  onImage: () => void;
  onAudio: () => void;
  onList: () => void;
}

const ACTIONS = [
  { icon: <Mic className="w-5 h-5" />, label: 'Áudio', onClick: 'onAudio' as const },
  { icon: <span className="font-bold font-mono text-base">{'>_'}</span>, label: 'Código', onClick: 'onCode' as const },
  { icon: <PenTool className="w-5 h-5" />, label: 'Desenho', onClick: 'onDrawing' as const },
  { icon: <Image className="w-5 h-5" />, label: 'Imagem', onClick: 'onImage' as const },
  { icon: <CheckSquare className="w-5 h-5" />, label: 'Lista', onClick: 'onList' as const },
  { icon: <Type className="w-5 h-5" />, label: 'Texto', onClick: 'onText' as const },
];

export default function FAB({ onText, onCode, onDrawing, onImage, onAudio, onList }: FABProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const callbacks = { onAudio, onCode, onDrawing, onImage, onList, onText };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-2 animate-slide-up">
            {ACTIONS.map((action, i) => (
              <button
                key={action.label}
                onClick={() => { setIsOpen(false); callbacks[action.onClick](); }}
                className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {action.icon}
                <span className="text-sm font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/30 flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/40",
            isOpen && "rotate-45"
          )}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </>
  );
}
