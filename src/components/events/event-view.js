'use client'

import { useState, useEffect, useCallback } from 'react';
import EventDescriptionModal from './event-description-modal';
import LoadingData from '../loading-data';
import useMediaQuery from '@/hooks/useMediaQuery';

import styles from './event-view.module.css';
import { rubikFont } from '@/lib/fonts';
import EventIcons from './event-icons';
import { getNextEvent } from '@/lib/utils';
import TicketButton from './ticket-button';
import ModalPortal from '../modal-portal';

const EventView = ({ selectedEvent, events }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
  }, [selectedEvent, events])

  const currentEvent = selectedEvent || getNextEvent(events);

  if (!events || events.length === 0) {
    return (
      <div className={styles.loading_skeleton}>
        <LoadingData dataName={'next event'}/>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      // create element if no events
      null
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.event_content}>
          <div className={styles.event_image_wrapper}>
            <img 
            className={styles.event_image}
            src={currentEvent.imageUrl}
            alt={currentEvent.alt_image || currentEvent.name}/>
          </div>
          <h3 className={`${rubikFont.className} ${styles.event_title}`}>
            {currentEvent.name}
          </h3>
          <div className={styles.icon_wrapper}>
            <EventIcons
              column={!isMobile}
              date={currentEvent.start_time} 
              prices={currentEvent.prices} 
              start={currentEvent.start_time} 
              end={currentEvent.end_time}
            />
          </div>
            {currentEvent.ticketUrl && (
              <div className={styles.ticket_wrapper}>
                <TicketButton link={currentEvent.ticketUrl}/>
              </div>
            )}
          <p 
            className={`
              ${styles.event_desc}
              ${currentEvent.ticketUrl 
                ? styles.shortened_desc
                : ''
              }`}>
            {currentEvent.description}
          </p>

          <button
            className={styles.see_more}
            onClick={() => setIsModalOpen(true)}
          >
            ... see details
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ModalPortal onClose={() => setIsModalOpen(false)}>
          <EventDescriptionModal
            event={currentEvent}
            onClose={() => setIsModalOpen(false)}
          />
        </ModalPortal>
      )}
    </>
    
  );
};

export default EventView;