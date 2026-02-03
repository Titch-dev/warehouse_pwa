'use client';

import { useEffect, useState } from 'react';
import { getOpeningHoursForToday } from '@/lib/utils';

import { OPENING_TIMES } from '@/config/openingTimes';
import LogoSVG from '@/components/assets/logo/logo-svg';

import styles from './hero-section.module.css';

function HeroSection () {
    const [playAnimation, setPlayAnimation] = useState(true);

    useEffect(() => {
    const hasAnimated = sessionStorage.getItem('homeHeroAnimated');

    if (!hasAnimated) {
      setPlayAnimation(true);
      sessionStorage.setItem('homeHeroAnimated', 'true');
    }
  }, []);

  const { open, close } = getOpeningHoursForToday(OPENING_TIMES);

  return (
    <section className={styles.section_hero}>
        <div className={styles.hero_image}>
            <div className={`${styles.logo_wrapper} ${
                playAnimation ? styles.animate_logo : styles.logo_final
            }`}
            >
                <LogoSVG className={styles.logo_white} />
                </div>
            <h3 
                className={`${styles.opening_time} ${
                    playAnimation ? styles.animate_time : styles.time_visible
            }`}
            >
                Open today {open} - {close}
            </h3>
        </div>
    </section>
)
}

export default HeroSection 