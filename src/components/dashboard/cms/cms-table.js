"use client";

import { useEffect, useMemo, useState } from "react";
import CmsSearchInput from "./cms-search-input";
import CmsPagination from "./cms-pagination";
import styles from "./cms-table.module.css";

export default function CmsTable({
  columns = [],
  rows = [],
  getRowKey,
  renderRowActions,
  filtersSlot = null,
  pageSize = 10,
  searchKeys = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No records found.",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) =>
      searchKeys.some((key) => {
        const value = row?.[key];
        return String(value ?? "").toLowerCase().includes(query);
      })
    );
  }, [rows, search, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <CmsSearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
          />
        </div>

        {filtersSlot ? <div className={styles.filters}>{filtersSlot}</div> : null}
      </div>

      <div className={styles.tableOuter}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {renderRowActions ? <th className={styles.actionsHead}>Actions</th> : null}
            </tr>
          </thead>

          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  className={styles.empty}
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {typeof column.render === "function"
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}

                  {renderRowActions ? (
                    <td className={styles.actionsCell}>
                      {renderRowActions(row)}
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CmsPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}