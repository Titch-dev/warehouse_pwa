'use client';

import { useId } from 'react';

import styles from './chevron-svg.module.css';

import ChevronLeftSVG from './chevron-left-svg';
import ChevronRightSVG from './chevron-right-svg';
import ChevronDownSVG from './chevron-down-svg';
import ChevronUpSVG from './chevron-up-svg';

export default function Chevron({ direction = 'right', className = '' }) {
  const gradientId = useId();

  const ChevronComponent =
    direction === 'left'
      ? ChevronLeftSVG
      : direction === 'up'
      ? ChevronUpSVG
      : direction === 'down'
      ? ChevronDownSVG
      : ChevronRightSVG;

  return (
    <ChevronComponent
      className={`${styles.chevron} ${className}`}
      gradientId={gradientId}
    >
      <linearGradient id={gradientId} x2="0" y2="1">
        <stop className={styles.stop1} offset="0%" />
        <stop className={styles.stop2} offset="50%" />
        <stop className={styles.stop3} offset="100%" />
      </linearGradient>
    </ChevronComponent>
  );
}