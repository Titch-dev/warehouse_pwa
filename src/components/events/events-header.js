'use client';

import React, { useEffect, useId, useRef } from 'react';

import EventCalendar from '@/components/events/event-calendar';
import EventFilter from '@/components/events/event-filter';

import TornBorder from '@/components/assets/patterns/torn-border';
import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';

import FilterIconSVG from '@/components/assets/icons/filter-svg';
import CalendarDaysSVG from '@/components/assets/icons/calendar-days-svg';

import styles from './events-header.module.css';

export default function EventsHeader({
  filters,
  onChangeFilters,
  activePanel,
  setActivePanel,
  events,
  selectedEvent,
  onEventSelect,
}) {
  const headerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    const onDocDown = (e) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) setActivePanel(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setActivePanel(null);
    };

    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [setActivePanel]);

  const togglePanel = (which) => {
    setActivePanel((cur) => (cur === which ? null : which));
  };

  const closePanel = () => setActivePanel(null);

  return (
    <div className={styles.event_list_header} ref={headerRef}>
      <div className={styles.filters_left}>
        <span className={`${styles.label} ${rubikFont.className}`}>Filter :</span>
        <span className={styles.summary}>
          {filters.time !== 'all' ? humanTime(filters.time) : 'All dates'}
          {filters.type !== 'all' ? ` · ${humanType(filters.type)}` : ''}
          {filters.price === 'free' ? ' · Free' : ''}
        </span>
      </div>

      <div className={styles.header_controls}>
        <button
          type="button"
          className={styles.header_icon_btn}
          onClick={() => togglePanel('filters')}
          aria-expanded={activePanel === 'filters'}
          aria-controls={panelId}
          aria-label={activePanel === 'filters' ? 'Close filters' : 'Open filters'}
        >
          <FilterIconSVG className={styles.header_icon}>
            <linearGradient id="Gradient1" x2="0" y2="1">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
            </linearGradient>
          </FilterIconSVG>
        </button>

        <button
          type="button"
          className={styles.header_icon_btn}
          onClick={() => togglePanel('calendar')}
          aria-expanded={activePanel === 'calendar'}
          aria-controls={panelId}
          aria-label={activePanel === 'calendar' ? 'Close calendar' : 'Open calendar'}
        >
          <CalendarDaysSVG className={styles.header_icon}>
            <linearGradient id="Gradient1" x2="0" y2="1">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
            </linearGradient>
          </CalendarDaysSVG>
        </button>
      </div>

      <div
        id={panelId}
        className={`${styles.header_panel} ${activePanel ? styles.header_panel_open : ''}`}
        role="region"
        aria-label="Event tools"
      >
        <div className={styles.header_panel_inner}>
          <div className={styles.panel_top}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={closePanel}
              aria-label="Close panel"
            >
              <span className={styles.closeBar1} />
              <span className={styles.closeBar2} />
            </button>
          </div>

          {activePanel === 'filters' && (
            <EventFilter value={filters} onChange={onChangeFilters} />
          )}

          {activePanel === 'calendar' && (
            <EventCalendar
              events={events}
              selectedEvent={selectedEvent}
              onEventSelect={(e) => {
                onEventSelect?.(e);
                setActivePanel(null);
              }}
            />
          )}
        </div>
      </div>

      <TornBorder top={false} color={colors.greydark1}/>
    </div>
  );
}

function humanTime(v) {
  if (v === 'next') return 'Next event';
  if (v === 'thisMonth') return 'This month';
  if (v === 'nextMonth') return 'Next month';
  return 'All';
}

function humanType(v) {
  if (v === 'one_off') return 'One-off';
  if (v === 'weekly') return 'Weekly';
  return 'All';
}