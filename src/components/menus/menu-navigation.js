'use client'

import { useState } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';

import MenuContainer from './menu-container';

import { food, drinks } from '@/data/synthetic-data';

import styles from './menu-navigation.module.css';

import { rubikFont } from '@/lib/fonts';

import DownloadSVG from '../assets/icons/download-svg';


const menus = ['food', 'drinks'];

export default function MenuNavigation() {
  const [selectedMenu, setSelectedMenu] = useState('food');

  const isMobile = useMediaQuery('(max-width: 768px)');

  // helper to map key → actual menu data
  const getMenuData = (menuKey) => {
    switch (menuKey) {
      case 'drinks':
        return drinks;
      default:
        return food;
    }
  };

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
                  className={styles.download_content}
                  href={`/assets/menus/${selectedMenu}-menu.pdf`}
                  download={`${selectedMenu}-menu.pdf`}
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
                  href={`/assets/menus/${menuOption}-menu.pdf`}
                  download={`${menuOption}-menu.pdf`}
                >
                  <DownloadSVG className={styles.menu_download}/>
                </a>
              </li>
            ))}
          </ul>
        }
      </div>
      <MenuContainer menu={getMenuData(selectedMenu)}/>
    </section>
  )
}
