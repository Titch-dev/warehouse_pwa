'use client'

import { useState, useEffect } from 'react';

import NavMenu from './nav-menu';

import Logo from '@/components/assets/logo/WWLogoSVG';
import styles from './burger-toggle.module.css';
import Link from 'next/link';

export default function BurgerToggle() {
  const [open, setOpen] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  
  const toggle = () => setOpen(prev => !prev);

  const closeMenu = () => {
    setOpen(false)
    console.log('closing modile menu')
  };

  useEffect(() => {
    if (open) {
      // delay rendering NavMenu for mobile
      const timeout = setTimeout(() => {
        setShowNavMenu(true);
      }, 300); // matches .menu_background transition
      return () => clearTimeout(timeout);
    } else {
      // hide immediately on close
      setShowNavMenu(false);
    }
  }, [open]);

  return (
    <>
      <Link href='/' onClick={closeMenu}>
        <Logo className={`${styles.logo} ${open ? styles.open : undefined}`}>
          <linearGradient id="Gradient1" x2="0" y2="1">
              <stop className={styles.stop1} offset="0%" />
              <stop className={styles.stop2} offset="50%" />
              <stop className={styles.stop3} offset="100%" />
          </linearGradient>
        </Logo>
      </Link>
      <button 
        className={`${styles.burger} ${open ? styles.open : undefined}`}
        onClick={toggle}>
          <span/>
          <span/>
          <span/>
          <span/>
      </button>
      <div className={`${styles.menu_background} ${open ? styles.open : undefined}`}>
        {showNavMenu && <NavMenu onNavigate={closeMenu} delay={true}/>}
      </div>
    </>
  )
}
