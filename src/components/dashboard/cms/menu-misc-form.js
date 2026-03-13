"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { callable } from "@/lib/firebase/functions";
import {
  MENU_MISC_ENTITY_TYPES,
  MENU_TYPES,
  getCategoriesForMiscEntity,
} from "@/lib/menu/menu-config";
import {
  buildInitialMenuMiscForm,
  buildMenuMiscPayload,
} from "@/lib/menu/menu-misc-form-utils";
import styles from "./menu-misc-form.module.css";

export default function MenuMiscForm({
  mode = "create",
  menuDoc = null,
  menuId = null,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [values, setValues] = useState(buildInitialMenuMiscForm(menuDoc));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = useMemo(() => {
    return getCategoriesForMiscEntity(values.entityType, values.menuType);
  }, [values.entityType, values.menuType]);

  function updateField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAppliesTo(category) {
    setValues((prev) => {
      const exists = prev.appliesTo.includes(category);

      return {
        ...prev,
        appliesTo: exists
          ? prev.appliesTo.filter((item) => item !== category)
          : [...prev.appliesTo, category],
      };
    });
  }

  function addExtrasItem() {
    setValues((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", amount: "" }],
    }));
  }

  function updateExtrasItem(index, key, value) {
    setValues((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function removeExtrasItem(index) {
    setValues((prev) => ({
      ...prev,
      items:
        prev.items.length === 1
          ? prev.items
          : prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addMessage() {
    setValues((prev) => ({
      ...prev,
      messages: [...prev.messages, { value: "" }],
    }));
  }

  function updateMessage(index, value) {
    setValues((prev) => ({
      ...prev,
      messages: prev.messages.map((message, messageIndex) =>
        messageIndex === index ? { value } : message
      ),
    }));
  }

  function removeMessage(index) {
    setValues((prev) => ({
      ...prev,
      messages:
        prev.messages.length === 1
          ? prev.messages
          : prev.messages.filter((_, messageIndex) => messageIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const payload = buildMenuMiscPayload(values);

      if (isEdit) {
        const updateMenuMisc = callable("updateMenuMisc");
        await updateMenuMisc({
          menuId,
          updates: payload,
        });
      } else {
        const createMenuMisc = callable("createMenuMisc");
        await createMenuMisc(payload);
      }

      router.push("/dashboard/cms/menu-misc");
    } catch (err) {
      console.error("Menu misc save failed:", err);
      setError(err?.message || "Unable to save menu misc document.");
    } finally {
      setSubmitting(false);
    }
  }

  const isExtrasGroup =
    values.entityType === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Document type</span>
          <select
            value={values.entityType}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                entityType: e.target.value,
                menuType:
                  e.target.value === MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP
                    ? MENU_TYPES.FOOD
                    : prev.menuType,
                appliesTo: [],
              }))
            }
            disabled={submitting || isEdit}
          >
            <option value={MENU_MISC_ENTITY_TYPES.EXTRAS_GROUP}>
              Extras Group
            </option>
            <option value={MENU_MISC_ENTITY_TYPES.NOTICE}>Notice</option>
          </select>
        </label>

        {!isExtrasGroup ? (
          <label className={styles.field}>
            <span>Menu type</span>
            <select
              value={values.menuType}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  menuType: e.target.value,
                  appliesTo: [],
                }))
              }
              disabled={submitting}
            >
              <option value={MENU_TYPES.FOOD}>Food</option>
              <option value={MENU_TYPES.DRINK}>Drink</option>
            </select>
          </label>
        ) : null}
      </div>

      {isExtrasGroup ? (
        <label className={styles.field}>
            <span>Group title</span>
            <input
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={submitting}
            required
            />
        </label>
        ) : null}

      <div className={styles.field}>
        <span>Applies to</span>
        <div className={styles.checkboxRow}>
          {categoryOptions.map((category) => (
            <label key={category} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={values.appliesTo.includes(category)}
                onChange={() => toggleAppliesTo(category)}
                disabled={submitting}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {isExtrasGroup ? (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Items</h3>
            <button type="button" onClick={addExtrasItem} disabled={submitting}>
              Add item
            </button>
          </div>

          {values.items.map((item, index) => (
            <div key={index} className={styles.row}>
              <label className={styles.field}>
                <span>Name</span>
                <input
                  value={item.name}
                  onChange={(e) =>
                    updateExtrasItem(index, "name", e.target.value)
                  }
                  disabled={submitting}
                />
              </label>

              <label className={styles.field}>
                <span>Amount</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.amount}
                  onChange={(e) =>
                    updateExtrasItem(index, "amount", e.target.value)
                  }
                  disabled={submitting}
                />
              </label>

              <div className={styles.removeWrap}>
                <button
                  type="button"
                  onClick={() => removeExtrasItem(index)}
                  disabled={submitting || values.items.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
              disabled={submitting}
            />
            <span>Active</span>
          </label>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Messages</h3>
              <button type="button" onClick={addMessage} disabled={submitting}>
                Add message
              </button>
            </div>

            {values.messages.map((message, index) => (
              <div key={index} className={styles.row}>
                <label className={styles.field}>
                  <span>Message</span>
                  <input
                    value={message.value}
                    onChange={(e) => updateMessage(index, e.target.value)}
                    disabled={submitting}
                  />
                </label>

                <div className={styles.removeWrap}>
                  <button
                    type="button"
                    onClick={() => removeMessage(index)}
                    disabled={submitting || values.messages.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/cms/menu-misc")}
        >
          Cancel
        </button>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create"}
        </button>
      </div>
    </form>
  );
}