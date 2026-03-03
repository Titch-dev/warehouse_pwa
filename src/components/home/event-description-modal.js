'use client'

import { rubikFont } from '@/lib/fonts';
import styles from './event-description-modal.module.css';
import CloseSVG from '../assets/icons/close-svg';

import TicketButton from '../events/ticket-button';
import SmartImage from '../ui/smart-image';
import { formatEventDate, formatEventTime, formatPriceDisplay } from '@/lib/utils';

import CalendarSVG from '../assets/icons/calendar-svg';
import ClockSVG from '../assets/icons/clock-svg';
import MoneySVG from '../assets/icons/money-svg';
import ShareSVG from '../assets/icons/share-svg';
import ShareButton from '../ui/share-button';

function EventDescriptionModal({ event, onClose }) {

  return (
      <div
        className={styles.wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.close_container}>
            <button
            className={styles.close_button}
            onClick={onClose}
            aria-label="Close"> 
                <CloseSVG className={styles.close_svg}/>
            </button>
        </div>
        <div className={styles.header}>
          <div className={styles.event_image_wrapper}>
                <div className={styles.backdrop_wrap} aria-hidden="true">
                    <SmartImage
                    image={event.image}
                    alt=""
                    fit="cover"
                    className={styles.backdrop_image}
                    priority={false}
                    />
                </div>
                <SmartImage 
                    image={event.image}
                    alt={event?.image?.alt || event?.name || 'Event'}
                    fit='contain'
                    className={styles.foreground_image}
                />
          </div>
          <div className={styles.header_content}>
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
                      <ShareSVG className={styles.icon} />
                      <p>Share</p>
                    </ShareButton>
                </div>
                <h3 className={`${rubikFont.className} ${styles.header_title}`}>
              {event.name}
            </h3>
            </div>
          </div>
        </div>
        {event.ticket_url && (
          <div className={styles.button_wrapper}>
            <TicketButton link={event.ticket_url}/>
          </div>
          )}
        <p className={styles.description}>
          
          {event.description}
        </p>
      </div>
  )
}

export default EventDescriptionModal;