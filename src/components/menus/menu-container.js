'use client'

import { useEffect, useMemo, useState } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { getUniqueCategories } from '@/lib/menu/menu-config';
import { rubikFont } from '@/theme/fonts';

import MenuCategoryContent from './menu-category-content';
import Chevron from '../assets/icons/chevron-svg';
import DownloadSVG from '../assets/icons/download-svg';
import TornBorderTabSVG from '../assets/patterns/torn-border-tablet';
import TornBorderMobSVG from '../assets/patterns/torn-border-mobile';

import styles from './menu-container.module.css';

function capitalise(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function MenuContainer({
  foodMenu = [],
  drinksMenu = [],
  extras = [],
  notices = [],
  foodSpecials = [],
  drinkSpecials = [],
  specialsLoading = false,
  specialsError = null,
  menuPdfUrls = {},
}) {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const foodCategories = useMemo(() => {
    const categories = getUniqueCategories(foodMenu);
    categories.push('specials');
    return categories;
  }, [foodMenu]);

  const drinkCategories = useMemo(() => {
    const categories = getUniqueCategories(drinksMenu);
    categories.push('specials');
    return categories;
  }, [drinksMenu]);

  const [selectedMenu, setSelectedMenu] = useState('food');
  const [selectedCategory, setSelectedCategory] = useState(foodCategories[0] || '');

  useEffect(() => {
    const nextCategories = selectedMenu === 'drinks' ? drinkCategories : foodCategories;
    setSelectedCategory(nextCategories[0] || '');
  }, [selectedMenu, foodCategories, drinkCategories]);

  const activeMenu = selectedMenu === 'drinks' ? drinksMenu : foodMenu;
  const activeSpecials = selectedMenu === 'drinks' ? drinkSpecials : foodSpecials;
  const activeCategories = selectedMenu === 'drinks' ? drinkCategories : foodCategories;

  const catData = activeMenu.filter(item => item.category === selectedCategory);

  function handleDesktopMenuToggle(menuKey) {
    setSelectedMenu(menuKey);

    const nextCategories = menuKey === 'drinks' ? drinkCategories : foodCategories;
    if (!nextCategories.includes(selectedCategory)) {
      setSelectedCategory(nextCategories[0] || '');
    }
  }

  return (
    <div className={styles.menu_content}>
      <div className={styles.menu_categories_panel}>
        {isMobile ? (
          <>
            <select
              className={`${rubikFont.className} ${styles.dropdown}`}
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
            >
              <option value="food">Food</option>
              <option value="drinks">Drinks</option>
            </select>

            <a
              href={menuPdfUrls[selectedMenu]}
              className={styles.download_content}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Download</span>
              <DownloadSVG className={styles.menu_download} />
            </a>

            <select
              className={`${rubikFont.className} ${styles.dropdown}`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {activeCategories.map(cat => (
                <option key={cat} value={cat}>
                  {capitalise(cat)}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div className={styles.desktop_nav}>
            {[
              {
                key: 'food',
                label: 'Food',
                categories: foodCategories,
                pdf: menuPdfUrls.food,
              },
              {
                key: 'drinks',
                label: 'Drinks',
                categories: drinkCategories,
                pdf: menuPdfUrls.drinks,
              },
            ].map(section => {
              const isActive = selectedMenu === section.key;

              return (
                <div key={section.key} className={styles.menu_section}>
                  <button
                    type="button"
                    className={`
                      ${styles.menu_section_header} 
                      ${isActive ? styles.menu_section_header_open: ''}
                    `}
                    onClick={() => handleDesktopMenuToggle(section.key)}
                  >
                    <span className={rubikFont.className}>{section.label}</span>
                    <Chevron className={`${styles.section_chevron} ${isActive ? styles.section_chevron_open : ''}`} direction='right'/>
                  </button>

                  <div className={`${styles.section_body} ${isActive ? styles.section_body_open : ''}`}>
                    <ul className={styles.category_list}>
                      {section.categories.map(cat => (
                        <li key={cat}>
                          <button
                            type="button"
                            className={`${styles.category_button} ${rubikFont.className} ${
                              isActive && selectedCategory === cat ? styles.category_active : ''
                            }`}
                            onClick={() => {
                              setSelectedMenu(section.key);
                              setSelectedCategory(cat);
                            }}
                          >
                            {capitalise(cat)}
                          </button>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={section.pdf}
                      className={`${styles.category_button} ${styles.download_button} ${rubikFont.className}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Download</span>
                      <DownloadSVG className={styles.menu_download} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.content_wrapper}>
        {isMobile ? (
          <TornBorderMobSVG className={styles.torn_border} />
        ) : (
          <TornBorderTabSVG className={styles.torn_border} />
        )}

        <MenuCategoryContent
          key={`${selectedMenu}-${selectedCategory}`}
          category={selectedCategory}
          categoryData={catData}
          extras={extras}
          notices={notices}
          specials={activeSpecials}
          specialsLoading={specialsLoading}
          specialsError={specialsError}
        />
      </div>
    </div>
  );
}