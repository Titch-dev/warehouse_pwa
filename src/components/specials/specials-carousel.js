'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import SpecialsItem from './specials-item';
import { orderByClosestDay } from '@/lib/venue/index';

import styles from './specials-carousel.module.css';
import ChevronLeft from '@/components/assets/icons/chevron-left-svg';
import ChevronRight from '../assets/icons/chevron-right-svg';

export default function SpecialsCarousel({ items = [] }) {
  const directionRef = useRef(1);
  const intervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const orderedSpecials = useMemo(
    () => orderByClosestDay(items || []),
    [items]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);

      const last = emblaApi.scrollSnapList().length - 1;

      if (index === last) directionRef.current = -1;
      if (index === 0) directionRef.current = 1;
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const startAutoplay = useCallback(() => {
    if (!emblaApi) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const last = emblaApi.scrollSnapList().length - 1;
      const current = emblaApi.selectedScrollSnap();

      if (current === last) directionRef.current = -1;
      if (current === 0) directionRef.current = 1;

      if (directionRef.current === 1) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    }, 4000);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  const pauseAutoplay = useCallback(() => {
    stopAutoplay();
    clearTimeout(resumeTimeoutRef.current);

    resumeTimeoutRef.current = setTimeout(() => {
      startAutoplay();
    }, 10000);
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi || !orderedSpecials.length) return;

    startAutoplay();

    return () => {
      stopAutoplay();
      clearTimeout(resumeTimeoutRef.current);
    };
  }, [emblaApi, orderedSpecials.length, startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
    setSelectedIndex(0);
  }, [emblaApi, orderedSpecials.length]);

  if (!orderedSpecials.length) return null;

  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === orderedSpecials.length - 1;

  return (
    <div className={styles.wrapper}>
      <div className={styles.embla}>
        <button
          className={styles.btn}
          onClick={() => {
            emblaApi?.scrollPrev();
            pauseAutoplay();
          }}
          disabled={isFirst}
        >
          <ChevronLeft className={styles.btn_icon} />
        </button>

        <div
          className={styles.embla__viewport}
          ref={emblaRef}
          onMouseEnter={pauseAutoplay}
          onTouchStart={pauseAutoplay}
        >
          <div className={styles.embla__container}>
            {orderedSpecials.map((special) => (
              <div key={special.id || special.slug} className={styles.embla__slide}>
                <SpecialsItem item={special} />
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.btn}
          onClick={() => {
            emblaApi?.scrollNext();
            pauseAutoplay();
          }}
          disabled={isLast}
        >
          <ChevronRight className={styles.btn_icon}>
            <linearGradient id="GradientSpecials" x2="0" y2="1">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
            </linearGradient>
          </ChevronRight>
        </button>
      </div>

      <div className={styles.embla__dots}>
        {orderedSpecials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              emblaApi?.scrollTo(i);
              pauseAutoplay();
            }}
            className={`${styles.embla__dot} ${
              i === selectedIndex ? styles.embla__dot_selected : ''
            }`}
          />
        ))}
      </div>
      
    </div>
  );
}