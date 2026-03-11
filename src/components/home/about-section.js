import TornBorder from "../assets/patterns/torn-border";
import TornBackgroundSVG from "../assets/patterns/torn-background-svg";

import styles from './about-section.module.css';
import { colors } from "@/theme/colors";
import { rubikFont } from "@/theme/fonts";

function AboutSection() {
  return (
    <section className={styles.about}>
        <div className={styles.about_content}>
        <TornBackgroundSVG 
            className={styles.content_background} 
            height={980}
            width={980}/>
        <div className={styles.about_text}>
            <h1 
            className={`${styles.about_title} ${rubikFont.className}`}>
                Eat, Drink, Play!
            </h1>
            <p>Chalk up and chill out at The Westville Warehouse — where 
            craft beers flow, cocktails come on tap, and the pool tables 
            are racked up and ready.</p>
            <p>Whether you&apos;re here to shoot your shot, 
            catch a talented band, or just unwind with your crew, 
            we&apos;ve got the perfect combo of laid-back vibes and high-energy 
            fun. Weeknights, weekends — we keep the good times rolling.</p>
        </div>
            <div className={styles.vid_container}>
            <video autoPlay loop muted playsInline>
                <source src="/assets/video/ww_about_vid.mp4" />
            </video>
            </div>
        </div>
        <TornBorder top={false} color={colors.greydark1}/>
    </section>
  )
}

export default AboutSection