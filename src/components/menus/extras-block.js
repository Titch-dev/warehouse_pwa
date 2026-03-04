import { rubikFont } from '@/lib/fonts'
import styles from './extras-block.module.css'

function ExtrasBlock({ extra }) {
    const items = Array.isArray(extra?.items) ? extra.items : [];

  return (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <h3 className={`${styles.title} ${rubikFont.className}`}>
                {extra.priceEach?
                    <span>{`${extra.name} R${extra.priceEach}:`}</span> 
                : <span>{`${extra.name}:`}</span>}
            </h3>
            <div 
              className={styles.items_grid}
              style={{ '--col': `${items.length}`}}  
            >
                {items.map((item, idx) => (
                    <div key={item?.id ?? `${item?.name ?? 'item'}-${idx}`} className={styles.item_container}>
                        <h4 className={`${styles.item_name} ${rubikFont.className}`}>
                            {item?.name}
                        </h4>
                        {item?.amount != null && <p>R{item.amount}</p>}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default ExtrasBlock