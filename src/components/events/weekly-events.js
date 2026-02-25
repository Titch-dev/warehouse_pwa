import { useEffect, useMemo, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

// import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { orderByClosestDay } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";

import LoadingData from "../loading-data";
import WeeklyEventsItem from "./weekly-events-item";

import styles from './weekly-events.module.css'
import ChevronLeft from "../assets/icons/chevron-left-svg";
import ChevronRight from "../assets/icons/chevron-right-svg";

import { weekly_events } from "@/data/synthetic-data";

function WeeklyEvents() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isMobile = useMediaQuery('(max-width: 768px)');
    // const { 
    //     data: weeklyEventsData, 
    //     loading, 
    //     error
    // } = useFirestoreCollection('eventsWeekly', 'eventsWeekly')

    const weeklyEventsData = weekly_events.data;

    
    const orderedWeeklyEvents = useMemo(
        () => orderByClosestDay(weeklyEventsData),
        [weeklyEventsData]
    )

    useEffect(() => {
        if (!emblaApi || !orderedWeeklyEvents.length) return
        emblaApi.reInit()
        emblaApi.scrollTo(0, true)
        setSelectedIndex(0)
    }, [emblaApi, orderedWeeklyEvents])

    useEffect(() => {
        if (!emblaApi || !weeklyEventsData?.length) return
        emblaApi.reInit()
    }, [emblaApi, weeklyEventsData?.length])


    const onSelect = useCallback(api => {
        setSelectedIndex(api.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    // if (loading) return (
    //     <div className={styles.loading_wrapper}>
    //         <LoadingData dataName={'Weekly events'}/>
    //     </div>
    // )

    const isFirstEvent = selectedIndex === 0
    const isLastEvent = selectedIndex === orderedWeeklyEvents.length - 1

  return (
    <div className={styles.wrapper}>
        <button 
          className={styles.btn}
          onClick={() => emblaApi?.scrollPrev()}
          disabled={isFirstEvent}
        >
            <ChevronLeft className={styles.btn_icon}>
                <linearGradient id="Gradient" x2="0" y2="1">
                    <stop className={styles.stop1} offset="0%" />
                    <stop className={styles.stop2} offset="50%" />
                    <stop className={styles.stop3} offset="100%" />
                </linearGradient>
            </ChevronLeft>
        </button>
        <div className={styles.embla__viewport} ref={emblaRef}>
            <div className={styles.embla__container}>
                {orderedWeeklyEvents.map((event) => (
                    <div 
                        key={event.id} 
                        className={styles.embla__slide}
                    >
                        <WeeklyEventsItem item={event}/>
                    </div>
                ))}
            </div>
        </div>
        <button 
          className={styles.btn}
          onClick={() => emblaApi?.scrollNext()}
          disabled={isLastEvent}
        >
            <ChevronRight className={styles.btn_icon}>
                <linearGradient id="Gradient" x2="0" y2="1">
                    <stop className={styles.stop1} offset="0%" />
                    <stop className={styles.stop2} offset="50%" />
                    <stop className={styles.stop3} offset="100%" />
                </linearGradient>
            </ChevronRight>
        </button>

        {isMobile && 
        <div className={styles.embla__dots}>
            {orderedWeeklyEvents.map((_, i) => (
                <div 
                    key={i} 
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={
                        `${styles.embla__dot} 
                        ${i === selectedIndex 
                        ? styles.embla__dot_selected 
                        : ''}`
                    }>
                </div>
            ))}
        </div>
        }
        
    </div>
  )
}

export default WeeklyEvents