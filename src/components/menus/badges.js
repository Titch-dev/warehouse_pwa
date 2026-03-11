import styles from './badges.module.css';

import CowSVG from '../assets/icons/cow-svg';
import ChickenSVG from '../assets/icons/chicken-svg';
import VegetarianSVG from '../assets/icons/vegetarian-svg';
import { rubikFont } from '@/theme/fonts';

const BADGE_ORDER = ['cow', 'chicken', 'vegetarian'];

const ICONS = {
  beef: CowSVG,
  chicken: ChickenSVG,
  vegetarian: VegetarianSVG,
};

function normalizeBadges(list = []) {
  const out = list
    .map(b => (typeof b === 'string' ? b : b?.type))
    .filter(Boolean)
    .map(s => String(s).toLowerCase().trim());

  const unique = Array.from(new Set(out));
  unique.sort((a, b) => BADGE_ORDER.indexOf(a) - BADGE_ORDER.indexOf(b));
  return unique.filter(k => ICONS[k]);
}

export default function Badges({ badgesList = [], title = 'PROTEIN' }) {
  const badges = normalizeBadges(badgesList);
  const count = badges.length;

  if (count === 0) return null;

  const layoutClass =
    count === 1 ? styles.one :
    count === 2 ? styles.two :
    styles.three;

  return (
    <div className={styles.wrapper}>
        <div className={styles.container} aria-label={`${title} badges`}>
            <p 
            className={`${styles.title} ${rubikFont.className}`} 
            aria-hidden="true">
                options
            </p>
            <div className={`${styles.icons} ${layoutClass}`}>
            {badges.map((key) => {
                const Icon = ICONS[key];
                return (
                <span key={key} className={styles.iconWrap} aria-label={key}>
                    <Icon 
                        className={`
                            ${styles.icon} 
                            ${key === "beef" ? styles.cow: ''}
                            ${key === "chicken" ? styles.chick: ''}
                            ${key === "vegetarian" ? styles.veg: ''}
                        `}/>
                </span>
                );
            })}
            </div>
        </div>
    </div>
  );
}