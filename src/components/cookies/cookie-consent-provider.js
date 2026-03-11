"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { readCookiePrefs, writeCookiePrefs, getDefaultPrefs } from "@/lib/cookies/preferences";
import { enableAnalyticsIfAllowed } from "@/firebase/analytics";

export const CookieConsentContext = createContext(null);

export default function CookieConsentProvider({ children }) {
  const [prefs, setPrefs] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const existing = readCookiePrefs();
    console.log("[cookie] existing prefs:", existing);
    console.log("[cookie] document.cookie:", document.cookie);

    if (!existing) {
      setPrefs(getDefaultPrefs());
      setIsOpen(true);
    } else {
      setPrefs(existing);

      if (existing.analytics) {
        enableAnalyticsIfAllowed();
      }
    }

    setIsMounted(true);
  }, []);

  const openCookieSettings = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCookieSettings = useCallback(() => {
    setIsOpen(false);
  }, []);

  const savePrefs = useCallback(async (nextPrefs) => {
    const merged = { ...nextPrefs, necessary: true };

    writeCookiePrefs(merged);
    setPrefs(merged);

    if (merged.analytics) {
      await enableAnalyticsIfAllowed();
    }

    setIsOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    savePrefs({ ...prefs, analytics: true });
  }, [prefs, savePrefs]);

  const rejectNonEssential = useCallback(() => {
    savePrefs({ ...prefs, analytics: false });
  }, [prefs, savePrefs]);

  const value = useMemo(() => ({
    prefs,
    isOpen,
    isMounted,
    openCookieSettings,
    closeCookieSettings,
    savePrefs,
    acceptAll,
    rejectNonEssential
  }), [prefs, isOpen, isMounted, openCookieSettings, closeCookieSettings, savePrefs, acceptAll, rejectNonEssential]);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}