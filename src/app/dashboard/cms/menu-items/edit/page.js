"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import MenuItemForm from "@/components/dashboard/cms/menu-item-form";
import { warehouseDb } from "@/firebase/firebaseConfig";

export default function EditMenuItemPage() {
  const searchParams = useSearchParams();
  const menuId = searchParams.get("menuId");

  const [menuDoc, setMenuDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!menuId) {
      setLoading(false);
      setMenuDoc(null);
      return;
    }

    const ref = doc(warehouseDb, "menu", menuId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setMenuDoc(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [menuId]);

  if (loading) {
    return (
      <section>
        <p>Loading menu item...</p>
      </section>
    );
  }

  if (!menuId) {
    return (
      <section>
        <p>Missing menuId.</p>
      </section>
    );
  }

  if (!menuDoc) {
    return (
      <section>
        <p>Menu item not found.</p>
      </section>
    );
  }

  return (
    <section>
      <CmsSectionHeader
        title={`Edit: ${menuDoc.name}`}
        description="Update this menu item."
      />
      <MenuItemForm mode="edit" menuDoc={menuDoc} menuId={menuId} />
    </section>
  );
}