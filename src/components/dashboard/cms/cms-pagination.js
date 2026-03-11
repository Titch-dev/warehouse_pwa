"use client";

import styles from "./cms-pagination.module.css";

export default function CmsPagination({
  page,
  totalPages,
  onPageChange,
}) {
  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoBack}
        className={styles.button}
      >
        Previous
      </button>

      <p className={styles.text}>
        Page {page} of {totalPages}
      </p>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoForward}
        className={styles.button}
      >
        Next
      </button>
    </div>
  );
}