"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ShoppingBag, AlertCircle, Check } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

// ─── Password Strength ────────────────────────────────────────────────────────

type StrengthLevel = "" | "weak" | "fair" | "strong";

function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return "";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (password.length < 6) return "weak";
  if (password.length >= 6 && score <= 2) return "fair";
  if (password.length >= 8 && score >= 3) return "strong";
  return "fair";
}

const STRENGTH_CONFIG: Record<
  Exclude<StrengthLevel, "">,
  { label: string; color: string; width: string }
> = {
  weak: { label: "Weak", color: "bg-red-500", width: "w-1/3" },
  fair: { label: "Fair", color: "bg-yellow-500", width: "w-2/3" },
  strong: { label: "Strong", color: "bg-green-500", width: "w-full" },
};

// ─── Mock auth helpers ────────────────────────────────────────────────────────
// These live here until a real AuthProvider / lib/auth is wired up.

interface MockUser {
  id: string;
  name: string;
  email: string;
}

function mockSignUp(
  name: string,
  email: string,
  _password: string
): Promise<MockUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate duplicate-email check for demo purposes
      if (email === "taken@example.com") {
        reject(new Error("An account with this email already exists."));
        return;
      }
      resolve({
        id: `user_${Date.now()}`,
        name,
        email,
      });
    }, 1200);
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthConfig = strength ? STRENGTH_CONFIG[strength] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await mockSignUp(fullName.trim(), email.trim(), password);
      // Persist mock session
      if (typeof window !== "undefined") {
        localStorage.setItem("bazaarx_user", JSON.stringify(user));
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/account");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand link */}
      <Reveal>
        <Link
          href="/"
          className="flex items-center gap-2 mb-8 group"
          aria-label="BazaarX home"
        >
          <ShoppingBag
            size={28}
            className="text-[var(--primary)] group-hover:scale-110 transition-transform"
          />
          <span className="font-display font-bold text-3xl text-[var(--foreground)] tracking-tight">
            BazaarX
          </span>
        </Link>
      </Reveal>

      {/* Card */}
      <Reveal className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-[var(--shadow-card)] p-8 border border-[var(--border)]">
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-1">
              Create your BazaarX account
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Join millions of shoppers. It&apos;s free!
            </p>
          </div>

          {/* Success state */}
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check size={32} className="text-green-600" strokeWidth={2.5} />
              </div>
              <p className="font-semibold text-[var(--foreground)] text-lg">
                Account created!
              </p>
              <p className="text-sm text-[var(--muted)] text-center">
                Welcome to BazaarX. Redirecting you to your account&hellip;
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Error alert */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] bg-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] bg-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] bg-white placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition"
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

                {/* Password strength indicator */}
                {password && strengthConfig && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthConfig.color} ${strengthConfig.width}`}
                      />
                    </div>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        strength === "weak"
                          ? "text-red-500"
                          : strength === "fair"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Password strength: {strengthConfig.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 border rounded-md text-sm text-[var(--foreground)] bg-white placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                        : confirmPassword && confirmPassword === password
                        ? "border-green-400 focus:border-green-400 focus:ring-green-200"
                        : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword === password && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Check size={12} /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[var(--muted)] leading-snug cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[var(--primary)] hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-[var(--foreground)] font-bold py-3 rounded-md transition-colors text-sm mt-2"
              >
                {isLoading ? (
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
                    Creating account&hellip;
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Sign in link */}
              <p className="text-center text-sm text-[var(--muted)] pt-2">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-[var(--primary)] font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </Reveal>

      {/* Footer note */}
      <p className="mt-6 text-xs text-[var(--muted)] text-center max-w-sm">
        By creating an account, you agree to BazaarX&apos;s Conditions of Use and
        Privacy Notice.
      </p>
    </div>
  );
}
