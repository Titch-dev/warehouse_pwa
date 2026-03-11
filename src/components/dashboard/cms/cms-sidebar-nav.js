"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./cms-sidebar-nav.module.css";

const NAV_ITEMS = [
  {
    href: "/dashboard/cms",
    label: "Overview",
    exact: true,
  },
  {
    href: "/dashboard/cms/events",
    label: "Events",
  },
  {
    href: "/dashboard/cms/menu-items",
    label: "Menu Items",
  },
  {
    href: "/dashboard/cms/specials",
    label: "Specials",
  },
  {
    href: "/dashboard/cms/gallery",
    label: "Gallery",
  },
];

function isActivePath(pathname, href, exact = false) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function CmsSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="CMS sections">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Dashboard</p>
        <h2 className={styles.title}>CMS</h2>
      </div>

      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href, item.exact);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}