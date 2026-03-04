import SmartImage from '@/components/ui/smart-image';
import styles from './thumbnail-slot.module.css';

function ThumbnailSlot({ img, index, openModal }) {
  const isPlaceholder = !img;

  return (
    <button
      className={styles.thumb}
      disabled={isPlaceholder}
      onClick={() => !isPlaceholder && openModal(index)}
    >
      {!isPlaceholder && (
        <SmartImage
          image={img.image}
          alt={img.image.alt}
          sizes="150px"
        />
      )}
    </button>
  );
}

export default ThumbnailSlot;
