"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callable } from "@/lib/firebase/functions";
import { SPECIAL_TYPES, WEEK_DAYS } from "@/lib/specials/specials-config";
import {
  buildInitialSpecialForm,
  buildSpecialPayload,
} from "@/lib/specials/specials-form-utils";
import { uploadSpecialRawImage } from "@/lib/specials/upload-special-image";
import styles from "./specials-form.module.css";

export default function SpecialsForm({
  mode = "create",
  specialDoc = null,
  specialId = null,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState(buildInitialSpecialForm(specialDoc));
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleWeekDay(day) {
    setValues((prev) => {
      const exists = prev.weekDays.includes(day);

      return {
        ...prev,
        weekDays: exists
          ? prev.weekDays.filter((value) => value !== day)
          : [...prev.weekDays, day].sort((a, b) => a - b),
      };
    });
  }

  function addOffer() {
    setValues((prev) => ({
      ...prev,
      offers: [...prev.offers, { offer: "", price: "" }],
    }));
  }

  function updateOffer(index, key, value) {
    setValues((prev) => ({
      ...prev,
      offers: prev.offers.map((offer, offerIndex) =>
        offerIndex === index ? { ...offer, [key]: value } : offer
      ),
    }));
  }

  function removeOffer(index) {
    setValues((prev) => ({
      ...prev,
      offers:
        prev.offers.length === 1
          ? prev.offers
          : prev.offers.filter((_, offerIndex) => offerIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const localSpecialId =
        specialId ||
        `${values.type}-${values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

      let imagePath = values.imagePath;

      if (imageFile) {
        const uploadResult = await uploadSpecialRawImage({
          file: imageFile,
          specialId: localSpecialId,
        });

        imagePath = uploadResult.optimizedPath;
      }

      const payload = buildSpecialPayload({
        ...values,
        imagePath,
      });

      if (isEdit) {
        const updateSpecial = callable("updateSpecial");
        await updateSpecial({
          specialId,
          updates: payload,
        });
      } else {
        const createSpecial = callable("createSpecial");
        await createSpecial(payload);
      }

      router.push("/dashboard/cms/specials");
    } catch (err) {
      console.error("Special save failed:", err);
      setError(err?.message || "Unable to save special.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={submitting}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Type</span>
          <select
            value={values.type}
            onChange={(e) => updateField("type", e.target.value)}
            disabled={submitting}
          >
            <option value={SPECIAL_TYPES.FOOD}>Food</option>
            <option value={SPECIAL_TYPES.DRINK}>Drink</option>
          </select>
        </label>
      </div>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => updateField("isActive", e.target.checked)}
          disabled={submitting}
        />
        <span>Active</span>
      </label>

      <div className={styles.field}>
        <span>Week days</span>
        <div className={styles.checkboxRow}>
          {WEEK_DAYS.map((day) => (
            <label key={day.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={values.weekDays.includes(day.value)}
                onChange={() => toggleWeekDay(day.value)}
                disabled={submitting}
              />
              <span>{day.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Image upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            disabled={submitting}
          />
        </label>
      </div>

      {values.imagePath ? (
        <p className={styles.meta}>Current image path: {values.imagePath}</p>
      ) : null}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Offers</h3>
          <button type="button" onClick={addOffer} disabled={submitting}>
            Add offer
          </button>
        </div>

        {values.offers.map((row, index) => (
          <div key={index} className={styles.row}>
            <label className={styles.field}>
              <span>Offer</span>
              <input
                value={row.offer}
                onChange={(e) => updateOffer(index, "offer", e.target.value)}
                disabled={submitting}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Price</span>
              <input
                type="number"
                min="0"
                step="1"
                value={row.price}
                onChange={(e) => updateOffer(index, "price", e.target.value)}
                disabled={submitting}
                placeholder="Optional"
              />
            </label>

            <div className={styles.removeWrap}>
              <button
                type="button"
                onClick={() => removeOffer(index)}
                disabled={submitting || values.offers.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/cms/specials")}
        >
          Cancel
        </button>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create special"}
        </button>
      </div>
    </form>
  );
}