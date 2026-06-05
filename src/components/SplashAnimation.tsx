import { useEffect, useState } from 'react';

export default function SplashAnimation({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden transition-opacity duration-500" style={{ opacity: visible ? 1 : 0 }}>
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <img src="/icon.png" alt="Papel de Pão" className="w-24 h-24 object-contain drop-shadow-2xl" />
        </div>
        <h1 className="text-3xl font-black tracking-wider text-white mb-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          PAPEL DE PÃO
        </h1>
        <p className="text-sm text-sky-300/70 animate-slide-up" style={{ animationDelay: '0.7s' }}>
          Organizando suas ideias...
        </p>
        <div className="mt-8 flex justify-center gap-1 animate-fade-in" style={{ animationDelay: '1s' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
