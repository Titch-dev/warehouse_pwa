"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callableAfricaSouth1 } from "@/lib/firebase/functions";
import { uploadGalleryRawImage } from "@/lib/gallery/upload-gallery-image";
import {
  buildInitialGalleryForm,
  buildGalleryPayload,
} from "@/lib/gallery/gallery-form-utils";
import styles from "./gallery-form.module.css";

export default function GalleryForm({
  mode = "create",
  galleryDoc = null,
  galleryId = null,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState(buildInitialGalleryForm(galleryDoc));
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      let imagePath = values.imagePath;

      if (imageFile) {
        const tempId = galleryId || crypto.randomUUID();

        const uploadResult = await uploadGalleryRawImage({
          file: imageFile,
          galleryId: tempId,
        });

        imagePath = uploadResult.optimizedPath;
      }

      const payload = buildGalleryPayload({
        ...values,
        imagePath,
      });

      if (isEdit) {
        const updateGalleryItem = callableAfricaSouth1("updateGalleryItem");
        await updateGalleryItem({
          galleryId,
          updates: payload,
        });
      } else {
        const createGalleryItem = callableAfricaSouth1("createGalleryItem");
        await createGalleryItem(payload);
      }

      router.push("/dashboard/cms/gallery");
    } catch (err) {
      console.error("Gallery save failed:", err);
      setError(err?.message || "Unable to save gallery item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error ? <p className={styles.error}>{error}</p> : null}

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={values.visible}
          onChange={(e) => updateField("visible", e.target.checked)}
          disabled={submitting}
        />
        <span>Visible</span>
      </label>

      <label className={styles.field}>
        <span>Order</span>
        <input
          type="number"
          step="1"
          value={values.order}
          onChange={(e) => updateField("order", e.target.value)}
          disabled={submitting}
          placeholder="Optional"
        />
      </label>

      <label className={styles.field}>
        <span>Tags</span>
        <input
          value={values.tags}
          onChange={(e) => updateField("tags", e.target.value)}
          disabled={submitting}
          placeholder="Comma separated e.g. friday, crowd, dj"
        />
      </label>

      <label className={styles.field}>
        <span>{isEdit ? "Replace image" : "Upload image"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          disabled={submitting}
          required={!isEdit}
        />
      </label>

      {values.imagePath ? (
        <p className={styles.meta}>Current image path: {values.imagePath}</p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/cms/gallery")}
        >
          Cancel
        </button>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Upload image"}
        </button>
      </div>
    </form>
  );
}