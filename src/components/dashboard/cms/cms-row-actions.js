"use client";

import styles from "./cms-row-actions.module.css";

export default function CmsRowActions({ onEdit, onDelete }) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        onClick={onEdit}
        className={styles.button}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        className={`${styles.button} ${styles.danger}`}
      >
        Delete
      </button>
    </div>
  );
}