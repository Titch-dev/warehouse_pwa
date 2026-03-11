'use client'

import { useState, useEffect, useMemo } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import MenuContainer from './menu-container';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';


import { getMenuPdfUrl } from '@/lib/menu/index';
import styles from './menu-navigation.module.css';

import { rubikFont } from '@/theme/fonts';

import DownloadSVG from '../assets/icons/download-svg';
import LoadingData from '../ui/loading-data';


const menus = ['food', 'drinks'];

export default function MenuNavigation() {
  const [menuPdfUrls, setMenuPdfUrls] = useState({})
  const [selectedMenu, setSelectedMenu] = useState('food');
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const { data: menu, loading: menuLoading, error: menuError } = useFirestoreCollection('menu', 'menu')
  const { data: specials, loading: specialsLoading, error: specialsError} = useFirestoreCollection('specials', 'specials')

  const { foodMenu, drinksMenu, extras, notices } = useMemo(()=> {
    const food = (menu || []).filter(e => e.type === "food");
    const drinks = (menu || []).filter(e => e.type === "drink");
    const extrasDocs = (menu || []).filter(e => e.type === "extras");
    const noticeDocs = (menu || []).filter(e => e.type === "notice")

    return {
      foodMenu: food,
      drinksMenu: drinks,
      extras: extrasDocs,
      notices: noticeDocs
    }
  }, [menu])

  const { foodSpecials, drinkSpecials } = useMemo(() => {
    const food = (specials || []).filter(e => e.type === "food");
    const drinks = (specials || []).filter(e => e.type === "drink")

    return {
      foodSpecials: food,
      drinkSpecials: drinks
    }
  }, [specials])

  const getMenuData = (menuKey) => (menuKey === 'drinks' ? drinksMenu : foodMenu);
  const getSpecialsData = (menuKey) => (menuKey === 'drinks' ? drinkSpecials : foodSpecials);
  
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

  if (menuLoading) return (
    <div className={styles.loading_skeleton}>
      <LoadingData dataName={'menus'}/>
    </div>
  )

  if (menuError) return <p>Error loading menu data</p>

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
                <option value='food'>Food</option>
                <option value='drinks'>Drinks</option>
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
            <ul className={styles.header_wrapper}>
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
                  {menuOption}
                </button>
                <a
                  href={menuPdfUrls[menuOption]}
                  className={styles.download_content}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadSVG className={styles.menu_download}>
                    <linearGradient id="Gradient1" x2="0" y2="1">
                        <stop className={styles.stop1} offset="0%" />
                        <stop className={styles.stop2} offset="50%" />
                        <stop className={styles.stop3} offset="100%" />
                    </linearGradient>
                  </DownloadSVG>
                </a>
              </li>
            ))}
          </ul>
        }
      </div>
      <MenuContainer 
        menu={getMenuData(selectedMenu)}
        extras={extras}
        notices={notices}
        specials={getSpecialsData(selectedMenu)}
        specialsLoading={specialsLoading}
        specialsError={specialsError}/>
    </section>
  )
}