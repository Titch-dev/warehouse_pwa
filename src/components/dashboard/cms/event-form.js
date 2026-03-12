"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { callable } from "@/lib/firebase/functions";
import { uploadEventRawImage } from "@/lib/events/upload-event-image";
import {
  buildEventPayload,
  buildInitialEventForm,
  EVENT_SOURCES,
  EVENT_TYPES,
} from "@/lib/events/event-form-utils";
import styles from "./event-form.module.css";

export default function EventForm({
  mode = "create",
  eventDoc = null,
  eventId = null,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const isFacebook = eventDoc?.source === EVENT_SOURCES.FACEBOOK;

  const [values, setValues] = useState(buildInitialEventForm(eventDoc));
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const minDate = useMemo(() => dayjs(), []);

  function updateField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const localUploadId = eventId || crypto.randomUUID();
      let imagePath = values.imagePath;

      if (imageFile) {
        const uploadResult = await uploadEventRawImage({
          file: imageFile,
          eventId: localUploadId,
        });

        imagePath = uploadResult.optimizedPath;
      }

      const payload = buildEventPayload(
        {
          ...values,
          imagePath,
        },
        eventDoc?.source || "manual"
      );

      if (isEdit) {
        const updateEvent = callable("updateEvent");
        await updateEvent({
          eventId,
          updates: payload,
        });
      } else {
        const createEvent = callable("createEvent");
        await createEvent(payload);
      }

      router.push("/dashboard/cms/events");
    } catch (err) {
      setError(err?.message || "Unable to save event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error ? <p className={styles.error}>{error}</p> : null}

        <label className={styles.field}>
          <span>Name</span>
          <input
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            disabled={isFacebook || submitting}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Description</span>
          <textarea
            rows={6}
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            disabled={isFacebook || submitting}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Type</span>
            <select
              value={values.type}
              onChange={(e) => updateField("type", e.target.value)}
              disabled={isFacebook || submitting}
            >
              <option value={EVENT_TYPES.ONE_OFF}>One-off</option>
              <option value={EVENT_TYPES.WEEKLY}>Weekly</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Ticket URL</span>
            <input
              value={values.ticket_url}
              onChange={(e) => updateField("ticket_url", e.target.value)}
              disabled={isFacebook || submitting}
            />
          </label>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <span>Start time</span>
            <DateTimePicker
              value={values.start_time}
              onChange={(value) => updateField("start_time", value)}
              disablePast
              disabled={isFacebook || submitting}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </div>

          <div className={styles.field}>
            <span>End time</span>
            <DateTimePicker
              value={values.end_time}
              onChange={(value) => updateField("end_time", value)}
              disablePast
              disabled={isFacebook || submitting}
              minDateTime={values.start_time || minDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Price mode</span>
            <select
              value={values.priceMode}
              onChange={(e) => updateField("priceMode", e.target.value)}
              disabled={isFacebook || submitting}
            >
              <option value="free">Free entry</option>
              <option value="paid">Paid</option>
              <option value="tbc">TBC</option>
            </select>
          </label>

          {values.priceMode === "paid" ? (
            <>
              <label className={styles.field}>
                <span>Price values</span>
                <input
                  value={values.priceValues}
                  onChange={(e) => updateField("priceValues", e.target.value)}
                  placeholder="e.g. 65, 80, 350"
                  disabled={isFacebook || submitting}
                />
              </label>

              <label className={styles.field}>
                <span>Price basis</span>
                <input
                  value={values.priceDenom}
                  onChange={(e) => updateField("priceDenom", e.target.value)}
                  placeholder="e.g. pp, per team, per table"
                  disabled={isFacebook || submitting}
                />
              </label>
            </>
          ) : null}
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Image upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={isFacebook || submitting}
            />
          </label>
        </div>

        {values.imagePath ? (
          <p className={styles.meta}>Current image path: {values.imagePath}</p>
        ) : null}

        {isFacebook ? (
          <p className={styles.meta}>
            Facebook-synced events are read-only and will be overwritten on sync.
          </p>
        ) : null}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push("/dashboard/cms/events")}
          >
            Cancel
          </button>

          <button type="submit" disabled={submitting || isFacebook}>
            {submitting ? "Saving..." : isEdit ? "Save changes" : "Create event"}
          </button>
        </div>
      </form>
    </LocalizationProvider>
  );
}