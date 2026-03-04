'use client';

import { useEffect, useState } from 'react';
import { getOpeningHoursForToday } from '@/lib/utils';

import useMediaQuery from '@/hooks/useMediaQuery';
import LogoSVG from '@/components/assets/logo/logo-svg';

import styles from './hero-section.module.css';
import TornBorderMobSVG from '../assets/patterns/torn-border-mobile';
import { colors } from '@/lib/colors';
import TornBorderTabSVG from '../assets/patterns/torn-border-tablet';

function HeroSection () {

    const isMobile = useMediaQuery('max-width: 768px')
    const [playAnimation, setPlayAnimation] = useState(true);

    useEffect(() => {
    const hasAnimated = sessionStorage.getItem('homeHeroAnimated');

    if (!hasAnimated) {
      setPlayAnimation(true);
      sessionStorage.setItem('homeHeroAnimated', 'true');
    }
  }, []);

  const { open, close } = getOpeningHoursForToday();

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
            {isMobile ?
                <TornBorderMobSVG 
                    color={colors.greydark1} 
                    className={styles.border}
                />
                :
                <TornBorderTabSVG 
                    color={colors.greydark1} 
                    className={styles.border}
                />   
        }
        </div>
    </section>
)
}

export default HeroSection 