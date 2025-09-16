import Image from 'next/image';

import FireSVG from '../assets/icons/fire-svg';

import styles from './menu-category-item.module.css';
import { rubikFont } from '@/lib/fonts';

export default function MenuCategoryItem({ item }) {
  return (
    <li className={styles.item_container}>
        {item.itemImage? 
            <Image 
                src={item.itemImage} 
                className={styles.item_image} 
                width={200}
                height={200}
                alt={item.itemImageAlt}/>
        : ''}
        <div className={styles.item_desc}>
            <h3 className={rubikFont.className}>
                {item.itemName} 
                {item.itemDiet && item.itemDiet === 'vegetarian' ? 
                <span className={styles.item_diet}>{` (V)`}</span> : ""}
                {item.itemHeat ? 
                    <span className={styles.item_heat}>
                        {Array.from({ length: item.itemHeat }, (_, idx) => (
                            <FireSVG key={idx} />
                        ))}
                    </span> 
                    : ""
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
