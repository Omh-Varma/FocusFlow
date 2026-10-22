import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  // SSR-safe: initialize with the default, then load stored value after hydration.
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage unavailable or unparsable */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }, [hydrated, key, value]);

  return [value, setValue] as const;
}
