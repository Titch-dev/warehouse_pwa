'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import MenuCategoryItem from './menu-category-item';
import ExtrasBlock from './extras-block';
import styles from './menu-category-content.module.css';
import { getLowestPrice } from '@/lib/menu/index';

import SpecialsCarousel from '../specials/specials-carousel';

function NoticeBanner({ notice, onClose, isClosed }) {
  if (!notice) return null;

  return (
    <div
      className={`${styles.notice} ${isClosed ? styles.noticeClosed : styles.noticeOpen}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.noticeInner}>
        <div 
            className={styles.notice_grid}
            style={{'--col': notice.messages.length}}>
            {notice.messages.map((message, idx) => (
                <p key={idx} className={styles.noticeMessage}>{message}</p>
            ))}
        </div>

        <button className={styles.noticeClose} onClick={onClose} aria-label="Close notice">
          ×
        </button>
      </div>
    </div>
  );
}

export default function MenuCategoryContent({
  category,
  categoryData,
  extras = [],
  notices = [],
  specials = [],
  specialsError = null,
}) {
  const containerRef = useRef(null);
  const [noticeClosed, setNoticeClosed] = useState(false);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
    setNoticeClosed(false);
  }, [category]);

  const sortedData = useMemo(() => {
    return [...(categoryData || [])].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
  }, [categoryData]);

  const matchingExtras = useMemo(() => {
    return (extras || []).filter(doc => (Array.isArray(doc.appliesTo) ? doc.appliesTo : []).includes(category));
  }, [extras, category]);

  const matchingNotice = useMemo(() => {
    return (notices || []).find(doc =>
      doc?.isActive !== false &&
      (Array.isArray(doc.appliesTo) ? doc.appliesTo : []).includes(category)
    );
  }, [notices, category]);

  if (category === 'specials') {
    return (
      <main ref={containerRef} className={styles.specials_wrapper}>
        {specialsError && <p>Error loading specials</p>}
        <SpecialsCarousel items={specials}/>
      </main>
    );
  }

  return (
    <main ref={containerRef} className={styles.items_scroll_wrapper}>
      <NoticeBanner
        notice={matchingNotice}
        isClosed={noticeClosed}
        onClose={() => setNoticeClosed(true)}
      />

      <ul className={styles.category_item_list}>
        {sortedData.map(item => (
          <MenuCategoryItem key={item.id} item={item} />
        ))}
      </ul>

      {matchingExtras.length > 0 && (
        <section className={styles.extras_section}>
          {matchingExtras.map(extraDoc => (
            <ExtrasBlock key={extraDoc.id} extra={extraDoc} />
          ))}
        </section>
      )}
    </main>
  );
}