'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './smart-video.module.css';

function SmartVideo({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'auto',
}) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markLoaded = () => setLoaded(true);

    if (video.readyState >= 2) {
      setLoaded(true);
      return;
    }

    video.addEventListener('loadeddata', markLoaded);
    video.addEventListener('canplay', markLoaded);

    video.load();

    return () => {
      video.removeEventListener('loadeddata', markLoaded);
      video.removeEventListener('canplay', markLoaded);
    };
  }, [src]);

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      data-loaded={loaded ? 'true' : 'false'}
    >
      {!loaded && (
        <div className={styles.loading}>
          <img
            src="/icons/ww_logo.png"
            alt="Loading"
            className={styles.loader_image}
          />
        </div>
      )}

      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
      />
    </div>
  );
}

export default SmartVideo;