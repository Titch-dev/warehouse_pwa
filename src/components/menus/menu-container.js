'use client'

import { useState, useEffect} from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

import MenuCategoryNavigation from "./menu-category-navigation";
import MenuCategoryContent from "./menu-category-content";

import styles from "@/components/menus/menu-container.module.css";
import { rubikFont } from "@/lib/fonts";
import { getUniqueCategories } from "@/lib/utils";
import TornBorderTabSVG from "../assets/patterns/torn-border-tablet";
import TornBorderMobSVG from "../assets/patterns/torn-border-mobile";


export default function MenuContainer({
  menu,
  extras,
  notices,
  specials=[],
  specialsLoading=false,
  specialsError=null
}) {
  const categories = getUniqueCategories(menu);
  categories.push('specials')
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
  const isMobile = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (categories.length > 0) {setSelectedCategory(categories[0]);} 
    else {setSelectedCategory("");}
  }, [menu]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }

  function capitalise(str = "") {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const catData = menu.filter(item => item.category === selectedCategory);

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
                  <option key={cat} value={cat}>{capitalise(cat)}</option>
                ))}
              </select>
            </>
            :
            <ul className={styles.category_wrapper}>
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
        <div className={styles.content_wrapper}>
          {isMobile ? 
            <TornBorderMobSVG className={styles.torn_border}/>
            :
            <TornBorderTabSVG className={styles.torn_border}/>
          }
          <MenuCategoryContent
            category={selectedCategory}
            categoryData={catData}
            extras={extras}
            notices={notices}
            specials={specials}
            specialsLoading={specialsLoading}
            specialsError={specialsError}
          />
        </div>
    </div>
  )
}
