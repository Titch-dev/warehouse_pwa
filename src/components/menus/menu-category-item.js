import SmartImage from '../ui/smart-image';
import Badges from './badges';

import styles from './menu-category-item.module.css';
import { rubikFont } from '@/lib/fonts';

export default function MenuCategoryItem({ item }) {
    const hasPricing = Array.isArray(item?.pricing) && item.pricing.length > 0;

    const hasLabels =
        hasPricing && item.pricing.some(p => (p?.label ?? '').trim().length > 0);

  return (
    <li className={styles.container}>
        {item.image && 
            <SmartImage 
              image={item?.image}
              alt={item?.image?.alt}
              fit='contain'
              className={styles.item_image}
            />
        }
        <div className={styles.content}>
            <h3 className={`
                ${rubikFont.className}
                ${styles.title}
            `}>
                {item.name}        
            </h3>
            {item.brewery 
                ? <p className={styles.item_brewery}>Brewery: {item.brewery}</p>
                : ""}
            <p>{item.description}</p>
            
        </div>
        <div className={styles.info_row}>
            {item.badges?
                <Badges badgesList={item.badges}/> : ''    
            }
            <div className={styles.item_price}>
                {hasPricing && (
                    <table className={styles.item_table}>
                        {hasLabels && (
                        <thead>
                        <tr>
                            {item.pricing.map((option, idx) => (
                            <th 
                                key={`label-${idx}`} 
                                scope="col"
                                className={rubikFont.className}>
                                {option.label}
                            </th>
                            ))}
                        </tr>
                        </thead>
                        )}
                        <tbody>
                        <tr>
                            {item.pricing.map((option, idx) => (
                            <td key={`amount-${idx}`}>
                                R {option.amount}
                            </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        
    </li>
  )
}
