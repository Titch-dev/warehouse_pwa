"use client"

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";


import Chevron from "@/components/assets/icons/chevron-svg";

import { galleryList } from "@/data/synthetic-data";

import PaintStrokeSVG from '@/components/assets/patterns/paint-stroke-svg';

import TornBorder from "@/components/assets/patterns/torn-border";

import styles from "./gallery-page.module.css";
import { rubikFont } from "@/lib/fonts";
import { colors } from "@/lib/colors";



export default function GalleryPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailRefs = useRef([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi]);

  const onThumbnailClick = useCallback((index) =>{
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    console.log(window.screenY);

  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi)
    emblaApi.on('select', onSelect).on('reInit', onSelect)
  
  }, [emblaApi, onSelect]);

  return (
    <div className={styles.gallery_wrapper}>
      <h1 className={`${styles.title} ${rubikFont.className}`}>Gallery</h1>     
      <section className={styles.viewing_section}>
        <button onClick={scrollPrev} className={styles.btn}>
          <Chevron direction="left" />
        </button>
        <PaintStrokeSVG className={styles.viewing_bg}>
          <linearGradient id="Gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
            </linearGradient>
        </PaintStrokeSVG>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={styles.embla__container}>
            {galleryList.map((image) => (
              <div key={image.id} className={styles.embla__slide}>
                <Image className={styles.image} src={image.src} width={300} height={300} />
              </div>
            ))}
          </div>
        </div> 
        <button onClick={scrollNext} className={styles.btn}>
          <Chevron direction="right" />
        </button>
        <TornBorder top={false} color={colors.greydark1}/>
      </section>
      <section className={styles.gallery_section}>
        <div className={styles.gallery}>
        { galleryList.map((image, index) => (
          <figure 
            key={image.id}
            ref={el => thumbnailRefs.current[index] = el}
            onClick={() => onThumbnailClick(index)} 
            className={
              `${styles[`thumbnail_${image.id}`]} 
              ${index === selectedIndex 
                ? styles.selected 
                : ""
              }`}
          >
            <img src={image.src} />
          </figure>
        ))}
        </div>
      </section>
    </div>
  )
}
