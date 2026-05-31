import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ThemeName } from '../types';

export type { ThemeName };

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  isDark: true,
});

const DARK_THEMES: ThemeName[] = ['dark', 'solarized-dark', 'violet', 'amber', 'glass'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeStorage] = useLocalStorage<ThemeName>('pdp_theme_v4', 'dark');

  const setTheme = useCallback((t: ThemeName) => {
    setThemeStorage(t);
  }, [setThemeStorage]);

  const isDark = DARK_THEMES.includes(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'solarized-dark', 'solarized-light', 'rose', 'violet', 'amber', 'glass');
    root.classList.add(theme);
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
