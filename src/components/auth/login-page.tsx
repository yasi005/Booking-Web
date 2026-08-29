"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useAuth } from "@/context/auth-context";
import { useTranslation } from "@/context/locale-context";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { loginUser } from "@/lib/auth-api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser({ email, password });
      await refreshAuth();
      void result;
      router.push(nextPath.startsWith("/") ? nextPath : "/dashboard");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, t.auth.errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col bg-[#0b0d10] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.14),transparent_42%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80" aria-label="ZEUS home">
          <BrandLogo size="auth" />
        </Link>
        <LanguageSwitcher variant="hero" />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#14181f] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-10">
          <p className="text-[11px] tracking-[0.28em] text-zinc-400 uppercase">
            {t.auth.userEyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-normal text-white">{t.auth.userTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.auth.userSubtitle}</p>

          {error && (
            <p className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] tracking-[0.16em] text-zinc-400 uppercase"
              >
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[11px] tracking-[0.16em] text-zinc-400 uppercase"
              >
                {t.auth.password}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-950 uppercase transition hover:brightness-105 disabled:opacity-60"
            >
              {loading ? "…" : t.auth.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            {t.auth.haveAccount}{" "}
            <Link href="/signup" className="text-white hover:underline">
              {t.auth.signupSubmit}
            </Link>
          </p>
          <p className="mt-3 text-center">
            <Link href="/" className="text-sm text-zinc-500 transition hover:text-white">
              {t.auth.backHome}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
