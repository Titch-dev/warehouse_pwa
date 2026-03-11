'use client'

import { useMemo } from 'react';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

import SpecialsCarousel from '../specials/specials-carousel';
import TornBorder from '../assets/patterns/torn-border';

import styles from './specials-section.module.css';
import { colors } from '@/theme/colors';
import { rubikFont } from '@/theme/fonts';
import LoadingData from '../ui/loading-data';

function SpecialsSection() {

  const { data: specials = [], loading, error } = 
    useFirestoreCollection('specials', 'specials');

  const { food, drink } = useMemo(() => {
      const out = { food: [], drink: [] };

      for (const s of specials || []) {
        const t = (s?.type || '').toLowerCase();
        if (t === 'food') out.food.push(s);
        else if (t === 'drink') out.drink.push(s);
      }

    return out;
      }, [specials]);

  if (loading) {
    return (
      <section className={styles.specials}>
        <TornBorder top={true} color={colors.greydark2}/>
        <h1 className={`${styles.specials_title} ${rubikFont.className}`}>Our Specials</h1>
        <div className={styles.loading_skeleton}>
          <LoadingData dataName={' specials'} />
        </div>
      </section>
    );
  }

  if (error) return null;
    
  return (
    <section className={styles.specials}>
        <TornBorder top={true} color={colors.greydark2}/>
        <h1 className={`${styles.specials_title} ${rubikFont.className}`}>Our Specials</h1>
         <div className={styles.specials_wrapper}>
          {!!food?.length && (
            <div className={styles.specials_container}>
              <h2 className={`${styles.specials_heading} ${rubikFont.className}`}>Food:</h2>
              <SpecialsCarousel items={food} />
            </div>
          )}

          {!!drink?.length && (
            <div className={styles.specials_container}>
              <h2 className={`${styles.specials_heading} ${rubikFont.className}`}>Drinks:</h2>
              <SpecialsCarousel items={drink} />
            </div>
          )}
        </div>
    </section>
  )
}

export default SpecialsSection