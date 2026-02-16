import ThumbnailSlot from './thumbnail-slot';
import Chevron from '../assets/icons/chevron-svg';
import styles from './thumbnail-strip.module.css';
import PaintStrokeSVG from '../assets/patterns/paint-stroke-svg';

const MIN_SLOTS = 8;

function ThumbnailStrip({ 
  imagesCollection = [],
  loading,
  openModal,
  page,
  totalPages,
  onPrev,
  onNext,
  onSetPage,
  isDesktop
}) {
  if (!Array.isArray(imagesCollection)) return null;

    const slotCount = loading
        ? Math.max(MIN_SLOTS, imagesCollection.length)
        : imagesCollection.length;
    const slots = Array.from({ length: slotCount });

  const isFirstPage = page <= 0;
  const isLastPage = page >= totalPages - 1;

  return (
    <div className={styles.strip_outer}>
        <div className={styles.thumbnail_strip_wrapper}>
            
            {isDesktop && 
                <PaintStrokeSVG 
                    className={styles.thumbnail_background}
                    aria-hidden>
                    <linearGradient id="Gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop className={styles.stop1} offset="0%" />
                        <stop className={styles.stop2} offset="50%" />
                        <stop className={styles.stop3} offset="100%" />
                    </linearGradient>
                </PaintStrokeSVG>
            }

            {isDesktop && (
            <button
            className={`${styles.chevron} ${styles.left}`}
            onClick={() => {
                if (!isFirstPage) onPrev();
            }}
            disabled={isFirstPage}
            >
            <Chevron direction="left" />
            </button>
            )}
            
            <section className={styles.galleryStrip}>
            {slots.map((_, index) => {
                const img = imagesCollection[index];

                return (
                <ThumbnailSlot
                    key={img?.id ?? index}
                    img={img}
                    index={index}
                    openModal={openModal}
                />
                );
            })}
            </section>
            {isDesktop && (
            <button
                className={styles.chevron}
                onClick={() => {
                    if (!isLastPage) onNext();
                }}
                disabled={isLastPage}
                >
                <Chevron />
                </button>
            )}
        </div>
        {/* Dots */}
        <div className={styles.dots}>
            {Array.from({ length: totalPages }).map((_, i) => (
            <button
                key={i}
                className={`${styles.dot} ${i === page ? styles.active : ""}`}
                onClick={() => onSetPage(i)}
            />
            ))}
        </div>
    </div>
    
  );
}

export default ThumbnailStrip;
