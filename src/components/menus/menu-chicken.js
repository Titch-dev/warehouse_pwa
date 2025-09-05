import styles from './menu-chicken.module.css';

import { rubikFont } from '@/lib/fonts';
import FireSVG from '../assets/icons/fire-svg';
export default function MenuChicken({data}) {
  return (
        <>
        <ul>
            {data.items.map((item) => {
                return (
                    <li key={item.id} className={styles.item_container}>
                        <div className={styles.item_desc}>
                            <h3 className={rubikFont.className}>{item.itemName}</h3>
                            <p>{item.itemDesc}</p>
                        </div>
                    <div className={styles.item_price}>
                        <table className={styles.item_chicken}>
                            {item.itemPrice.length <= 1? "" :
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col">100g</th>
                                    <th scope="col">300g</th>
                                    </tr>
                                </thead>
                            }
                            <tbody>
                                <tr>
                                <th></th>
                                {item.itemPrice.map((price, idx) => (
                                    <td key={`price-${idx}`}>R {price}</td>
                                ))}
                                </tr>
                                <tr>
                                <th scope="row">with side</th>
                                {item.itemPrice.map((price, idx) => (
                                    <td key={`side-${idx}`}>R {price + item.itemSides}</td>
                                ))}
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </li>  
                )   
            })}
        </ul>

        <h3 className={`${styles.item_dip_header} ${rubikFont.className}`}>Add a dipping sauce:</h3>
        <div className={styles.item_dip_container}>
            {data.itemDip.map((dip, idx) => (
                <div key={idx} className={styles.item_dip_content}>
                    <p className={styles.item_dip_name}>{dip.itemName} 
                        <span>
                            {Array.from({ length: dip.itemHeat }, (_, idx) => (
                                <FireSVG key={idx} />))}
                        </span>
                    </p>
                    <p className={styles.item_dip_price}>+ R {dip.itemPrice}</p>
                </div>
            ))}
        </div>
        </>
  )
}
