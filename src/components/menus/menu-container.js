'use client'

import { useState, useEffect} from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

import MenuCategoryNavigation from "./menu-category-navigation";
import MenuCategoryContent from "./menu-category-content";

import styles from "@/components/menus/menu-container.module.css";
import { rubikFont } from "@/lib/fonts";
import { getUniqueCategories } from "@/lib/utils";


export default function MenuContainer({menu}) {
  const categories = getUniqueCategories(menu);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // reset selectedCategory whenever the menu prop changes
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    } else {
      setSelectedCategory("");
    }
  }, [menu]);

  // function to handle category changes
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }

  const catData = menu.filter(item => item.itemCategory === selectedCategory);

  return (
    <div className={styles.menu_content}>
        <div className={styles.menu_categories}>
          {isMobile?
            <>
              <select
                className={`${rubikFont.className} ${styles.dropdown}`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </>
            :
            <ul>
            {categories.map(cat => (
              <li 
                key={cat} 
                className={selectedCategory === cat? styles.active : ""}>
                <MenuCategoryNavigation  action={handleCategorySelect} category={cat}/>
              </li>
            ))}
          </ul>
          }
        </div>
        <MenuCategoryContent categoryData={catData}/>
    </div>
  )
}
