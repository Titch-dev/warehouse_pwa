import Link from "next/link";
import NavMenu from "./nav-menu";
import BurgerToggle from "./burger-toggle";

import styles from "./web-nav-bar.module.css";

import Logo from '@/components/assets/logo/WWLogoSVG';

export default function WebNavbar() {

    return(
        <>
            <header className={styles.wrapper}>
                <div className={styles.container}>
                    <Link href='/'>
                        <Logo className={styles.logo}>
                            <linearGradient id="Gradient" x2="0" y2="1">
                                <stop className={styles.stop1} offset="0%" />
                                <stop className={styles.stop2} offset="50%" />
                                <stop className={styles.stop3} offset="100%" />
                            </linearGradient>
                        </Logo>
                    </Link>
                    <div className={styles.tablet_nav}>
                        <NavMenu />
                    </div>
                    <div className={styles.mobile_nav}>
                        <BurgerToggle/>
                    </div>
                </div>
            </header>
        </>
        
    );    
}