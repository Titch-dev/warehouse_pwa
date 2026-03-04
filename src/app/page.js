import HeroSection from '@/components/home/hero-section';
import AboutSection from '@/components/home/about-section';
import EventSection from '@/components/home/event-section';
import SpecialsSection from '@/components/home/specials-section';
import styles from './home-page.module.css';

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
