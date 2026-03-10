"use client";

export default function PoolLiveFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}) {
  const options = [
    { key: "all", label: "All" },
    { key: "valid", label: "Valid" },
    { key: "needs_action", label: "Needs action" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
        maxWidth: "820px",
        padding: "1rem",
        border: "1px solid #333",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "0.4rem",
        }}
      >
        <label htmlFor="pool-live-search">
          <strong>Search</strong>
        </label>

        <input
          id="pool-live-search"
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by customer name or email"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "1px solid #444",
            background: "transparent",
            color: "inherit",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {options.map((option) => {
          const active = filter === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onFilterChange(option.key)}
              style={{
                padding: "0.6rem 0.9rem",
                borderRadius: "999px",
                border: "1px solid #444",
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}