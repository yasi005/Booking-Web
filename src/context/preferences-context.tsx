"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PreferencesContextValue = {
  cryptoMode: boolean;
  discretionMode: boolean;
  helipadAccess: boolean;
  helipadSpecs: string;
  toggleCrypto: () => void;
  toggleDiscretion: () => void;
  toggleHelipad: () => void;
  setHelipadSpecs: (value: string) => void;
  messagesOpen: boolean;
  settingsOpen: boolean;
  openMessages: () => void;
  openSettings: () => void;
  closeDrawers: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const MOCK_BTC_RATE = 0.0000112;

export function useCryptoRate() {
  return MOCK_BTC_RATE;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [cryptoMode, setCryptoMode] = useState(false);
  const [discretionMode, setDiscretionMode] = useState(false);
  const [helipadAccess, setHelipadAccess] = useState(false);
  const [helipadSpecs, setHelipadSpecs] = useState("");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleCrypto = useCallback(() => setCryptoMode((v) => !v), []);
  const toggleDiscretion = useCallback(() => setDiscretionMode((v) => !v), []);
  const toggleHelipad = useCallback(() => setHelipadAccess((v) => !v), []);
  const openMessages = useCallback(() => {
    setSettingsOpen(false);
    setMessagesOpen(true);
  }, []);
  const openSettings = useCallback(() => {
    setMessagesOpen(false);
    setSettingsOpen(true);
  }, []);
  const closeDrawers = useCallback(() => {
    setMessagesOpen(false);
    setSettingsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      cryptoMode,
      discretionMode,
      helipadAccess,
      helipadSpecs,
      toggleCrypto,
      toggleDiscretion,
      toggleHelipad,
      setHelipadSpecs,
      messagesOpen,
      settingsOpen,
      openMessages,
      openSettings,
      closeDrawers,
    }),
    [
      cryptoMode,
      discretionMode,
      helipadAccess,
      helipadSpecs,
      toggleCrypto,
      toggleDiscretion,
      toggleHelipad,
      messagesOpen,
      settingsOpen,
      openMessages,
      openSettings,
      closeDrawers,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
