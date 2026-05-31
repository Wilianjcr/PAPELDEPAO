import { useState, useCallback, useRef } from 'react';

interface ToastState {
  message: string;
  visible: boolean;
}

export function useToast(duration = 3000) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setToast({ message: '', visible: false });
    }, duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message: '', visible: false });
  }, []);

  return { toast, showToast, hideToast };
}
