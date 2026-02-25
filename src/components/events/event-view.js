'use client'

import { useState, useEffect } from 'react';
import EventDescriptionModal from './event-description-modal';
import LoadingData from '../loading-data';
import useMediaQuery from '@/hooks/useMediaQuery';

import styles from './event-view.module.css';
import { rubikFont } from '@/lib/fonts';
import EventIcons from './event-icons';
import { getNextEvent, resolveImageUrl } from '@/lib/utils';
import TicketButton from './ticket-button';
import ModalPortal from '../modal-portal';
import SmartImage from '../ui/smart-image';

const EventView = ({ selectedEvent, events }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)');
  const currentEvent = selectedEvent || getNextEvent(events);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!currentEvent?.image) return;

    let isMounted = true;

    async function loadImage() {
      setImageLoading(true);

      const url = await resolveImageUrl(currentEvent.image);
      if (isMounted) {
        setImageUrl(url);
        setImageLoading(false);
      }
    }

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [currentEvent]);

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
  console.log(currentEvent.image)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.event_content}>
          <div className={styles.event_image_wrapper}>
            <SmartImage
              image={currentEvent.image}
              alt={currentEvent.image.alt}
              fit='cover'
            />
          </div>
          <h3 
            className={`
              ${rubikFont.className} 
              ${styles.event_title} 
              ${currentEvent.ticket_url ?
                styles.ticket_title : ''}
            `}>
            {currentEvent.name}
          </h3>
          <div className={styles.icon_wrapper}>
            <EventIcons
              column={!isMobile}
              date={currentEvent.start_time} 
              price={currentEvent.price} 
              start={currentEvent.start_time} 
              end={currentEvent.end_time}
            />
          </div>
            {currentEvent.ticket_url && (
              <div className={styles.ticket_wrapper}>
                <TicketButton link={currentEvent.ticket_url}/>
              </div>
            )}
          <p 
            className={`
              ${styles.event_desc}
              ${currentEvent.ticket_url 
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