"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { warehouseAuth } from "@/firebase/firebaseConfig";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // PWA-friendly: ensures the session survives refresh/reopen (where supported)
    setPersistence(warehouseAuth, browserLocalPersistence).catch(() => {
      // If persistence fails (rare), Firebase will fall back internally.
    });

    const unsub = onAuthStateChanged(warehouseAuth, (u) => {
      setUser(u ?? null);
      setAuthReady(true);
    });

    return () => unsub();
  }, []);

  const value = useMemo(() => ({ user, authReady }), [user, authReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}