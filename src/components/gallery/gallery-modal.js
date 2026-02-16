'use client'

import Image from 'next/image'
import { useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './gallery-modal.module.css'
import { getStorageImageUrl } from '@/lib/utils'
import CloseSVG from '../assets/icons/close-svg'
// import { getStorageImageUrl } from '@/lib/utils'

function GalleryModal({ imagesCollection, loading, activeIndex, onClose }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const isOpen = activeIndex !== null

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  // Jump to the clicked thumbnail when modal opens
  useEffect(() => {
    if (!emblaApi || activeIndex === null) return
    emblaApi.scrollTo(activeIndex, true)
  }, [emblaApi, activeIndex])

  if (!isOpen) return null

  return (
    <div className={styles.wrapper}>
     <div className={styles.close_container}>
            <button
            className={styles.close_button}
            onClick={onClose}
            aria-label="Close"> 
                <CloseSVG className={styles.close_svg}/>
            </button>
        </div>

      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {loading && 
            <Image
              src={'./icons/ww_logo.png'}
              width={50}
              height={50}
              />
          }
          {imagesCollection.map(img => (
            <div className={styles.emblaSlide} key={img.id}>
              <Image
                // src={getStorageImageUrl(img.imagePath)}
                src={getStorageImageUrl(img.imagePath)}
                alt=""
                fill
                sizes="100vw"
                className={styles.modalImage}
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} className={styles.prev}>‹</button>
      <button onClick={scrollNext} className={styles.next}>›</button>
    </div>
  )
}

export default GalleryModal
