'use client'

import Link from 'next/link';

import InstagramSVG from './instagram-svg';
import FacebookSVG from './facebook-svg';
import WhatsAppSVG from './whatsapp-svg';
import EnvelopeSVG from './envelope-svg';

import styles from './socials.module.css';

export default function Socials({ size, fb=false, insta=false, whatsapp=false, email=false }) {
  const fBUrl = "https://www.facebook.com/TheWestvilleWarehouse/";
  const instaUrl = "https://www.instagram.com/thewestvillewarehouse/";
  const whatsappUrl = "https://wa.me/27634489165"

  const handleMailTo = () => {
    const subject = encodeURIComponent("Westville Warehouse Enquiry");
    const body = encodeURIComponent("Hi Westville Warehouse team,");
    window.location.href = `mailto:thewestvillewarehouse@gmail.com?subject=${subject}&body=${body}`;
};

  return (
    <div className={styles.container}>
        {insta && 
            <Link 
                href={instaUrl} 
                target='_blank'
                className={styles.icon_button}>
                <InstagramSVG className={styles.icon} width={size} height={size}>
                    <linearGradient id="Gradient1" x2="0" y2="1">
                        <stop className={styles.stop1} offset="0%" />
                        <stop className={styles.stop2} offset="50%" />
                        <stop className={styles.stop3} offset="100%" />
                    </linearGradient>
                </InstagramSVG>
            </Link>
        }
        {fb &&
            <Link 
                href={fBUrl} 
                target='_blank'
                className={styles.icon_button}>
                <FacebookSVG className={styles.icon} width={size} height={size}>
                    <linearGradient id="Gradient1" x2="0" y2="1">
                        <stop className={styles.stop1} offset="0%" />
                        <stop className={styles.stop2} offset="50%" />
                        <stop className={styles.stop3} offset="100%" />
                    </linearGradient>
                </FacebookSVG>
            </Link>
        }
        {whatsapp &&    
            <Link  
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className={styles.icon_button}>
                <WhatsAppSVG className={styles.icon} width={size + 15} height={size + 15}>
                    <linearGradient id="Gradient1" x2="0" y2="1">
                        <stop className={styles.stop1} offset="0%" />
                        <stop className={styles.stop2} offset="50%" />
                        <stop className={styles.stop3} offset="100%" />
                    </linearGradient>
                </WhatsAppSVG>
            </Link>
        }
        {email && (
            <button
                type="button"
                onClick={handleMailTo}
                aria-label="Send us an email"
                className={styles.icon_button}
                style={{ bottom: 5}}>
                    <EnvelopeSVG 
                        className={styles.icon} 
                        width={size} 
                        height={size}
                        >
                        <linearGradient id="Gradient1" x2="0" y2="1">
                            <stop className={styles.stop1} offset="0%" />
                            <stop className={styles.stop2} offset="50%" />
                            <stop className={styles.stop3} offset="100%" />
                        </linearGradient>
                    </EnvelopeSVG>
                </button>
        )}
    </div>
  )
}
