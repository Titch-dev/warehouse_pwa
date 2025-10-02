import Socials from '@/components/assets/icons/socials';
import ContactForm from '@/components/forms/contact-form';

import styles from './contact-page.module.css';

import TornBorder from '@/components/assets/patterns/torn-border';
import { colors } from '@/lib/colors';
import { rubikFont } from '@/lib/fonts';
import OpeningHours from '@/components/opening-hours';

export default function ContactPage() {

  return (
    <div className={styles.page_wrapper}>
      <div className={styles.container}>
        <TornBorder top={true} color={colors.greydark1}/>
        <div className={styles.content}>
            <h1 className={`${styles.title} ${rubikFont.className}`}>Contact Us</h1>
            <p className={styles.content_desc}>Got questions or want to book a spot? Fill out the contact form 
              and we’ll get back to you ASAP. You can also DM us 
              on Facebook or Instagram for quick replies, event updates, and 
              behind-the-scenes vibes. We’re just a message away—let’s connect!</p>
            <Socials size={35}/>
            <div className={styles.opening_container}>
              <OpeningHours/>
            </div>
        </div>
        <div className={styles.form_container}>
          <ContactForm/>
        </div>
      </div>
    </div>
  )
}