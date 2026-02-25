'use client'

import { useCallback, useEffect, useState, useMemo } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

import SpecialsItem from "./specials-item";

import { orderByClosestDay } from "@/lib/utils";

import styles from "./specials-carousel.module.css";
import ChevronLeft from "@/components/assets/icons/chevron-left-svg";
import ChevronRight from "../assets/icons/chevron-right-svg";
import LoadingData from "../loading-data";


export default function SpecialsCarousel({ specials, metaRef }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { 
        data: specialsData, 
        loading, 
        error
    } = useFirestoreCollection(specials, metaRef)

    const orderedSpecials = useMemo(
        () => orderByClosestDay(specialsData),
        [specialsData]
    )

    useEffect(() => {
        if (!emblaApi || !orderedSpecials.length) return
        emblaApi.reInit()
        emblaApi.scrollTo(0, true)
        setSelectedIndex(0)
    }, [emblaApi, orderedSpecials])

    useEffect(() => {
        if (!emblaApi || !specialsData?.length) return
        emblaApi.reInit()
    }, [emblaApi, specialsData?.length])


    const onSelect = useCallback(api => {
        setSelectedIndex(api.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    if (loading) return (
        <div className={styles.loading_wrapper}>
            <LoadingData/>
        </div>
    )
    if (error || !specials?.length) return null

    const isFirstSpecial = selectedIndex === 0
    const isLastSpecial = selectedIndex === orderedSpecials.length - 1
  
    return (
        <div className={styles.wrapper}>
            <div className={styles.embla} >
                <button 
                    className={styles.btn} 
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={isFirstSpecial}>
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
                        {orderedSpecials.map((special) => (
                            <div 
                                key={special.id} 
                                className={styles.embla__slide}
                            >
                                <SpecialsItem item={special}/>
                            </div>
                        ))}
                    </div>
                </div>
                <button 
                    className={styles.btn} 
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={isLastSpecial}
                >
                    <ChevronRight className={styles.btn_icon}>
                        <linearGradient id="Gradient" x2="0" y2="1">
                            <stop className={styles.stop1} offset="0%" />
                            <stop className={styles.stop2} offset="50%" />
                            <stop className={styles.stop3} offset="100%" />
                        </linearGradient>
                    </ChevronRight>
                </button>
            </div>
            <div className={styles.embla__dots}>
                    {orderedSpecials.map((_, i) => (
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
        </div>
    )
}
