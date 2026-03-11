'use client';

import styles from './event-filter.module.css';
import { rubikFont } from '@/theme/fonts';

export default function EventFilter({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className={styles.content}>
      <div className={styles.group}>
        <div className={`${styles.groupTitle} ${rubikFont.className}`}>When</div>
        <div className={styles.chips}>
          <Chip active={value.time === 'all'} onClick={() => set({ time: 'all' })}>All</Chip>
          <Chip active={value.time === 'next'} onClick={() => set({ time: 'next' })}>Next event</Chip>
          <Chip active={value.time === 'thisMonth'} onClick={() => set({ time: 'thisMonth' })}>This month</Chip>
          <Chip active={value.time === 'nextMonth'} onClick={() => set({ time: 'nextMonth' })}>Next month</Chip>
        </div>
      </div>

      <div className={styles.group}>
        <div className={`${styles.groupTitle} ${rubikFont.className}`}>Type</div>
        <div className={styles.chips}>
          <Chip active={value.type === 'all'} onClick={() => set({ type: 'all' })}>All</Chip>
          <Chip active={value.type === 'one_off'} onClick={() => set({ type: 'one_off' })}>One-off</Chip>
          <Chip active={value.type === 'weekly'} onClick={() => set({ type: 'weekly' })}>Weekly</Chip>
        </div>
      </div>

      <div className={styles.group}>
        <div className={`${styles.groupTitle} ${rubikFont.className}`}>Price</div>
        <div className={styles.chips}>
          <Chip active={value.price === 'all'} onClick={() => set({ price: 'all' })}>All</Chip>
          <Chip active={value.price === 'free'} onClick={() => set({ price: 'free' })}>Free</Chip>
        </div>
      </div>

      <button
        type="button"
        className={styles.reset}
        onClick={() => onChange({ time: 'all', type: 'all', price: 'all' })}
      >
        Reset
      </button>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.chip_active : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}