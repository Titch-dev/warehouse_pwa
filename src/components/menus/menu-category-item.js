import FireSVG from '../assets/icons/fire-svg';

import styles from './menu-category-item.module.css';
import { rubikFont } from '@/lib/fonts';

import { getStorageImageUrl } from '@/lib/utils';

export default function MenuCategoryItem({ item }) {
  return (
    <li className={styles.item_container}>
        {item.imagePath? 
            <img 
                src={getStorageImageUrl(item.imagePath)} 
                className={styles.item_image}
                loading='lazy'
                alt={item.imageAlt}/>
        : ''}
        <div className={styles.item_desc}>
            <h3 className={rubikFont.className}>
                <span className={styles.item_name}>{item.itemName}</span>
                {item.itemDiet && item.itemDiet === 'vegetarian' ? (
                    <span className={styles.item_diet}>(V)</span>
                ) : null}
                {item.itemHeat ? (
                    <span className={styles.item_heat}>
                        {Array.from({ length: item.itemHeat }, (_, idx) => (
                            <FireSVG key={idx} />
                        ))}
                    </span>
                ) : null
                }                  
            </h3>
            {item.itemBrewery ? 
            <p className={styles.item_brewery}>Brewery: {item.itemBrewery}</p>:""}
            <p>{item.itemDesc}</p>
            
        </div>
        <div className={styles.item_price}>
            <table className={styles.item_table}>
                {item.itemDenom &&
                    <thead>
                    <tr>
                        <th scope="col"></th>
                            {item.itemDenom.map((denomination, idx) => (
                                <th key={`denom-${idx}`} scope="col">{denomination}</th>
                            ))
                            }
                    </tr>
                </thead>
                }
                
                <tbody>
                    <tr>
                        <th scope="row"></th>
                        {item.itemPrice.map((price, idx) => (
                            <td key={`price-${idx}`}>R {price}</td>
                        ))}
                    </tr>
                    {item.itemSides? 
                    <tr>
                        <th scope="row" style={{color: "yellowgreen"}}>+ side</th>
                        {item.itemPrice.map((price, idx) => (
                            <td key={`side-${idx}`}>R {price + item.itemSides}</td>
                        ))}
                    </tr>
                    : ""}
                </tbody>
            </table>
        </div>
    </li>
  )
}
