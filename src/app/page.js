import Link from 'next/link';


import SpecialsCarousel from '@/components/specials/specials-carousel';

// import { events, specialsFood, specialsDrink } from '@/data/synthetic-data';

// import TornBorder from '@/components/assets/patterns/torn-border';
// import TornBackgroundSVG from '@/components/assets/patterns/torn-background-svg';


// import { colors } from '@/lib/colors';
// import { rubikFont } from '@/lib/fonts';

import styles from './home-page.module.css';
import HeroSection from '@/components/home/hero-section';
import AboutSection from '@/components/home/about-section';
import EventSection from '@/components/home/event-section';
import SpecialsSection from '@/components/home/specials-section';

export default function HomePage() {

  return (
    <div className={styles.page_wrapper}>
      <HeroSection/>
      <AboutSection/>
      <EventSection/>
      <SpecialsSection/>
    </div>
  )
}
