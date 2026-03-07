import UserSVG from '../assets/icons/user-svg';
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
        <li onClick={onNavigate}>
          <NavLink href='/login'>
          <div className={styles.nav_link_container}>
           <UserSVG className={styles.icon}>
              <linearGradient id="Gradient2" x2="0" y2="1">
                <stop className={styles.stop1} offset="0%" />
                <stop className={styles.stop2} offset="50%" />
                <stop className={styles.stop3} offset="100%" />
              </linearGradient>
            </UserSVG>
            <p>Login</p>
          </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
