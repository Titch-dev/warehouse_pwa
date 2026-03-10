"use client";

import { useEffect, useMemo, useState } from "react";
import { formatElapsed } from "@/lib/time/format-elapsed";

export default function PoolSessionTimer({ startedAt }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((v) => v + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const value = useMemo(() => formatElapsed(startedAt), [startedAt, tick]);

  return <span>{value}</span>;
}