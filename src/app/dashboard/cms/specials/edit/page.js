"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import SpecialsForm from "@/components/dashboard/cms/specials-form";
import { warehouseDb } from "@/firebase/firebaseConfig";

export default function EditSpecialPage() {
  const searchParams = useSearchParams();
  const specialId = searchParams.get("specialId");

  const [specialDoc, setSpecialDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!specialId) {
      setLoading(false);
      setSpecialDoc(null);
      return;
    }

    const ref = doc(warehouseDb, "specials", specialId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setSpecialDoc(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [specialId]);

  if (loading) {
    return (
      <section>
        <p>Loading special...</p>
      </section>
    );
  }

  if (!specialId) {
    return (
      <section>
        <p>Missing specialId.</p>
      </section>
    );
  }

  if (!specialDoc) {
    return (
      <section>
        <p>Special not found.</p>
      </section>
    );
  }

  return (
    <section>
      <CmsSectionHeader
        title={`Edit: ${specialDoc.name}`}
        description="Update this special."
      />
      <SpecialsForm mode="edit" specialDoc={specialDoc} specialId={specialId} />
    </section>
  );
}