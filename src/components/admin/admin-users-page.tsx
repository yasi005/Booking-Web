"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { useTranslation } from "@/context/locale-context";
import {
  deleteAdminUser,
  fetchAdminSession,
  fetchAdminUsers,
  type AdminUser,
} from "@/lib/admin-api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function statusLabel(
  user: AdminUser,
  labels: { adminAccountLabel: string; verifiedLabel: string; pendingLabel: string },
) {
  if (user.isAdmin) return labels.adminAccountLabel;
  if (user.isVerified) return labels.verifiedLabel;
  return labels.pendingLabel;
}

export function AdminUsersPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const session = await fetchAdminSession();
      if (!session) {
        router.replace("/staff?next=/admin/users");
        return;
      }

      setUsername(session.username);
      const nextUsers = await fetchAdminUsers();
      setUsers(nextUsers);
      setLoading(false);
    } catch {
      router.replace("/staff?next=/admin/users");
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) => {
      const haystack = `${user.name ?? ""} ${user.email ?? ""} ${user.username} ${user.accountStatus}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [users, query]);

  const handleDelete = async (user: AdminUser) => {
    if (user.isAdmin) return;
    if (!window.confirm(t.admin.confirmDeleteUser)) return;

    try {
      await deleteAdminUser(user.id);
      setNotice(t.admin.deleteUserSuccess);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t.admin.deleteUserFailed);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-neutral-500">{t.admin.loadingUsers}</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell username={username ?? undefined} notice={notice}>
      <div className="mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.admin.usersSearchPlaceholder}
          className="w-full max-w-md rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] tracking-[0.12em] text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">{t.admin.userName}</th>
              <th className="px-4 py-3 font-medium">{t.auth.email}</th>
              <th className="px-4 py-3 font-medium">{t.admin.status}</th>
              <th className="px-4 py-3 font-medium">{t.admin.joined}</th>
              <th className="px-4 py-3 font-medium">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-900">{user.name || "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{user.email || user.username}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      user.isAdmin
                        ? "rounded-full bg-neutral-900 px-2.5 py-1 text-xs text-white"
                        : user.isVerified
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700"
                          : "rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700"
                    }
                  >
                    {statusLabel(user, t.admin)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  {user.isAdmin ? (
                    <span className="text-xs text-neutral-400">{t.admin.protectedAccount}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleDelete(user)}
                      className="text-sm text-red-600 transition hover:text-red-800"
                    >
                      {t.admin.delete}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  {t.admin.noUsers}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
