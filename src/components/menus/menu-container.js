'use client'

import { useState, useEffect } from "react";

import MenuCategoryNavigation from "./menu-category-navigation";
import MenuCategoryContent from "./menu-category-content";

import styles from "@/components/menus/menu-container.module.css";
import { rubikFont } from "@/lib/fonts";

export default function MenuContainer({menu}) {
  const [selectedCategory, setSelectedCategory] = useState(menu[0]?.category || "");

  useEffect(() => {
    // reset selectedCategory whenever the menu prop changes
    setSelectedCategory(menu[0]?.category || "");
  }, [menu]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }

  const getCategoryData = (categoryName) => {
    return menu.find((cat) => cat.category === categoryName || null);
  }

  const catData = getCategoryData(selectedCategory);

  return (
    <div className={styles.menu_content}>
        <div className={styles.menu_categories}>
          <ul>
            {menu.map((menu) => (
              <li 
                key={menu.id} 
                className={selectedCategory === menu.category? styles.active : ""}>
                <MenuCategoryNavigation  action={handleCategorySelect} category={menu.category}/>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.menu_items_wrapper}>
            <div className={styles.menu_items_container}>
              <header className={`${styles.items_header} ${rubikFont.className}`}>{selectedCategory}</header>
              <main className={styles.items_content}>
               <MenuCategoryContent categoryData={catData}/>
              </main>
            </div>

        </div>
    </div>
  )
}
