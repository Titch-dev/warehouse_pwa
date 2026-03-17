"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import GalleryForm from "@/components/dashboard/cms/gallery-form";
import { warehouseDb } from "@/firebase/firebaseConfig";

export default function EditGalleryItemPage() {
  const searchParams = useSearchParams();
  const galleryId = searchParams.get("galleryId");

  const [galleryDoc, setGalleryDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!galleryId) {
      setLoading(false);
      setGalleryDoc(null);
      return;
    }

    const ref = doc(warehouseDb, "gallery", galleryId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setGalleryDoc(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [galleryId]);

  if (loading) {
    return (
      <section>
        <p>Loading gallery item...</p>
      </section>
    );
  }

  if (!galleryId) {
    return (
      <section>
        <p>Missing galleryId.</p>
      </section>
    );
  }

  if (!galleryDoc) {
    return (
      <section>
        <p>Gallery item not found.</p>
      </section>
    );
  }

  return (
    <section>
      <CmsSectionHeader
        title="Edit Gallery Image"
        description="Update this gallery item."
      />
      <GalleryForm mode="edit" galleryDoc={galleryDoc} galleryId={galleryId} />
    </section>
  );
}