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
  className = '',
  applyClassNameAfterLoad = false,  
}) {
  const [loaded, setLoaded] = useState(false);

  const src = resolveImageUrl(image);
  if (!src) return null;

  const wrapperClass =
    applyClassNameAfterLoad
      ? `${styles.wrapper} ${loaded ? className : ''}`
      : `${styles.wrapper} ${className}`;

  return (
    <div className={wrapperClass} data-loaded={loaded ? 'true' : 'false'}>
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
        className={styles.img}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default SmartImage;
