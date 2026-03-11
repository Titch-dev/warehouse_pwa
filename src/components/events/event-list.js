'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';

import LoadingData from '../ui/loading-data';
import EventListItem from './event-list-item';
import { rubikFont } from '@/theme/fonts';
import { applyEventFilters } from '@/lib/events/index';
import styles from './event-list.module.css';

const EventList = ({
  events = [],
  selectedEvent,
  onEventSelect,
  filters,
  headerRef,
}) => {
  const listRef = useRef(null);
  const itemRefs = useRef(new Map());

  const filteredEvents = useMemo(() => {
    return applyEventFilters(events, filters);
  }, [events, filters]);

  const grouped = useMemo(() => {
    return groupEventsByRange(filteredEvents);
  }, [filteredEvents]);

  const selectedSlug = selectedEvent?.slug || null;

  const eventBySlug = useMemo(() => {
    const map = new Map();
    for (const e of filteredEvents) {
      if (e?.slug) map.set(e.slug, e);
    }
    return map;
  }, [filteredEvents]);

  const handleSelectSlug = (slug) => {
    if (selectedSlug === slug) {
      onEventSelect?.(null);
      return;
    }

    const ev = eventBySlug.get(slug);
    if (!ev) return;

    onEventSelect?.(ev);
  };

  const [pendingScrollSlug, setPendingScrollSlug] = useState(null);

  const handleItemExpanded = (slug) => {
    if (!slug || slug !== selectedSlug) return;
    setPendingScrollSlug(slug);
  };

  useEffect(() => {
    if (!pendingScrollSlug) return;

    const container = listRef.current;
    const item = itemRefs.current.get(pendingScrollSlug);
    if (!container || !item) {
      setPendingScrollSlug(null);
      return;
    }

    const headerHeight =
      headerRef?.current?.getBoundingClientRect().height ?? 0;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const currentScrollTop = container.scrollTop;
    const offsetTopWithinContainer =
      (itemRect.top - containerRect.top) + currentScrollTop;

    const gap = 25;
    const targetTop = Math.max(0, offsetTopWithinContainer - headerHeight - gap);

    container.scrollTo({ top: targetTop, behavior: 'smooth' });

    setPendingScrollSlug(null);
  }, [pendingScrollSlug, headerRef]);

  const emptyMessage = getEmptyMessage(filters);

  if (!events || events.length === 0) {
    return <LoadingData dataName={'events'} />;
  }

  return (
    <div className={styles.container} ref={listRef}>
      {filteredEvents.length > 0 ? (
        <ul className={styles.event_list}>
          {grouped.map((block) => (
            <li key={block.key} className={styles.group_block}>
              <div className={styles.group_inner}>
                <div className={`${styles.group_heading} ${rubikFont.className}`}>
                  {block.label}
                </div>

                <ul className={styles.group_list}>
                  {block.items.map((event) => (
                    <li
                      key={event.id || event.slug}
                      ref={(node) => {
                        if (!node) return;
                        itemRefs.current.set(event.slug, node);
                      }}
                      className={styles.item_wrap}
                    >
                      <EventListItem
                        event={event}
                        isSelected={selectedSlug === event.slug}
                        onClick={() => handleSelectSlug(event.slug)}
                        onExpanded={handleItemExpanded}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty_state}>
          <p className={`${rubikFont.className} ${styles.empty_state_desc}`}>
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;

/* --- grouping + empty message --- */

function groupEventsByRange(events) {
  const now = dayjs();
  const weekEnd = now.endOf('week');
  const monthEnd = now.endOf('month');

  const nextMonthStart = now.add(1, 'month').startOf('month');
  const nextMonthEnd = now.add(1, 'month').endOf('month');

  const buckets = [
    { key: 'thisWeek', label: 'This week', items: [] },
    { key: 'thisMonth', label: 'This month', items: [] },
    { key: 'nextMonth', label: 'Next month', items: [] },
    { key: 'beyond', label: 'Beyond', items: [] },
  ];

  for (const e of events) {
    const d = dayjs(e.start_time);

    if (d.isBefore(weekEnd, 'day') || d.isSame(weekEnd, 'day')) {
      buckets[0].items.push(e);
      continue;
    }

    if (d.isBefore(monthEnd, 'day') || d.isSame(monthEnd, 'day')) {
      buckets[1].items.push(e);
      continue;
    }

    if (
      (d.isAfter(nextMonthStart) || d.isSame(nextMonthStart, 'day')) &&
      (d.isBefore(nextMonthEnd) || d.isSame(nextMonthEnd, 'day'))
    ) {
      buckets[2].items.push(e);
      continue;
    }

    buckets[3].items.push(e);
  }

  return buckets.filter((b) => b.items.length > 0);
}

function getEmptyMessage(filters) {
  const parts = [];

  if (filters?.time === 'next') parts.push('for the next event');
  else if (filters?.time === 'thisMonth') parts.push('for this month');
  else if (filters?.time === 'nextMonth') parts.push('for next month');

  if (filters?.type === 'weekly') parts.push('in weekly events');
  else if (filters?.type === 'one_off') parts.push('in one-off events');

  if (filters?.price === 'free') parts.push('that are free');

  if (parts.length === 0) return 'Try adjusting your filters.';
  return `Nothing found ${parts.join(' ')}.`;
}