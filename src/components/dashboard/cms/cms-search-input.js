"use client";

import styles from "./cms-search-input.module.css";

export default function CmsSearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={styles.input}
    />
  );
}