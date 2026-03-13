"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import MenuMiscForm from "@/components/dashboard/cms/menu-misc-form";
import { warehouseDb } from "@/firebase/firebaseConfig";

export default function EditMenuMiscPage() {
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
        <p>Loading menu misc...</p>
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
        <p>Menu misc document not found.</p>
      </section>
    );
  }

  return (
    <section>
      <CmsSectionHeader
        title="Edit Menu Misc"
        description="Update this extras group or notice."
      />
      <MenuMiscForm mode="edit" menuDoc={menuDoc} menuId={menuId} />
    </section>
  );
}