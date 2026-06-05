import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const THEME_KEY = 'app-theme';

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [studyTime, setStudyTime] = useState(() => {
    try {
      const raw = localStorage.getItem('study-time');
      return raw ? JSON.parse(raw) : { total: 0, today: 0, lastDate: null };
    } catch {
      return { total: 0, today: 0, lastDate: null };
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Track study time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStudyTime((prev) => {
        const today = new Date().toDateString();
        const isNewDay = prev.lastDate !== today;
        const updated = {
          total: prev.total + 1,
          today: isNewDay ? 1 : prev.today + 1,
          lastDate: today,
        };
        localStorage.setItem('study-time', JSON.stringify(updated));
        return updated;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, studyTime }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
