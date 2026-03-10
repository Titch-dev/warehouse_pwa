"use client";

import { useMemo, useState } from "react";

import { useActivePoolSessions } from "@/hooks/useActivePoolSessions";
import { getMembershipStatusMeta } from "@/lib/pool/pool-live-status";

import PoolLiveFilters from "@/components/pool/pool-live/pool-live-filters";
import PoolLiveSessionCard from "@/components/pool/pool-live/pool-live-session-card";

function matchesSearch(session, term) {
  const name = (session?.userSnapshot?.displayName || "").toLowerCase();
  const email = (session?.userSnapshot?.email || "").toLowerCase();

  return !term || name.includes(term) || email.includes(term);
}

function matchesFilter(session, filter) {
  const meta = getMembershipStatusMeta(session?.membershipSnapshot);

  if (filter === "valid") {
    return meta.isValid;
  }

  if (filter === "needs_action") {
    return !meta.isValid;
  }

  return true;
}

export default function PoolLiveView() {
  const { sessions, loading, error } = useActivePoolSessions();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredSessions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return sessions.filter((session) => {
      return matchesSearch(session, term) && matchesFilter(session, filter);
    });
  }, [sessions, searchTerm, filter]);

  if (loading) {
    return (
      <section>
        <h1>Pool Live</h1>
        <p>Loading active sessions...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>Pool Live</h1>
        <p>Could not load active sessions right now.</p>
      </section>
    );
  }

  return (
    <section
      style={{
        display: "grid",
        gap: "1rem",
      }}
    >
      <div>
        <h1>Pool Live</h1>
        <p>
          <strong>Currently active:</strong> {sessions.length}
        </p>
      </div>
      <PoolLiveFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
      />

      {sessions.length === 0 ? (
        <p>No active pool sessions right now.</p>
      ) : filteredSessions.length === 0 ? (
        <p>No active sessions match the current search/filter.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: "820px",
          }}
        >
          {filteredSessions.map((session) => (
            <PoolLiveSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </section>
  );
}