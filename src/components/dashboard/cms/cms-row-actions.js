"use client";

import Link from "next/link";
import styles from "./cms-row-actions.module.css";

export default function CmsRowActions({
  editHref = null,
  onDelete,
  disableEdit = false,
  disableDelete = false,
  loading = false,
}) {
  return (
    <div className={styles.actions}>
      {editHref && !disableEdit ? (
        <Link href={editHref} className={styles.button}>
          Edit
        </Link>
      ) : (
        <span className={`${styles.button} ${styles.disabled}`}>Edit</span>
      )}

      <button
        type="button"
        onClick={onDelete}
        disabled={disableDelete || loading}
        className={`${styles.button} ${styles.danger}`}
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}