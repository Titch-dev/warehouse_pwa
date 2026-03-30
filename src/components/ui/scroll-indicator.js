'use client'

import { useEffect, useState } from 'react';
import styles from './scroll-indicator.module.css';
import Chevron from '../assets/icons/chevron-svg';

function ScrollIndicator({ scrollRef, className = '' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;

    const updateVisibility = () => {
      const hasOverflow = el.scrollHeight > el.clientHeight + 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
      setVisible(hasOverflow && !atBottom);
    };

    updateVisibility();
    el.addEventListener('scroll', updateVisibility);
    window.addEventListener('resize', updateVisibility);

    return () => {
      el.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [scrollRef]);

  return (
    <div
      className={`${styles.indicator} ${className}`}
      data-visible={visible ? 'true' : 'false'}
      aria-hidden="true"
    >
      <Chevron className={styles.icon} direction='down'/>
    </div>
  );
}

export default ScrollIndicator;