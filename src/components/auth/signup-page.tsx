"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/context/locale-context";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { registerUser } from "@/lib/auth-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser({ name, email, password });
      void result;
      router.push("/dashboard");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, t.auth.errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col bg-[#0b0d10] text-zinc-100">
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80" aria-label="ZEUS home">
          <BrandLogo size="auth" />
        </Link>
        <LanguageSwitcher variant="hero" />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-16">
        <p className="text-[11px] tracking-[0.28em] text-zinc-400 uppercase">{t.auth.signupEyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl">{t.auth.signupTitle}</h1>
        <p className="mt-3 text-sm text-zinc-400">{t.auth.signupSubtitle}</p>

        {error && (
          <p className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label={t.auth.name} id="name" value={name} onChange={setName} />
          <Field label={t.auth.email} id="email" type="email" value={email} onChange={setEmail} />
          <Field
            label={t.auth.password}
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            minLength={8}
            hint={t.auth.passwordHint}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-950 uppercase"
          >
            {loading ? "…" : t.auth.signupSubmit}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="text-white hover:underline">
            {t.nav.login}
          </Link>
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  minLength,
  hint,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  minLength?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] tracking-[0.16em] text-zinc-400 uppercase">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-amber-300/50"
      />
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
