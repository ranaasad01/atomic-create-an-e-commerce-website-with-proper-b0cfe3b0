"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, AlertCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

// ─── Mock sign-in (no real backend) ─────────────────────────────────────────
async function signIn(email: string, password: string): Promise<{ id: string; email: string; name: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (!email || !password) throw new Error("Email and password are required.");
  // Accept any credentials — demo mode
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { id: "demo-user-001", email, name };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      // Persist mock session
      if (typeof window !== "undefined") {
        localStorage.setItem("bazaarx_user", JSON.stringify(user));
      }
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand */}
      <Reveal>
        <Link
          href="/"
          className="flex items-center gap-2 mb-8 group"
          aria-label="BazaarX — go to homepage"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow">
            <ShoppingBag size={22} className="text-[var(--foreground)]" />
          </div>
          <span className="font-display font-bold text-2xl text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
            BazaarX
          </span>
        </Link>
      </Reveal>

      {/* Card */}
      <Reveal delay={0.08}>
        <div className="w-full max-w-md bg-white rounded-lg shadow-[var(--shadow-card)] p-8">
          {/* Heading */}
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-1">
            Sign in to BazaarX
          </h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            Welcome back! Enter your details below.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--foreground)] mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[var(--primary)] hover:underline"
                  tabIndex={0}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-[var(--foreground)] font-bold text-sm rounded-md py-3 transition-colors mt-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)] font-medium">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Guest */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 border border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] font-semibold text-sm rounded-md py-2.5 transition-colors"
          >
            Continue as Guest
          </Link>

          {/* Sign up link */}
          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Reveal>

      {/* Demo hint */}
      <Reveal delay={0.16}>
        <p className="mt-5 text-xs text-[var(--muted)] text-center">
          <span className="font-semibold">Demo:</span> use any email &amp; password to sign in
        </p>
      </Reveal>
    </div>
  );
}
