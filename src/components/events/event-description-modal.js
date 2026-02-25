'use client'

import EventIcons from './event-icons';

import { rubikFont } from '@/lib/fonts';
import styles from './event-description-modal.module.css';
import CloseSVG from '../assets/icons/close-svg';
import TornBorder from '../assets/patterns/torn-border';
import { colors } from '@/lib/colors';
import TicketButton from './ticket-button';

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
            
          <img 
            className={styles.header_image}
            src={event.imageUrl}
            alt={event.alt_image || event.name}/>
          <div className={styles.header_content}>
            <TornBorder color={colors.greydark1} top={true}/>
            <h3 className={`${rubikFont.className} ${styles.header_title}`}>
              {event.name}
            </h3>
            <div className={styles.icon_container}>
                <EventIcons
                  column={false}
                  date={event.start_time} 
                  prices={event.prices} 
                  start={event.start_time} 
                  end={event.end_time}
                />
            </div>
          </div>
        </div>
        {event.ticketUrl && (
          <div className={styles.button_wrapper}>
            <TicketButton link={event.ticketUrl}/>
          </div>
          )}
        <p className={styles.description}>
          
          {event.description}
        </p>
      </div>
  )
}

export default EventDescriptionModal;