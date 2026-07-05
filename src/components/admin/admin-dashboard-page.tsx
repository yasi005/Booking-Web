"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { useTranslation } from "@/context/locale-context";
import {
  deleteAdminListing,
  fetchAdminListings,
  fetchAdminSession,
  fetchAdminStats,
  syncAdminListings,
  type AdminListing,
  type AdminStats,
} from "@/lib/admin-api";
import { formatCurrency } from "@/lib/utils";
import { Navigation } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function googleMapsDirectionsUrl(listing: AdminListing): string {
  const address = [listing.address, listing.city, listing.country]
    .filter(Boolean)
    .join(", ");
  const destination =
    address ||
    (listing.lat != null && listing.lng != null ? `${listing.lat},${listing.lng}` : listing.name);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const session = await fetchAdminSession();
      if (!session) {
        router.replace("/staff?next=/admin");
        return;
      }

      setUsername(session.username);
      const [nextStats, nextListings] = await Promise.all([
        fetchAdminStats(),
        fetchAdminListings(),
      ]);
      setStats(nextStats);
      setListings(nextListings);
      setLoading(false);
    } catch {
      router.replace("/staff?next=/admin");
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("synced") === "1") {
      setNotice(t.admin.syncSuccess);
    }
  }, [searchParams, t.admin.syncSuccess]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return listings;
    return listings.filter((listing) => {
      const haystack = `${listing.name} ${listing.city} ${listing.address} ${listing.description}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [listings, query]);

  const handleSync = async () => {
    setSyncing(true);
    setNotice(null);
    try {
      await syncAdminListings();
      setNotice(t.admin.syncSuccess);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (listing: AdminListing) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    await deleteAdminListing(listing.id);
    setNotice(t.admin.deleteSuccess);
    await load();
  };

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-neutral-500">{t.admin.loading}</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell username={username ?? undefined} onSync={handleSync} syncing={syncing} notice={notice}>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label={t.admin.total} value={String(stats?.total ?? 0)} />
        <StatCard label={t.admin.published} value={String(stats?.published ?? 0)} />
        <StatCard label={t.admin.lastSync} value={stats?.lastSyncedAt ?? "—"} small />
      </div>

      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.admin.searchPlaceholder}
          className="w-full max-w-xl rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-neutral-400"
        />
      </div>

      <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] tracking-[0.16em] text-neutral-500 uppercase">
              <tr>
                <th className="px-5 py-4">{t.admin.name}</th>
                <th className="px-5 py-4">{t.admin.city}</th>
                <th className="px-5 py-4">{t.admin.price}</th>
                <th className="px-5 py-4">{t.admin.beds}</th>
                <th className="px-5 py-4">{t.admin.status}</th>
                <th className="px-5 py-4">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing) => (
                <tr key={listing.id} className="border-b border-neutral-100 last:border-none">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium text-neutral-900">{listing.name}</div>
                        <div className="text-xs text-neutral-500">#{listing.id}</div>
                      </div>
                      <a
                        href={googleMapsDirectionsUrl(listing)}
                        target="_blank"
                        rel="noreferrer"
                        title={t.admin.directions}
                        aria-label={t.admin.directions}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600">{listing.city}</td>
                  <td className="px-5 py-4 text-neutral-600">
                    {formatCurrency(listing.basePrice ?? 0)}
                  </td>
                  <td className="px-5 py-4 text-neutral-600">{listing.beds}</td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        listing.published !== false
                          ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                      }
                    >
                      {listing.published !== false ? t.admin.publishedLabel : t.admin.draftLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/properties/${listing.id}/edit`}
                        className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                      >
                        {t.admin.edit}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(listing)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        {t.admin.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-5">
      <p className="text-[11px] tracking-[0.16em] text-neutral-500 uppercase">{label}</p>
      <p className={`mt-2 font-serif text-neutral-900 ${small ? "text-base" : "text-3xl"}`}>
        {value}
      </p>
    </div>
  );
}
