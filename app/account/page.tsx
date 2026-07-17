"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Heart, MapPin, CreditCard, Settings, LogOut, ShoppingBag, ChevronRight, User, Star, Clock, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from "@/components/AuthProvider";
import { MOCK_ORDERS } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    Delivered: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle size={13} />,
    },
    Shipped: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Truck size={13} />,
    },
    "Out for Delivery": {
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: <Truck size={13} />,
    },
    Processing: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Clock size={13} />,
    },
  };
  const cfg = config[status] ?? {
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <Package size={13} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      {cfg.icon}
      {status}
    </span>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────

function SidebarLink({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[var(--primary)]/10 text-[var(--foreground)] border border-[var(--primary)]/30"
          : "text-[var(--muted)] hover:bg-[var(--border)]/40 hover:text-[var(--foreground)]"
      }`}
    >
      <Icon size={17} className={active ? "text-[var(--primary)]" : ""} />
      {label}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin" />
          <p className="text-[var(--muted)] text-sm">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const recentOrders = MOCK_ORDERS.slice(0, 3);
  const initial = user.name.charAt(0).toUpperCase();

  const stats = [
    { label: "Total Orders", value: MOCK_ORDERS.length, icon: Package },
    { label: "Wishlist Items", value: 3, icon: Heart },
    { label: "Saved Addresses", value: 2, icon: MapPin },
    { label: "Reward Points", value: "1,240", icon: Star },
  ];

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Page Header ── */}
      <div className="bg-[var(--accent)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Reveal>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-2xl font-bold text-[var(--foreground)] shadow-lg flex-shrink-0">
                {initial}
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  My Account
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  Welcome back,{" "}
                  <span className="text-[var(--primary)] font-semibold">
                    {user.name}
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar ── */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-[var(--shadow-card)] p-5 lg:sticky lg:top-24">
              {/* User info */}
              <div className="flex flex-col items-center text-center pb-5 border-b border-[var(--border)] mb-4">
                <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-2xl font-bold text-[var(--foreground)] mb-3">
                  {initial}
                </div>
                <p className="font-semibold text-[var(--foreground)] text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5 break-all">
                  {user.email}
                </p>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                <SidebarLink
                  href="/account"
                  icon={User}
                  label="Dashboard"
                  active
                />
                <SidebarLink
                  href="/account/orders"
                  icon={Package}
                  label="My Orders"
                />
                <SidebarLink
                  href="/wishlist"
                  icon={Heart}
                  label="Wishlist"
                />
                <SidebarLink
                  href="/account/addresses"
                  icon={MapPin}
                  label="Addresses"
                />
                <SidebarLink
                  href="/account/payment"
                  icon={CreditCard}
                  label="Payment Methods"
                />
                <SidebarLink
                  href="/account/settings"
                  icon={Settings}
                  label="Settings"
                />
              </nav>

              {/* Sign out */}
              <div className="mt-5 pt-4 border-t border-[var(--border)]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Welcome banner */}
            <Reveal>
              <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--foreground)] rounded-xl p-6 text-white">
                <p className="text-[var(--primary)] text-sm font-semibold uppercase tracking-wide mb-1">
                  BazaarX Dashboard
                </p>
                <h2 className="font-display text-xl md:text-2xl font-bold">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  Here&apos;s a summary of your account activity.
                </p>
              </div>
            </Reveal>

            {/* Stats row */}
            <Reveal delay={0.05}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="bg-white rounded-xl border border-[var(--border)] shadow-[var(--shadow-card)] p-4 flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                      <Icon size={18} className="text-[var(--primary)]" />
                    </div>
                    <p className="font-display text-2xl font-bold text-[var(--foreground)]">
                      {value}
                    </p>
                    <p className="text-xs text-[var(--muted)] font-medium">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Recent Orders */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-xl border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                    Recent Orders
                  </h3>
                  <Link
                    href="/account/orders"
                    className="text-sm text-[var(--primary)] font-semibold hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Left: order info */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-[var(--foreground)]">
                              {order.id}
                            </span>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-xs text-[var(--muted)]">
                            {formatDate(order.date)} &middot;{" "}
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </p>
                          <p className="text-sm font-bold text-[var(--foreground)]">
                            {formatPrice(order.total)}
                          </p>
                        </div>

                        {/* Right: actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            href={`/account/orders/${order.id}#tracking`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                          >
                            <Truck size={13} />
                            Track Order
                          </Link>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                          >
                            View Details
                            <ChevronRight size={13} />
                          </Link>
                        </div>
                      </div>

                      {/* Item previews */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item) => (
                          <span
                            key={item.productId}
                            className="text-xs bg-[var(--background)] border border-[var(--border)] rounded-md px-2 py-1 text-[var(--muted)]"
                          >
                            {item.name} &times; {item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-[var(--muted)] px-2 py-1">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--background)]">
                  <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
                  >
                    <Package size={15} />
                    View All Orders
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Quick Links */}
            <Reveal delay={0.15}>
              <div className="bg-white rounded-xl border border-[var(--border)] shadow-[var(--shadow-card)] p-6">
                <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-4">
                  Quick Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    href="/shop"
                    className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors group"
                  >
                    <ShoppingBag
                      size={20}
                      className="text-[var(--primary)] flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        Shop Now
                      </p>
                      <p className="text-xs text-[var(--muted)]">Browse all products</p>
                    </div>
                  </Link>
                  <Link
                    href="/deals"
                    className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors group"
                  >
                    <Star
                      size={20}
                      className="text-[var(--primary)] flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        Deals
                      </p>
                      <p className="text-xs text-[var(--muted)]">Today&apos;s best offers</p>
                    </div>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors group"
                  >
                    <CreditCard
                      size={20}
                      className="text-[var(--primary)] flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        Contact Support
                      </p>
                      <p className="text-xs text-[var(--muted)]">We&apos;re here to help</p>
                    </div>
                  </Link>
                </div>
              </div>
            </Reveal>
          </main>
        </div>
      </div>
    </div>
  );
}
