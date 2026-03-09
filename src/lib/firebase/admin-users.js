import { callable } from "./functions";

export async function setUserRole({ userId, role }) {
  const fn = callable("setUserRole");
  const result = await fn({ userId, role });
  return result.data;
}

export async function suspendUser({ userId, suspended }) {
  const fn = callable("suspendUser");
  const result = await fn({ userId, suspended });
  return result.data;
}