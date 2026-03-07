"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { warehouseAuth } from "@/firebase/firebaseConfig";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(warehouseAuth);
    router.replace("/login");
  }

  return (
    <button onClick={handleLogout} style={{ padding: 12 }}>
      Log out
    </button>
  );
}