'use client'

import { useState, useEffect} from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

import MenuCategoryNavigation from "./menu-category-navigation";
import MenuCategoryContent from "./menu-category-content";

import styles from "@/components/menus/menu-container.module.css";
import { rubikFont } from "@/lib/fonts";

export default function MenuContainer({menu}) {
  const [selectedCategory, setSelectedCategory] = useState(menu[0]?.category || "");

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // reset selectedCategory whenever the menu prop changes
    setSelectedCategory(menu[0]?.category || "");
  }, [menu]);

  // function to handle category changes
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }

  // function to get category data
  const getCategoryData = (categoryName) => {
    return menu.find((cat) => cat.category === categoryName || null);
  }

  const catData = getCategoryData(selectedCategory);

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
                {menu.map((menu) => (
                  <option value={menu.category}>{menu.category}</option>
                ))}
              </select>
            </>
            :
            <ul>
            {menu.map((menu) => (
              <li 
                key={menu.id} 
                className={selectedCategory === menu.category? styles.active : ""}>
                <MenuCategoryNavigation  action={handleCategorySelect} category={menu.category}/>
              </li>
            ))}
          </ul>
          }
        </div>
        <MenuCategoryContent categoryData={catData}/>
    </div>
  )
}
