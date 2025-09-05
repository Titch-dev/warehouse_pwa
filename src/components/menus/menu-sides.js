import styles from './menu-sides.module.css';

import { rubikFont } from '@/lib/fonts';

export default function MenuSides({data}) {
  return (
      <ul>
        {data.items.map((item, idx) => (
          <li className={styles.item_container} key={idx}>
            <div className={styles.item_desc}>
              <h3 className={`${rubikFont.className} ${styles.item_name}`}>{item.itemName}</h3>
              <p>{item.itemDesc}</p>
            </div>
            <div className={styles.item_price}>
              <table className={styles.item_side}>
                <thead>
                  <tr>
                    {item.itemPrice.length <= 1 ? "" :
                    <>
                      <th scope="col">Small</th>
                      <th scope="col">Large</th>
                    </>
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {item.itemPrice.map((price, idx) => (
                      <td key={`price-${idx}`}>R {price}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
  )
}
