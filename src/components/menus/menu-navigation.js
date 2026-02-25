'use client'

import { useState, useEffect } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import MenuContainer from './menu-container';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';


import { getMenuPdfUrl } from '@/lib/utils';
import styles from './menu-navigation.module.css';

import { rubikFont } from '@/lib/fonts';

import DownloadSVG from '../assets/icons/download-svg';
import LoadingData from '../loading-data';


const menus = ['food', 'drinks'];

export default function MenuNavigation() {
  const [menuPdfUrls, setMenuPdfUrls] = useState({})
  const [selectedMenu, setSelectedMenu] = useState('food');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fetch both menus
  const { data: foodMenu, loading: foodLoading, error: foodError } = useFirestoreCollection('menuFoodItems', 'menuFood')
  const { data: drinksMenu, loading: drinksLoading, error: drinksError } = useFirestoreCollection('menuDrinkItems', 'menuDrink')

  console.log(foodMenu.length)
  console.log(drinksMenu.length)
  useEffect(() => {
    const fetchPdfUrls = async () => {
      try {
        const entries = await Promise.all(
          menus.map(async menu => [menu, await getMenuPdfUrl(menu)])
        )

        setMenuPdfUrls(Object.fromEntries(entries))
      } catch (err) {
        console.error('Failed to load menu PDFs', err)
      }
    }

    fetchPdfUrls()
  }, [])

  // helper to map key → actual menu data
  const getMenuData = (menuKey) => {
    if (menuKey === 'drinks') { return drinksMenu };  
    return foodMenu;
  };

  if (foodLoading || drinksLoading) return (
    <LoadingData dataName={'menus'}/>
  );

  if (foodError || drinksError) return <p>Error loading menu data</p>

  return (
    <section className={styles.menu}>
      <div className={styles.menu_header}>
          {isMobile ?
            // Mobile navigation
            <>
              <select 
                className={`${rubikFont.className} ${styles.dropdown}`}
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value)}>
                <option value='food'>Food Menu</option>
                <option value='drinks'>Drinks Menu</option>
              </select>
                <a
                  href={menuPdfUrls[selectedMenu]}
                  className={styles.download_content}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.label}>Download</span>
                  <DownloadSVG className={styles.menu_download}/>
                </a>
            </>
             :
            // Desktop navigation
            <ul>
            {menus.map((menuOption, idx) => (
              <li 
                key={idx} 
                className={`
                  ${styles.menu_header_content}
                  ${selectedMenu === menuOption ? styles.active : ""}
                `}>
                <button
                  onClick={() => {setSelectedMenu(menuOption)}}
                  className={rubikFont.className}
                >
                  {`${menuOption} Menu`}
                </button>
                <a
                  href={menuPdfUrls[menuOption]}
                  className={styles.download_content}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadSVG className={styles.menu_download}/>
                </a>
              </li>
            ))}
          </ul>
        }
      </div>
      <MenuContainer 
        menu={getMenuData(selectedMenu)}
        selected={selectedMenu}/>
    </section>
  )
}
