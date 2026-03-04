'use client'

import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './gallery-modal.module.css'
import CloseSVG from '../assets/icons/close-svg'
import SmartImage from '../ui/smart-image'

function GalleryModal({ imagesCollection, activeIndex, onClose }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const isOpen = activeIndex !== null

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
          {imagesCollection.map(img => (
            <div className={styles.emblaSlide} key={img.id}>
              <SmartImage
              image={img.image}
              alt={img.image.alt}
              fit='contain'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GalleryModal
