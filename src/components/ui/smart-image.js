'use client'

import { useState } from 'react';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/utils';
import styles from './smart-image.module.css';

function SmartImage({ 
  image, 
  alt = 'The Westville Warehouse image', 
  sizes = '100vw',
  fit = "cover",
  priority = false,
  className = ''  
}) {
  const [loaded, setLoaded] = useState(false);

  console.log(image)

  const src = resolveImageUrl(image);

  if (!src) return null;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {!loaded && (
        <div className={styles.loading}>
          <img
            src="/icons/ww_logo.png"
            alt="Loading"
            className={styles.loader_image}
          />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: fit }}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}

export default SmartImage;
