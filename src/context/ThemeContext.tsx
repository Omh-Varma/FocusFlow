import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'cream' | 'sage' | 'lavender';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'focusflow-theme';
const VALID: Theme[] = ['cream', 'sage', 'lavender'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR-safe: start with the default theme, then pick up the stored choice after hydration.
  const [theme, setThemeState] = useState<Theme>('cream');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && VALID.includes(stored as Theme)) setThemeState(stored as Theme);
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [hydrated, theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () =>
    setThemeState((t) => {
      const idx = VALID.indexOf(t);
      return VALID[(idx + 1) % VALID.length] ?? 'cream';
    });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
