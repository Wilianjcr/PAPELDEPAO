import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool } from 'lucide-react';
import Modal from './Modal';

interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const BRUSH_COLORS = ['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'];

export default function DrawingModal({ isOpen, onClose, onSave }: DrawingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = Math.min(600, window.innerWidth - 80);
    canvas.height = 350;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [isOpen]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const save = () => {
    if (!canvasRef.current) return;
    onSave(canvasRef.current.toDataURL('image/jpeg', 0.8));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-2 text-[var(--accent)]">
        <PenTool className="w-5 h-5" />
        <h3 className="font-bold text-base text-[var(--text-primary)]">Prancheta de Desenho</h3>
      </div>
      <div className="bg-[var(--bg-elevated)] p-3 flex justify-center">
        <canvas
          ref={canvasRef}
          className="bg-white rounded-xl border border-[var(--border)] max-w-full cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
      <div className="p-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {BRUSH_COLORS.map(c => (
            <button key={c} onClick={() => { setColor(c); setIsEraser(false); }} className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${!isEraser && color === c ? 'ring-2 ring-[var(--accent)] ring-offset-2' : ''}`} style={{ backgroundColor: c }} />
          ))}
          <button onClick={() => setIsEraser(!isEraser)} className={`p-1.5 rounded-lg border transition-colors ${isEraser ? 'bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)]' : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)]'}`}>
            <Eraser className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Pincel:</span>
            <input type="range" min="2" max="30" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-20 accent-[var(--accent)]" />
          </div>
          <button onClick={clear} className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-muted)] text-xs font-semibold rounded-lg text-[var(--text-secondary)] transition-colors">Limpar</button>
          <button onClick={save} className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/20">Anexar</button>
        </div>
      </div>
    </Modal>
  );
}