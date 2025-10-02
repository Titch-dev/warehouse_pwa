'use client'

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import SpecialsItem from "./specials-item";

import styles from "./specials-carousel.module.css";
import { rubikFont } from "@/lib/fonts";
import ChevronLeft from "@/components/assets/icons/chevron-left-svg";
import ChevronRight from "../assets/icons/chevron-right-svg";


export default function SpecialsCarousel({ title, specials }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0); 

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);
    
    const scrollNext = useCallback(() => {    
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi]);

    const onDotButtonClick = useCallback(
        (index) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index)
        },
        [emblaApi]
    )

    const onSelect = useCallback((emblaApi) => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)

    }, [emblaApi, onSelect]);

  return (
    <div className={styles.wrapper}>
        <h1 className={`${styles.title} ${rubikFont.className}`}>{title}</h1>
        <div className={styles.embla} >
            <button className={styles.btn} onClick={scrollPrev}>
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
                    {specials.map((special) => (
                        <div key={special.id} className={styles.embla__slide}>
                            <SpecialsItem item={special}/>
                        </div>
                    ))}
                </div>
            </div>
            <button className={styles.btn} onClick={scrollNext}>
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
                {specials.map((_, index) => (
                    <div 
                        key={index} 
                        onClick={() => onDotButtonClick(index)}
                        className={
                            `${styles.embla__dot} 
                            ${index === selectedIndex 
                            ? styles.embla__dot_selected 
                            : ''}`
                        }>
                    </div>
                ))}
        </div>
    </div>
   
  )
}
