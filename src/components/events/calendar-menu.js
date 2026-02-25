'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './calendar-menu.module.css';

import CalendarDaysSVG from '@/components/assets/icons/calendar-days-svg';
import EventCalendar from '@/components/events/event-calendar';

export default function CalendarMenu({
  events,
  selectedEvent,
  onEventSelect,

  open: openProp,
  onOpenChange,
  onWillOpen,
}) {
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;

  const panelId = useId();
  const wrapRef = useRef(null);

  // unique gradient id so it never collides
  const gradId = useId();

  useEffect(() => {
    const onDocDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [setOpen]);

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next && onWillOpen) onWillOpen();
      return next;
    });
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.iconBtn} ${open ? styles.open : ''}`}
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close calendar' : 'Open calendar'}
      >
        {/* calendar icon (shrinks to center when open) */}
        <CalendarDaysSVG className={styles.icon}>
          <linearGradient id="gradId" x2="0" y2="1">
            <stop className={styles.stop1} offset="0%" />
            <stop className={styles.stop2} offset="50%" />
            <stop className={styles.stop3} offset="100%" />
          </linearGradient>
        </CalendarDaysSVG>

        {/* X bars (grow from center when open) */}
        <span className={styles.x1} />
        <span className={styles.x2} />
      </button>

      <div
        id={panelId}
        className={`${styles.panel} ${open ? styles.panel_open : ''}`}
        role="region"
        aria-label="Event calendar"
      >
        <div className={styles.panel_inner}>
          <EventCalendar
            events={events}
            selectedEvent={selectedEvent}
            onEventSelect={(e) => {
              onEventSelect?.(e);
              setOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}