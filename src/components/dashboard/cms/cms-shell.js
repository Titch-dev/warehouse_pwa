import CmsSidebarNav from "./cms-sidebar-nav";
import styles from "./cms-shell.module.css";

export default function CmsShell({ children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <CmsSidebarNav />
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}