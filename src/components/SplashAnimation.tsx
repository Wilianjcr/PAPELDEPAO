import React, { useEffect, useState } from 'react';

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
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-sky-500/30 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <svg viewBox="0 0 110 115" className="w-16 h-16">
            <rect x="10" y="22" width="90" height="82" rx="10" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="3"/>
            <path d="M10,32 Q10,22 20,22 L90,22 Q100,22 100,32 L100,42 L10,42 Z" fill="#f97316" stroke="#ea580c" strokeWidth="3"/>
            <line x1="10" y1="42" x2="100" y2="42" stroke="#0ea5e9" strokeWidth="2"/>
            <line x1="33" y1="42" x2="33" y2="104" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.5"/>
            <line x1="15" y1="60" x2="95" y2="60" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.4"/>
            <line x1="15" y1="76" x2="95" y2="76" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.4"/>
            <line x1="15" y1="92" x2="95" y2="92" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.4"/>
            <rect x="24" y="11" width="12" height="19" rx="6" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2"/>
            <rect x="44" y="11" width="12" height="19" rx="6" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2"/>
            <rect x="64" y="11" width="12" height="19" rx="6" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2"/>
            <rect x="84" y="11" width="12" height="19" rx="6" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2"/>
          </svg>
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
