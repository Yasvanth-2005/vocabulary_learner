import { createContext, useContext, useState, useMemo } from 'react';

const DevModeContext = createContext(null);

export function DevModeProvider({ children }) {
  const [devMode, setDevMode] = useState(false);

  const value = useMemo(
    () => ({
      devMode,
      toggleDevMode: () => setDevMode((prev) => !prev),
      setDevMode,
    }),
    [devMode]
  );

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) {
    throw new Error('useDevMode must be used within DevModeProvider');
  }
  return ctx;
}
