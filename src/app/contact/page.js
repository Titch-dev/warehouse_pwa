import Socials from '@/components/assets/icons/socials';

import styles from './contact-page.module.css';

import { rubikFont } from '@/lib/fonts';
import OpeningHours from '@/components/opening-hours';
import TornBackgroundSVG from '@/components/assets/patterns/torn-background-svg';

export default function ContactPage() {

  return (
    <div className={styles.page_wrapper}>
        <TornBackgroundSVG 
          className={styles.content_background}
          height={980}
          width={980}/>
        <div className={styles.content}>
              <h1 className={`${styles.title} ${rubikFont.className}`}>Contact Us</h1>
              <p className={styles.content_desc}>Got questions or want to book a spot? 
                Choose one of the icons and we’ll get back to you ASAP. Check out our
                Facebook or Instagram for more behind the scenes vibes!</p>
              <div className={styles.socials_container}>
                <Socials 
                  size={35}
                  insta
                  fb
                  whatsapp
                  email
                />
              </div>
            
            <div className={styles.opening_container}>
              <OpeningHours/>
            </div>
        </div>
    </div>
  )
}