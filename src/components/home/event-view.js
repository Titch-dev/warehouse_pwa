'use client'

import { useState } from 'react';
import EventDescriptionModal from './event-description-modal';
import LoadingData from '../ui/loading-data';
import useMediaQuery from '@/hooks/useMediaQuery';

import styles from './event-view.module.css';
import { rubikFont } from '@/theme/fonts';
import EventIcons from './event-icons';
import ModalPortal from '../ui/modal-portal';
import SmartImage from '../ui/smart-image';

const EventView = ({ event, loading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (loading) {
      return (
          <div className={styles.loading_skeleton}>
              <LoadingData dataName={' event'}/>
          </div>
      );
  }
  
  if (!event) return null;
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.event_content}>
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
          <h3 
            className={`
              ${rubikFont.className} 
              ${styles.event_title} 
              ${event.ticket_url ?
                styles.ticket_title : ''}
            `}>
            {event.name}
          </h3>
          <div className={styles.icon_wrapper}>
            <EventIcons
              column={!isMobile}
              date={event.start_time} 
              price={event.price} 
              start={event.start_time} 
              end={event.end_time}
            />
          </div>
          <p 
            className=
              {styles.event_desc}
          >
            {event.description}
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
            event={event}
            onClose={() => setIsModalOpen(false)}
          />
        </ModalPortal>
      )}
    </>
    
  );
};

export default EventView;