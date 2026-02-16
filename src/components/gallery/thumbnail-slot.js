import { useState } from 'react';
import Image from 'next/image';
import styles from './thumbnail-slot.module.css';
import { getStorageImageUrl } from '@/lib/utils';

function ThumbnailSlot({ img, index, openModal }) {
  const [loaded, setLoaded] = useState(false);
  const isPlaceholder = !img;

  return (
    <button
      className={styles.thumb}
      disabled={isPlaceholder}
      onClick={() => !isPlaceholder && openModal(index)}
    >
      {!loaded && (
        <div className={styles.loading_wrapper}>
          <Image
            src="/icons/ww_logo.png"
            alt="Loading"
            width={60}
            height={60}
          />
        </div>
      )}

      {!isPlaceholder && (
        <Image
          src={getStorageImageUrl(img.imagePath)}
          alt=""
          fill
          sizes="150px"
          style={{ objectFit: 'cover' }}
          onLoadingComplete={() => setLoaded(true)}
        />
      )}
    </button>
  );
}

export default ThumbnailSlot;