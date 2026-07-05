"use client";

import { fetchSession, type AuthUser } from "@/lib/auth-api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const session = await fetchSession();
      setUser(session.authenticated && session.user ? session.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const value = useMemo(
    () => ({ user, loading, refreshAuth, clearAuth }),
    [user, loading, refreshAuth, clearAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function getUserInitials(name: string | null | undefined, email: string | null | undefined): string {
  const trimmedName = name?.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    }
    return trimmedName.slice(0, 2).toUpperCase();
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    return trimmedEmail.slice(0, 2).toUpperCase();
  }

  return "?";
}

export function getUserProfileHref(_user: AuthUser): string {
  return "/dashboard";
}
