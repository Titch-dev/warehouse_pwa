import SpecialsCarousel from '../specials/specials-carousel';

import TornBorder from '../assets/patterns/torn-border';

import styles from './specials-section.module.css';
import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';

function SpecialsSection() {
    
  return (
    <section className={styles.specials}>
        <TornBorder top={true} color={colors.greydark2}/>
        <h1 className={`${styles.specials_title} ${rubikFont.className}`}>Our Specials</h1>
        <div className={styles.specials_wrapper}>
          <div className={styles.specials_container}>
            <h2 
              className={`
                ${styles.specials_heading} 
                ${rubikFont.className}
              `}>
                Food:
            </h2>
            <SpecialsCarousel 
              specials={'specialsFoodItems'}
              metaRef={'specialsFood'}
            />
          </div>
          <div className={styles.specials_container}>
            <h2 
              className={`
                ${styles.specials_heading} 
                ${rubikFont.className}
              `}>
                Drinks:
            </h2>
            <SpecialsCarousel 
              specials={'specialsDrinkItems'}
              metaRef={'specialsDrink'}
            />
          </div>
        </div>
    </section>
  )
}

export default SpecialsSection