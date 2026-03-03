import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import SmartImage from '../ui/smart-image';
import TicketButton from './ticket-button';
import ShareButton from '../ui/share-button';

import { formatEventDate, formatEventTime, formatPriceDisplay } from '@/lib/utils';

import styles from './event-list-item.module.css';
import { rubikFont } from '@/lib/fonts';

import CalendarSVG from '../assets/icons/calendar-svg';
import ClockSVG from '../assets/icons/clock-svg';
import MoneySVG from '../assets/icons/money-svg';
import ShareSVG from '../assets/icons/share-svg';

export default function ListItem({ event, isSelected, onClick, onExpanded }) {
  const contentRef = useRef(null);

  const COLLAPSED = 120;
  const [height, setHeight] = useState(COLLAPSED);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (!isSelected) {
      setHeight(COLLAPSED);
      return;
    }

    // measure once on open
    setHeight(el.scrollHeight);
  }, [isSelected]);

  useEffect(() => {
    if (!isSelected) return;
    const el = contentRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setHeight(el.scrollHeight);
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, [isSelected]);

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== 'height') return;
    if (!isSelected) return;

    onExpanded?.(event.slug);
  };

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      aria-expanded={isSelected}
      style={{ height }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.collapsed} aria-hidden={isSelected}>
        <div className={styles.collapsedImage}>
          <SmartImage
            image={event.image}
            alt={event?.image?.alt || event?.name || 'Event'}
            fit="cover"
            className={styles.collapsedImgFill}
          />
        </div>

        <div className={styles.shroud} />

        <div className={styles.collapsedContentWrapper}>
          <h2 className={`${styles.collapsedTitle} ${rubikFont.className}`}>
            {event?.name || 'Event Title'}
          </h2>
          <div className={styles.collapsedContentEnd}>
            <div className={styles.collapsedIconContainer}>
              <CalendarSVG
                  className={styles.icon}
              />
              <p>{formatEventDate(event.start_time)}</p>
            </div>
            <div className={styles.chevron} aria-hidden="true">▾</div>
          </div>
        </div>
      </div>
      

      <div ref={contentRef} className={styles.content}>
        <div className={`${styles.expanded} ${isSelected ? styles.expandedOn : ''}`}>
          <div className={styles.expandedTop}>
            <div className={styles.imageWrapper}>
                <div className={styles.imageBackdrop} aria-hidden="true">
                    <SmartImage
                    image={event.image}
                    alt=""
                    fit="cover"
                    className={styles.backdropImg}
                    priority={false}
                    />
                </div>
                <SmartImage 
                    image={event.image}
                    alt={event?.image?.alt || event?.name || 'Event'}
                    fit='contain'
                    className={styles.foregroundImg}
                />
            </div>

            <div className={styles.metaContainer}>
                <div className={styles.metaInfo}>
                    <div className={styles.iconContainer}>
                        <CalendarSVG
                            className={styles.icon}
                        />
                        <p>{formatEventDate(event.start_time)}</p>
                    </div>
                    <div className={styles.iconContainer}>
                        <ClockSVG
                            className={styles.icon}
                        />
                        <p>{formatEventTime(event.start_time, event.end_time)}</p>
                    </div>
                    <div className={styles.iconContainer}>
                        <MoneySVG
                            className={styles.icon}
                        />
                        <p>{formatPriceDisplay(event.price)}</p>
                    </div>
                        <ShareButton
                          event={event}
                          className={`${styles.iconContainer} ${styles.share}`}
                        >
                          <ShareSVG className={styles.icon}>
                            <linearGradient id="Gradient1" x2="0" y2="1">
                              <stop className={styles.stop1} offset="0%" />
                              <stop className={styles.stop2} offset="50%" />
                              <stop className={styles.stop3} offset="100%" />
                            </linearGradient>
                          </ShareSVG>
                          <p>Share</p>
                        </ShareButton>
                </div>
                
            </div>
            <h2 className={`
                ${styles.title}
                ${rubikFont.className}
                `}>
                {event.name}
            </h2>
            {event.ticket_url && (
                    <div 
                        className={styles.ticketWrapper}
                        onClick={(e)=>e.stopPropagation()}
                    >
                        <TicketButton link={event.ticket_url}/>
                    </div>
                )}
            <p className={styles.description}>
                {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}