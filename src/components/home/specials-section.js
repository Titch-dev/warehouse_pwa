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
        <div className={styles.specials_container}>
        <SpecialsCarousel title='Food' specials={'specialsFoodItems'}></SpecialsCarousel>
        <SpecialsCarousel title='Drinks' specials={'specialsDrinkItems'}></SpecialsCarousel>
        </div>
    </section>
  )
}

export default SpecialsSection