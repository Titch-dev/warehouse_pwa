"use client";

import { callable } from "@/lib/firebase/functions";

export async function extendMembership({ userId, monthsAdded, receiptRef }) {
  const runExtendMembership = callable("extendMembership");

  const response = await runExtendMembership({
    userId,
    monthsAdded,
    receiptRef: receiptRef?.trim() || null,
  });

  return response.data;
}