import MenuCategoryItem from './menu-category-item';

import FireSVG from '../assets/icons/fire-svg';

import styles from './menu-category-content.module.css';
import { rubikFont } from '@/lib/fonts';

export default function MenuCategoryContent({ categoryData }) {

    if (!categoryData) {
        return <p>No items found for this category.</p>;
    }
    
    const categoryItems = categoryData.items;
    const categoryDip = categoryData?.itemDip;

  return (
    <>
    <ul className={styles.category_item_list}>
        {categoryItems.map((item, idx) => (
            <MenuCategoryItem key={idx} item={item}/>
        ))}
    </ul>
    {categoryDip? 
        <>
            <h3 className={`${styles.item_dip_header} ${rubikFont.className}`}>Add a dipping sauce:</h3>
            <div className={styles.item_dip_container}>
                {categoryDip.map((dip, idx) => (
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
        </>:
        " "}
    </>
  )
}
