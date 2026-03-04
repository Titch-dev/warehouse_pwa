"use client";

import React, { useContext } from "react";
import { CookieConsentContext } from "./cookie-consent-provider";

export default function CookieSettingsLink({ className }) {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) return null;

  return (
    <button type="button" className={className} onClick={ctx.openCookieSettings}>
      Cookies
    </button>
  );
}