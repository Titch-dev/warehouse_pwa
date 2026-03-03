import Socials from '@/components/assets/icons/socials';

import styles from './contact-page.module.css';

import { rubikFont } from '@/lib/fonts';
import OpeningHours from '@/components/ui/opening-hours';
import TornBackgroundSVG from '@/components/assets/patterns/torn-background-svg';

export default function ContactPage() {
  const mapLink =
    'https://www.google.com/maps/search/?api=1&query=48A+Buckingham+Terrace+Westville+Durban+4001+South+Africa';

  const mapEmbed =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.5301140964257!2d30.961177!3d-29.833944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ef7b60d4b1a681f%3A0x50d9ecfa4d2bfbb2!2s48A%20Buckingham%20Terrace%2C%20Westville%2C%20Durban%2C%20South%20Africa!5e0!3m2!1sen!2sza!4v1700000000000';

  return (
    <div className={styles.page_wrapper}>
        <TornBackgroundSVG 
          className={styles.content_background}
          height={980}
          width={980}/>
        <div className={styles.content}>
            <h1 className={`${styles.title} ${rubikFont.className}`}>Contact Us</h1>
            <p className={styles.content_desc}>Got questions? 
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
            <div className={styles.map_container}>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.googlemaps}
                aria-label="Open location in Google Maps"
              >
                <iframe
                  src={mapEmbed}
                  width="300"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </a>
            </div>
            <div className={styles.opening_container}>
              <OpeningHours/>
            </div>
        </div>
    </div>
  )
}