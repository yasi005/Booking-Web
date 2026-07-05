"use client";

import { AdminPropertyForm } from "@/components/admin/admin-property-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { useTranslation } from "@/context/locale-context";
import {
  createAdminListing,
  fetchAdminListing,
  fetchAdminSession,
  updateAdminListing,
  type AdminListingInput,
} from "@/lib/admin-api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AdminPropertyEditorProps = {
  listingId?: number;
};

export function AdminPropertyEditor({ listingId }: AdminPropertyEditorProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [listing, setListing] = useState<Awaited<ReturnType<typeof fetchAdminListing>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const isEdit = listingId !== undefined;

  useEffect(() => {
    async function load() {
      const session = await fetchAdminSession();
      if (!session) {
        router.replace(`/staff?next=${isEdit ? `/admin/properties/${listingId}/edit` : "/admin/properties/new"}`);
        return;
      }
      setUsername(session.username);

      if (isEdit) {
        const nextListing = await fetchAdminListing(listingId);
        setListing(nextListing);
      }

      setLoading(false);
    }

    void load();
  }, [isEdit, listingId, router]);

  const handleSubmit = async (values: AdminListingInput) => {
    if (isEdit) {
      await updateAdminListing(listingId, values);
      setNotice(t.admin.saveSuccess);
    } else {
      await createAdminListing(values);
      setNotice(t.admin.createSuccess);
      router.push("/admin");
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-neutral-500">{t.admin.loading}</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell username={username ?? undefined} notice={notice}>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-neutral-900">
          {isEdit ? t.admin.editTitle : t.admin.createTitle}
        </h2>
      </div>
      <AdminPropertyForm
        listing={listing ?? undefined}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? t.admin.save : t.admin.create}
      />
    </AdminShell>
  );
}
