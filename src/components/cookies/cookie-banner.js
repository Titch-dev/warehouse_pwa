"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { CookieConsentContext } from "./cookie-consent-provider";
import styles from "./cookie-consent.module.css";
import { rubikFont } from "@/lib/fonts";

export default function CookieBanner() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) return null;

  const { prefs, isOpen, isMounted, closeCookieSettings, savePrefs, acceptAll, rejectNonEssential } = ctx;

  if (!prefs || !isMounted) return null;
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel} role="dialog" aria-label="Cookie preferences">
        <div className={styles.header}>
          <h4 className={`${styles.title} ${rubikFont.className}`}>Cookies & Privacy</h4>
          <button type="button" className={styles.close} onClick={closeCookieSettings}>
            ✕
          </button>
        </div>

        <p className={styles.body}>
          We use essential cookies to keep this site working.
          With your permission, we also use analytics to understand usage
          and improve your experience.{" "}
          <Link href="/privacy" className={styles.learnMore} onClick={closeCookieSettings}>
            Learn more
          </Link>
        </p>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>Strictly necessary</div>
            <div className={styles.toggleDesc}>Always enabled.</div>
          </div>
          <input type="checkbox" checked disabled />
        </div>

        <div className={styles.toggleRow}>
          <div>
            <div className={styles.toggleLabel}>Analytics</div>
            <div className={styles.toggleDesc}>
              Helps us understand which events and pages are most useful.
            </div>
          </div>
          <input
            type="checkbox"
            checked={prefs.analytics}
            onChange={(e) =>
              savePrefs({ ...prefs, analytics: e.target.checked })
            }
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.secondary} onClick={rejectNonEssential}>
            Reject non-essential
          </button>
          <button className={styles.primary} onClick={acceptAll}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}