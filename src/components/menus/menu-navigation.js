'use client'

import { useState } from 'react';

import MenuContainer from './menu-container';

import { food } from '@/data/synthetic-data';

import styles from './menu-navigation.module.css';

import { rubikFont } from '@/lib/fonts';

export default function MenuNavigation() {
  const [menu, setMenu] = useState('food');

  const menuSelect = (menu) => {
    setMenu(menu);
  }

  return (
    <section className={styles.menu}>
      <div className={styles.menu_header}>
        <ul>
          <li>
            <button
              onClick={() => menuSelect('food')}
              className={rubikFont.className}
            >
              Food Menu
            </button>
          </li>
          <li>
            <button
              onClick={() => menuSelect('drink')}
              className={rubikFont.className}  
            >
              Drinks Menu
            </button>
          </li>
        </ul>
      </div>
      <MenuContainer />
    </section>
  )
}
