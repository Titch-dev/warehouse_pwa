"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { callable } from "@/lib/firebase/functions";
import { uploadMenuRawImage } from "@/lib/menu/upload-menu-image";
import {
  BURGER_BADGES,
  MENU_TYPES,
  categorySupportsBadges,
  categorySupportsBrewery,
  categorySupportsImage,
  getCategoriesForMenuType,
} from "@/lib/menu/menu-config";
import {
  buildInitialMenuItemForm,
  buildMenuItemPayload,
} from "@/lib/menu/menu-form-utils";
import styles from "./menu-item-form.module.css";

export default function MenuItemForm({
  mode = "create",
  menuDoc = null,
  menuId = null,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState(buildInitialMenuItemForm(menuDoc));
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = getCategoriesForMenuType(values.menuType);
  const showBadges = categorySupportsBadges(values.menuType, values.category);
  const showBrewery = categorySupportsBrewery(values.menuType, values.category);
  const showImage = categorySupportsImage(values.menuType, values.category);

  function updateField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updatePricingRow(index, key, value) {
    setValues((prev) => ({
      ...prev,
      pricing: prev.pricing.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      ),
    }));
  }

  function addPricingRow() {
    setValues((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { amount: "", label: "" }],
    }));
  }

  function removePricingRow(index) {
    setValues((prev) => ({
      ...prev,
      pricing:
        prev.pricing.length === 1
          ? prev.pricing
          : prev.pricing.filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  function toggleBadge(badge) {
    setValues((prev) => {
      const exists = prev.badges.includes(badge);

      return {
        ...prev,
        badges: exists
          ? prev.badges.filter((b) => b !== badge)
          : [...prev.badges, badge],
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const localMenuId =
        menuId ||
        `${values.menuType}-${values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

      let imagePath = values.imagePath;

      if (showImage && imageFile) {
        const uploadResult = await uploadMenuRawImage({
          file: imageFile,
          menuId: localMenuId,
        });

        imagePath = uploadResult.optimizedPath;
      }

      const payload = buildMenuItemPayload({
        ...values,
        imagePath,
      });

      if (isEdit) {
        const updateMenuItem = callable("updateMenuItem");
        await updateMenuItem({
          menuId,
          updates: payload,
        });
      } else {
        const createMenuItem = callable("createMenuItem");
        await createMenuItem(payload);
      }

      router.push("/dashboard/cms/menu-items");
    } catch (err) {
      console.error("Menu save failed:", err);
      setError(err?.message || "Unable to save menu item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Menu type</span>
          <select
            value={values.menuType}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                menuType: e.target.value,
                category: "",
                badges: [],
                brewery: "",
                imagePath: "",
              }))
            }
            disabled={submitting}
          >
            <option value={MENU_TYPES.FOOD}>Food</option>
            <option value={MENU_TYPES.DRINK}>Drink</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Category</span>
          <select
            value={values.category}
            onChange={(e) => updateField("category", e.target.value)}
            disabled={submitting}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

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
          <span>Sort order</span>
          <input
            type="number"
            step="1"
            value={values.sortOrder}
            onChange={(e) => updateField("sortOrder", e.target.value)}
            disabled={submitting}
            placeholder="Optional"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Description</span>
        <textarea
          rows={5}
          value={values.description}
          onChange={(e) => updateField("description", e.target.value)}
          disabled={submitting}
        />
      </label>

      {showBrewery ? (
        <label className={styles.field}>
          <span>Brewery</span>
          <input
            value={values.brewery}
            onChange={(e) => updateField("brewery", e.target.value)}
            disabled={submitting}
            placeholder="Optional"
          />
        </label>
      ) : null}

      {showBadges ? (
        <div className={styles.field}>
          <span>Badges</span>
          <div className={styles.checkboxRow}>
            {BURGER_BADGES.map((badge) => (
              <label key={badge} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={values.badges.includes(badge)}
                  onChange={() => toggleBadge(badge)}
                  disabled={submitting}
                />
                <span>{badge}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {showImage ? (
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
      ) : null}

      {showImage && values.imagePath ? (
        <p className={styles.meta}>Current image path: {values.imagePath}</p>
      ) : null}

      <div className={styles.pricingSection}>
        <div className={styles.pricingHeader}>
          <h3>Pricing</h3>
          <button type="button" onClick={addPricingRow} disabled={submitting}>
            Add row
          </button>
        </div>

        {values.pricing.map((row, index) => (
          <div key={index} className={styles.row}>
            <label className={styles.field}>
              <span>Amount</span>
              <input
                type="number"
                min="0"
                step="1"
                value={row.amount}
                onChange={(e) => updatePricingRow(index, "amount", e.target.value)}
                disabled={submitting}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Label</span>
              <input
                value={row.label}
                onChange={(e) => updatePricingRow(index, "label", e.target.value)}
                disabled={submitting}
                placeholder="Optional e.g. single, double, 500ml"
              />
            </label>

            <div className={styles.removeWrap}>
              <button
                type="button"
                onClick={() => removePricingRow(index)}
                disabled={submitting || values.pricing.length === 1}
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
          onClick={() => router.push("/dashboard/cms/menu-items")}
        >
          Cancel
        </button>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create item"}
        </button>
      </div>
    </form>
  );
}