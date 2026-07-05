"use client";

import { useTranslation } from "@/context/locale-context";
import {
  listingToFormValues,
  type AdminListing,
  type AdminListingInput,
} from "@/lib/admin-api";
import { useEffect, useState } from "react";

type AdminPropertyFormProps = {
  listing?: AdminListing;
  onSubmit: (values: AdminListingInput) => Promise<void>;
  submitLabel: string;
};

function imagesToText(images: Array<{ url: string }>) {
  return images.map((image) => image.url).join("\n");
}

function textToImages(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ url, caption: "" }));
}

export function AdminPropertyForm({
  listing,
  onSubmit,
  submitLabel,
}: AdminPropertyFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<AdminListingInput>(() => listingToFormValues(listing));
  const [imageText, setImageText] = useState(() => imagesToText(listing?.images ?? []));
  const [amenitiesText, setAmenitiesText] = useState(() => (listing?.amenities ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(listingToFormValues(listing));
    setImageText(imagesToText(listing?.images ?? []));
    setAmenitiesText((listing?.amenities ?? []).join(", "));
  }, [listing]);

  const update = <K extends keyof AdminListingInput>(key: K, value: AdminListingInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...values,
        images: textToImages(imageText),
        amenities: amenitiesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-5 rounded-[28px] border border-neutral-200 bg-white p-6 md:grid-cols-2">
        <Field label={t.admin.name}>
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.city}>
          <input
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.address} className="md:col-span-2">
          <input
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.country}>
          <input
            value={values.country}
            onChange={(e) => update("country", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.price}>
          <input
            type="number"
            min="0"
            step="1"
            value={values.basePrice}
            onChange={(e) => update("basePrice", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.currency}>
          <input
            value={values.currency}
            onChange={(e) => update("currency", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.beds}>
          <input
            type="number"
            min="0"
            value={values.beds}
            onChange={(e) => update("beds", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.bathrooms}>
          <input
            type="number"
            min="0"
            value={values.bathrooms}
            onChange={(e) => update("bathrooms", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.guests}>
          <input
            type="number"
            min="1"
            value={values.personCapacity}
            onChange={(e) => update("personCapacity", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.squareMeters}>
          <input
            type="number"
            min="0"
            value={values.squareMeters ?? ""}
            onChange={(e) =>
              update("squareMeters", e.target.value ? Number(e.target.value) : null)
            }
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.latitude}>
          <input
            type="number"
            step="any"
            value={values.lat ?? ""}
            onChange={(e) => update("lat", e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          />
        </Field>
        <Field label={t.admin.longitude}>
          <input
            type="number"
            step="any"
            value={values.lng ?? ""}
            onChange={(e) => update("lng", e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-3 text-sm text-neutral-700 md:col-span-2">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300"
          />
          {t.admin.publishedLabel}
        </label>
        <Field label={t.admin.description} className="md:col-span-2">
          <textarea
            rows={6}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label={t.admin.imageUrls} className="md:col-span-2">
          <textarea
            rows={5}
            value={imageText}
            onChange={(e) => setImageText(e.target.value)}
            className={`${inputClass} resize-y font-mono text-xs`}
          />
        </Field>
        <Field label={t.admin.amenities} className="md:col-span-2">
          <input
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            className={inputClass}
          />
        </Field>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving ? "…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100";
