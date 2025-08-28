import Link from "next/link";

import NavLink from './nav-link';
import styles from './nav-menu.module.css';

export default function NavMenu({ onNavigate, delay=false }) {
  return (
    <nav className={`${styles.nav} ${delay ? styles.delay : undefined}`}>
      <ul>
        <li onClick={onNavigate}>
          <NavLink href='/events'>Events</NavLink>
        </li>
        <li onClick={onNavigate}>
          <NavLink href='/menus'>Menus</NavLink>
        </li>
        <li onClick={onNavigate}>
          <NavLink href='/gallery'>Gallery</NavLink>
        </li>
        <li onClick={onNavigate}>
          <NavLink href='/contact'>Contact</NavLink>
        </li>
      </ul>
    </nav>
  )
}
