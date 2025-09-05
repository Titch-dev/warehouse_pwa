import styles from './menu-burger.module.css'

import { rubikFont } from '@/lib/fonts'

export default function MenuBurger({data}) {

    const items = data;

  return (

    <ul>
        {items.items.map((item) => {
            return(
                <li key={item.id} className={styles.item_container}>
                <div className={styles.item_desc}>
                    <h3 className={rubikFont.className}>{item.itemName}</h3>
                    <p>{item.itemDesc}</p>
                </div>
                <div className={styles.item_price}>
                <table className={styles.item_burger}>
                    <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Single</th>
                        {item.itemPrice.length <= 1 ? "":
                        <>
                            <th scope="col">Double</th>
                            <th scope="col">Triple</th>
                        </>
                        }
                        
                    </tr>
                    </thead>
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
        })
            
        }
        
    </ul>
    
  )
}
