"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "Sesi tidak valid. Coba login lagi.",
  no_code: "Otorisasi dibatalkan.",
  access_denied:
    "Akses ditolak. Kamu harus mengizinkan akses untuk menggunakan aplikasi ini.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const errorMsg = errorCode
    ? ERROR_MESSAGES[errorCode] || decodeURIComponent(errorCode)
    : null;

  return (
    <main className="min-h-screen bg-[#010101] flex flex-col items-center justify-center px-4">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FE2C55 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #25F4EE 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 glass">
            {/* TikTok-inspired icon */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M22 4h-4v16a4 4 0 1 1-4-4v-4a8 8 0 1 0 8 8V4z"
                fill="white"
              />
              <path
                d="M22 4v4c2 0 4 1 6 3V4h-6z"
                fill="#FE2C55"
                opacity="0.8"
              />
              <path
                d="M22 8c0 0 2 1.5 4 1.5V4h-4v4z"
                fill="#25F4EE"
                opacity="0.8"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Unrepost
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Kelola dan hapus video repost TikTok-mu
            <br />
            dengan cepat dan mudah.
          </p>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Login card */}
        <div className="glass rounded-2xl p-8">
          <p className="text-gray-400 text-sm text-center mb-6">
            Hubungkan akun TikTok-mu untuk mulai
          </p>

          <a
            href="/api/auth/login"
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #FE2C55, #ff4d6d)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.16 8.16 0 004.77 1.52V7.08a4.85 4.85 0 01-1-.39z" />
            </svg>
            Login dengan TikTok
          </a>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Dengan login, kamu mengizinkan aplikasi ini mengakses
              <br />
              daftar video dan informasi profil TikTok-mu.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Token disimpan terenkripsi di session browser-mu
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
