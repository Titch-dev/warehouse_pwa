import Link from 'next/link';

import EventItem from '@/components/events/event-item';
import SpecialsCarousel from '@/components/specials/specials-carousel';

import { events, specialsFood, specialsDrink } from '@/data/synthetic-data';

import TornBorder from '@/components/assets/patterns/torn-border';
import TornBackgroundSVG from '@/components/assets/patterns/torn-background-svg';
import LogoSVG from '@/components/assets/logo/logo-svg';

import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';

import styles from './page.module.css';

export default function HomePage() {
  const nextEvent = events[0];

  return (
    <>
        <section className={styles.section_hero}>
          <div className={styles.hero_image}>
            <LogoSVG className={styles.hero_logo}></LogoSVG>
          </div>
        </section>

        <section className={styles.about}>
          <TornBorder top={true} color={colors.greydark2}/>
          <div className={styles.about_content}>
            <TornBackgroundSVG className={styles.content_background} />
            <div className={styles.about_text}>
              <h1 
                className={`${styles.about_title} ${rubikFont.className}`}>
                  Eat, Drink, Play!
              </h1>
              <p>Chalk up and chill out at The Westville Warehouse — where 
                craft beers flow, cocktails come on tap, and the pool tables 
                are ready.</p>
              <p>Whether you're here to shoot your shot, 
                catch a talented band, or just unwind with your crew, 
                we’ve got the perfect combo of laid-back vibes and high-energy 
                fun. Weeknights, weekends — we keep the good times rolling.</p>
            </div>
              <div className={styles.vid_container}>
                <video autoPlay loop muted playsInline>
                  <source src="/assets/video/ww_about_vid.mp4" />
                </video>
              </div>
          </div>
          <TornBorder top={false} color={colors.greydark2}/>
        </section>

       
        <section className={styles.event}>
            <h1 className={`${styles.event_title} ${rubikFont.className}`}>Coming Up ...</h1>
            <EventItem props={nextEvent} />
            <Link 
              href='/events' 
              className={styles.event_link}>
                ...see more events
            </Link>
        </section>

        
        <section className={styles.specials}>
          <TornBorder top={true} color={colors.greydark1}/>
          <h1 className={`${styles.specials_title} ${rubikFont.className}`}>Our Specials</h1>
          <div className={styles.specials_container}>
            <SpecialsCarousel title='Food' specials={specialsFood}></SpecialsCarousel>
            <SpecialsCarousel title='Drinks' specials={specialsDrink}></SpecialsCarousel>
          </div>
        </section>
    </>
  )
}
