"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, Search, Filter, CheckCircle, Truck, Clock, MapPin, RotateCcw, ShoppingBag } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "Processing" | "Shipped" | "Out for Delivery" | "Delivered";

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tracking?: string;
  estimatedDelivery: string;
}

// ─── Mock Orders ──────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    id: "BZX-2025-84721",
    date: "January 10, 2025",
    status: "Delivered",
    tracking: "1Z999AA10123456784",
    estimatedDelivery: "January 15, 2025",
    subtotal: 629.92,
    items: [
      {
        id: "p001",
        name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
        variant: "Black",
        quantity: 1,
        price: 279.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
      },
      {
        id: "p002",
        name: "Nike Air Max 270 Running Shoes",
        variant: "Size 10 / White",
        quantity: 2,
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
      },
      {
        id: "p003",
        name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
        variant: "6 Quart",
        quantity: 1,
        price: 89.95,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=80&h=80&fit=crop",
      },
      {
        id: "p004",
        name: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
        variant: "Paperback",
        quantity: 1,
        price: 14.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: "BZX-2025-83105",
    date: "January 5, 2025",
    status: "Shipped",
    tracking: "1Z999AA10123456785",
    estimatedDelivery: "January 18, 2025",
    subtotal: 349.97,
    items: [
      {
        id: "p005",
        name: "Apple AirPods Pro (2nd Generation)",
        variant: "White",
        quantity: 1,
        price: 249.0,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop",
      },
      {
        id: "p006",
        name: "Levi's Classic Trucker Jacket",
        variant: "Medium / Indigo",
        quantity: 1,
        price: 89.5,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=80&fit=crop",
      },
      {
        id: "p007",
        name: "Yoga Mat Premium Non-Slip",
        variant: "Purple / 6mm",
        quantity: 1,
        price: 11.47,
        image: "https://images.unsplash.com/photo-1601925228008-f5b7e1e3e4e4?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: "BZX-2025-81990",
    date: "December 28, 2024",
    status: "Out for Delivery",
    tracking: "1Z999AA10123456786",
    estimatedDelivery: "January 12, 2025",
    subtotal: 159.99,
    items: [
      {
        id: "p008",
        name: "Ninja Foodi 9-in-1 Air Fryer",
        variant: "6.5 Quart / Black",
        quantity: 1,
        price: 159.99,
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: "BZX-2024-79342",
    date: "December 15, 2024",
    status: "Processing",
    estimatedDelivery: "January 20, 2025",
    subtotal: 74.98,
    items: [
      {
        id: "p009",
        name: "The Psychology of Money",
        variant: "Hardcover",
        quantity: 1,
        price: 24.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=80&fit=crop",
      },
      {
        id: "p010",
        name: "Resistance Bands Set (5 Levels)",
        variant: "Multicolor",
        quantity: 2,
        price: 24.99,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop",
      },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STEPS: OrderStatus[] = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const STATUS_BADGE: Record<OrderStatus, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Processing: "bg-yellow-100 text-yellow-700",
};

const STATUS_ICON: Record<OrderStatus, React.ElementType> = {
  Delivered: CheckCircle,
  Shipped: Truck,
  "Out for Delivery": MapPin,
  Processing: Clock,
};

const ITEMS_PER_PAGE = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        STATUS_BADGE[status]
      }`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {STATUS_STEPS.map((step, idx) => {
        const isFilled = idx <= currentIndex;
        const isLast = idx === STATUS_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  isFilled
                    ? "bg-[var(--primary)] border-[var(--primary)]"
                    : "bg-white border-[var(--border)]"
                }`}
              />
              <span
                className={`mt-1 text-[10px] whitespace-nowrap font-medium ${
                  isFilled ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
              >
                {step === "Out for Delivery" ? "Out for Del." : step}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${
                  idx < currentIndex ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const previewItems = order.items.slice(0, 2);
  const extraCount = order.items.length - 2;

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-medium">Order ID</p>
            <p className="font-bold text-[var(--primary)] text-sm"># {order.id}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-medium">Placed On</p>
            <p className="text-sm font-medium text-[var(--foreground)]">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-medium">Est. Delivery</p>
            <p className="text-sm font-medium text-[var(--foreground)]">{order.estimatedDelivery}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items preview */}
      <div className="px-5 py-4">
        <div className="space-y-3">
          {previewItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-md border border-[var(--border)] overflow-hidden flex-shrink-0 bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] line-clamp-1">{item.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {item.variant} &bull; Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-[var(--foreground)] flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
          {extraCount > 0 && (
            <p className="text-xs text-[var(--muted)] pl-1">
              +{extraCount} more item{extraCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Status timeline */}
        <StatusTimeline status={order.status} />
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-[var(--border)] bg-[var(--background)]">
        <div>
          <p className="text-xs text-[var(--muted)]">Order Subtotal</p>
          <p className="text-base font-bold text-[var(--foreground)]">{formatPrice(order.subtotal)}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.tracking && (
            <Link
              href={`/account/orders/${order.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius)] border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)]/10 transition-colors"
            >
              <Truck size={14} />
              Track Order
            </Link>
          )}
          <Link
            href={`/account/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-semibold transition-colors"
          >
            View Details
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filter orders
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.items.some((item) => item.name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, statusFilter]);

  const statusOptions: Array<"All" | OrderStatus> = [
    "All",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/account" className="hover:text-[var(--primary)] transition-colors">
              My Account
            </Link>
            <ChevronRight size={14} />
            <span className="text-[var(--foreground)] font-medium">Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ── Page Header ── */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <Package size={20} className="text-[var(--primary)]" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  My Orders
                </h1>
                <p className="text-sm text-[var(--muted)]">
                  {MOCK_ORDERS.length} order{MOCK_ORDERS.length !== 1 ? "s" : ""} placed
                </p>
              </div>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--foreground)] text-xs font-bold">
                {MOCK_ORDERS.length}
              </span>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-semibold transition-colors"
            >
              <ShoppingBag size={15} />
              Continue Shopping
            </Link>
          </div>
        </Reveal>

        {/* ── Filter / Search Bar ── */}
        <Reveal delay={0.05}>
          <div className="bg-white rounded-lg border border-[var(--border)] shadow-[var(--shadow-card)] p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order ID or product name…"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={15} className="text-[var(--muted)] flex-shrink-0" />
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      statusFilter === opt
                        ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--foreground)]"
                        : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Orders List ── */}
        {visibleOrders.length > 0 ? (
          <div className="space-y-4">
            {visibleOrders.map((order, idx) => (
              <Reveal key={order.id} delay={idx * 0.04}>
                <OrderCard order={order} />
              </Reveal>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] border border-[var(--primary)] text-[var(--primary)] text-sm font-semibold hover:bg-[var(--primary)]/10 transition-colors"
                >
                  <RotateCcw size={14} />
                  Load More Orders
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Empty State ── */
          <Reveal>
            <div className="bg-white rounded-lg border border-[var(--border)] shadow-[var(--shadow-card)] py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} className="text-[var(--muted)]" />
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                No orders found
              </h2>
              <p className="text-[var(--muted)] text-sm mb-6 max-w-xs mx-auto">
                {searchQuery || statusFilter !== "All"
                  ? "Try adjusting your search or filter to find your orders."
                  : "You haven't placed any orders yet. Start shopping to see them here!"}
              </p>
              {(searchQuery || statusFilter !== "All") ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("All");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted)] text-sm font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <RotateCcw size={14} />
                  Clear Filters
                </button>
              ) : (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-semibold transition-colors"
                >
                  <ShoppingBag size={14} />
                  Start Shopping
                </Link>
              )}
            </div>
          </Reveal>
        )}

        {/* ── Results summary ── */}
        {filteredOrders.length > 0 && (
          <p className="text-center text-xs text-[var(--muted)] mt-6">
            Showing {visibleOrders.length} of {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
