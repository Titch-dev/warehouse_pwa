"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROLE_NAV } from "@/lib/auth/roles";

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const navItems = ROLE_NAV[role] || [];

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__brand">Westville Warehouse</div>

      <nav>
        <ul className="dashboard-sidebar__nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive ? "dashboard-link active" : "dashboard-link"}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}