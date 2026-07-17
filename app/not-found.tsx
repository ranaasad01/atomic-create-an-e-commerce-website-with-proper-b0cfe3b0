"use client";

import Link from "next/link";

const categoryPills = [
  { label: "Electronics", slug: "electronics" },
  { label: "Fashion", slug: "fashion" },
  { label: "Home & Kitchen", slug: "home-kitchen" },
  { label: "Books", slug: "books" },
  { label: "Sports", slug: "sports" },
];

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4"
      style={{ minHeight: "100vh" }}
    >
      {/* Decorative 404 number */}
      <div
        className="font-display font-bold leading-none select-none"
        style={{
          fontSize: "clamp(100px, 20vw, 180px)",
          color: "var(--border)",
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Illustration */}
      <div className="text-8xl mb-6" role="img" aria-label="Lost package illustration">
        📦
      </div>

      {/* Heading */}
      <h1
        className="font-display text-3xl font-bold text-center mb-3"
        style={{ color: "var(--foreground)" }}
      >
        Oops! Page Not Found
      </h1>

      {/* Subtext */}
      <p
        className="text-center text-base max-w-md mb-8"
        style={{ color: "var(--muted)" }}
      >
        The page you&apos;re looking for has wandered off. Let&apos;s get you back on track!
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <Link
          href="/"
          className="rounded-lg px-6 py-3 font-semibold text-white transition-colors"
          style={{
            backgroundColor: "var(--primary)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "var(--primary-hover)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "var(--primary)")
          }
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="rounded-lg px-6 py-3 font-semibold transition-colors border-2"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "var(--accent)";
            el.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "transparent";
            el.style.color = "var(--accent)";
          }}
        >
          Browse Shop
        </Link>
      </div>

      {/* Popular Categories */}
      <div className="flex flex-col items-center gap-3">
        <p
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          Popular Categories
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {categoryPills.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-full px-4 py-2 text-sm bg-white border transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--primary)";
                el.style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--foreground)";
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
