"use client";

import { useTranslation } from "@/context/locale-context";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { resendVerification, verifyEmailCode } from "@/lib/auth-api";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyPendingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("devVerifyCode");
    if (stored) {
      setDevCode(stored);
      sessionStorage.removeItem("devVerifyCode");
    }
  }, []);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await verifyEmailCode(code);
      await refreshAuth();
      setSuccessMessage(result.message);
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t.auth.errors));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const result = await resendVerification();
      setSuccessMessage(result.message);
      if (result.devVerifyCode) {
        setDevCode(result.devVerifyCode);
      }
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t.auth.errors));
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, "").slice(0, 6));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-center font-serif text-2xl text-neutral-900">{t.auth.verifyPendingTitle}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-neutral-500">
          {t.auth.verifyPendingBody}
        </p>

        {successMessage && (
          <p className="mt-4 text-center text-sm text-emerald-700">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        {devCode && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-center text-sm text-amber-800">
            {t.auth.devVerifyCode} <span className="font-mono font-semibold tracking-[0.3em]">{devCode}</span>
          </p>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="verify-code"
              className="mb-2 block text-center text-[11px] tracking-[0.16em] text-neutral-500 uppercase"
            >
              {t.auth.verifyCodeLabel}
            </label>
            <input
              id="verify-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] text-neutral-900 outline-none focus:border-neutral-400"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            disabled={verifying || code.length !== 6}
            className="w-full rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {verifying ? t.auth.verifyLoading : t.auth.verifySubmit}
          </button>
        </form>

        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={resending}
          className="mt-4 w-full text-sm text-neutral-500 transition hover:text-neutral-900 disabled:opacity-60"
        >
          {resending ? "…" : t.auth.resendVerification}
        </button>

        <p className="mt-6 text-center">
          <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-900">
            {t.nav.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
