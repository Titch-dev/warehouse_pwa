'use client'

import { useState } from 'react';
import Link from 'next/link';

import MenuContainer from './menu-container';

import { food, drinks } from '@/data/synthetic-data';

import styles from './menu-navigation.module.css';

import { rubikFont } from '@/lib/fonts';

import DownloadSVG from '../assets/icons/download-svg';

export default function MenuNavigation() {
  const [selectedMenu, setSelectedMenu] = useState('food');

  // helper to map key → actual menu data
  const getMenuData = (menuKey) => {
    switch (menuKey) {
      case 'drink':
        return drinks;
      default:
        return food;
    }
  };


  return (
    <section className={styles.menu}>
      <div className={styles.menu_header}>
        <ul>
          <li className={styles.menu_header_content}>
            <button
              onClick={() => setSelectedMenu('food')}
              className={`
                ${selectedMenu === 'food' ? styles.active : ''} 
                ${rubikFont.className}
              `}
            >
              Food Menu
            </button>
            <a
              href="/assets/menus/food-menu.pdf"
              download="food-menu.pdf"
            >
              <DownloadSVG className={styles.menu_download}/>
            </a>
          </li>
          <li className={styles.menu_header_content}>
            <button
              onClick={() => setSelectedMenu('drink')}
              className={`
                ${selectedMenu === 'drink' ? styles.active : ''} 
                ${rubikFont.className}
              `} 
            >
              Drinks Menu
            </button>
            <a
              href="/assets/menus/drink-menu.pdf"
              download="drink-menu.pdf"
            >
              <DownloadSVG className={styles.menu_download}/>
            </a>
          </li>
        </ul>
      </div>
      <MenuContainer menu={getMenuData(selectedMenu)}/>
    </section>
  )
}
