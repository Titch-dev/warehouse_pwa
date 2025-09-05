import styles from './menu-ribs.module.css';

import { rubikFont } from '@/lib/fonts';

import FireSVG from '../assets/icons/fire-svg';

export default function MenuRibs({data}) {
  return (
    <ul>
        {data.items.map((item) => {
            return(
                <li key={item.id} className={styles.item_container}>
                <div className={styles.item_desc}>
                    <h3 className={rubikFont.className}>
                      {item.itemName} 
                      <span>
                          {Array.from({ length: item.itemHeat }, (_, idx) => (
                              <FireSVG key={idx} />))}
                      </span>  
                    </h3>
                    <p>{item.itemDesc}</p>
                </div>
                <div className={styles.item_price}>
                <table className={styles.item_ribs}>
                    <thead>
                    <tr>
                        <th scope="col"></th>
                        {item.itemPrice.length <= 1 ?
                        ""
                        :
                        <>
                          <th scope="col">300g</th>
                          <th scope="col">600g</th>
                          <th scope="col">900g</th>
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
                        <th scope="row">with side:</th>
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
  )
}
