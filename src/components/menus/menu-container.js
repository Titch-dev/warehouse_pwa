'use client'

import { useState } from "react";

import MenuCategory from "./menu-category";
import MenuBurger from "./menu-burger";
import MenuChicken from "./menu-chicken";
import MenuRibs from "./menu-ribs";
import MenuSides from "./menu-sides";


import styles from "@/components/menus/menu-container.module.css";
import { rubikFont } from "@/lib/fonts";

import { food } from "@/data/synthetic-data";

export default function MenuContainer() {
  const [selectedCategory, setSelectedCategory] = useState('Burgers');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  }

  const getCategoryData = (categoryName) => {
    return food.find((cat) => cat.category === categoryName || null);
  }

  const catData = getCategoryData(selectedCategory);

  const menuCategory = () => { 
    switch (selectedCategory) {
      case "Chicken":
        return <MenuChicken data={catData}/>;
      case "Ribs":
        return <MenuRibs data={catData}/>;
      case "Sides":
        return <MenuSides data={catData}/>;
      default:
        return <MenuBurger data={catData}/>;
  }}


  return (
    <div className={styles.menu_content}>
        <div className={styles.menu_categories}>
          <ul>
            {food.map((food) => (
              <li 
                key={food.id} 
                className={selectedCategory === food.category? styles.active : ""}>
                <MenuCategory  action={handleCategorySelect} category={food.category}/>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.menu_items_wrapper}>
            <div className={styles.menu_items_container}>
              <header className={`${styles.items_header} ${rubikFont.className}`}>{selectedCategory}</header>
              <main className={styles.items_content}>
               {menuCategory()}
              </main>
            </div>

        </div>
    </div>
  )
}
