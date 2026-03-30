'use client'

import { useState, useEffect, useMemo } from 'react';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { getMenuPdfUrl } from '@/lib/utils';

import MenuContainer from './menu-container';
import LoadingData from '../ui/loading-data';

import styles from './menu-navigation.module.css';

const menus = ['food', 'drinks'];

export default function MenuNavigation() {
  const [menuPdfUrls, setMenuPdfUrls] = useState({});

  const { data: menu, loading: menuLoading, error: menuError } =
    useFirestoreCollection('menu', 'menu');

  const { data: specials, loading: specialsLoading, error: specialsError } =
    useFirestoreCollection('specials', 'specials');

  const { foodMenu, drinksMenu, extras, notices } = useMemo(() => {
    const food = (menu || []).filter(e => e.type === 'food');
    const drinks = (menu || []).filter(e => e.type === 'drink');
    const extrasDocs = (menu || []).filter(e => e.type === 'extras');
    const noticeDocs = (menu || []).filter(e => e.type === 'notice');

    return {
      foodMenu: food,
      drinksMenu: drinks,
      extras: extrasDocs,
      notices: noticeDocs,
    };
  }, [menu]);

  const { foodSpecials, drinkSpecials } = useMemo(() => {
    const food = (specials || []).filter(e => e.type === 'food');
    const drinks = (specials || []).filter(e => e.type === 'drink');

    return {
      foodSpecials: food,
      drinkSpecials: drinks,
    };
  }, [specials]);

  useEffect(() => {
    const fetchPdfUrls = async () => {
      try {
        const entries = await Promise.all(
          menus.map(async menuKey => [menuKey, await getMenuPdfUrl(menuKey)])
        );

        setMenuPdfUrls(Object.fromEntries(entries));
      } catch (err) {
        console.error('Failed to load menu PDFs', err);
      }
    };

    fetchPdfUrls();
  }, []);

  if (menuLoading) {
    return (
      <div className={styles.loading_skeleton}>
        <LoadingData dataName="menus" />
      </div>
    );
  }

  if (menuError) return <p>Error loading menu data</p>;

  return (
    <section className={styles.menu}>
      <MenuContainer
        foodMenu={foodMenu}
        drinksMenu={drinksMenu}
        extras={extras}
        notices={notices}
        foodSpecials={foodSpecials}
        drinkSpecials={drinkSpecials}
        specialsLoading={specialsLoading}
        specialsError={specialsError}
        menuPdfUrls={menuPdfUrls}
      />
    </section>
  );
}