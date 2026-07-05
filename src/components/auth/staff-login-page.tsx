"use client";

import { useTranslation } from "@/context/locale-context";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { loginAdminStaff } from "@/lib/admin-api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function StaffLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "invalid" ? t.auth.invalid : null,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginAdminStaff(username, password);
      router.push(nextPath.startsWith("/") ? nextPath : "/admin");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, t.auth.errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <div className="w-full max-w-sm rounded-[24px] border border-neutral-800 bg-neutral-900 p-8">
        <p className="text-[10px] tracking-[0.24em] text-neutral-500 uppercase">
          {t.auth.adminEyebrow}
        </p>
        <h1 className="mt-2 font-serif text-2xl text-white">{t.auth.adminTitle}</h1>
        <p className="mt-2 text-sm text-neutral-400">{t.auth.adminSubtitle}</p>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-[11px] tracking-[0.16em] text-neutral-500 uppercase"
            >
              {t.auth.username}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[11px] tracking-[0.16em] text-neutral-500 uppercase"
            >
              {t.auth.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none focus:border-neutral-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 disabled:opacity-60"
          >
            {loading ? "…" : t.auth.submit}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-neutral-500 hover:text-neutral-300">
            {t.auth.backHome}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function StaffLoginPage() {
  return (
    <Suspense fallback={null}>
      <StaffLoginForm />
    </Suspense>
  );
}
