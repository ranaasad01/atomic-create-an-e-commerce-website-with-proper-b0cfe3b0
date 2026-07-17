"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Package, Truck, MapPin, CheckCircle, Clock, ChevronRight, ArrowLeft, Phone, Mail, RotateCcw, Star, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuth } from "@/components/AuthProvider";
import { getOrderById } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
}

interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  placedAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Tracking Steps ───────────────────────────────────────────────────────────

const TRACKING_STEPS = [
  {
    id: "placed",
    label: "Order Placed",
    description: "Your order has been received and confirmed.",
    icon: Package,
    date: "Jan 10, 2025 · 9:14 AM",
  },
  {
    id: "processing",
    label: "Processing",
    description: "We are preparing your items for shipment.",
    icon: Clock,
    date: "Jan 10, 2025 · 2:30 PM",
  },
  {
    id: "shipped",
    label: "Shipped",
    description: "Your package is on its way with the carrier.",
    icon: Truck,
    date: "Jan 11, 2025 · 8:00 AM",
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Package delivered to your address.",
    icon: CheckCircle,
    date: "Jan 13, 2025 · 3:45 PM",
  },
];

const STATUS_STEP_MAP: Record<Order["status"], number> = {
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

const STATUS_LABELS: Record<Order["status"], string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-orange-100 text-[var(--primary)]",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.round(rating)
              ? "fill-[var(--primary)] text-[var(--primary)]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors font-medium"
      aria-label="Copy tracking number"
    >
      {copied ? (
        <><Check size={12} /> Copied!</>
      ) : (
        <><Copy size={12} /> Copy</>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderNotFound, setOrderNotFound] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!orderId) return;
    const found = getOrderById(orderId) as Order | undefined;
    if (found) {
      setOrder(found);
    } else {
      setOrderNotFound(true);
    }
  }, [orderId]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm">Loading order details…</p>
        </div>
      </div>
    );
  }

  // ── Not found state ──
  if (orderNotFound) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle size={56} className="text-[var(--muted)] mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-2">
            Order Not Found
          </h1>
          <p className="text-[var(--muted)] mb-6">
            We couldn&apos;t find order <strong>#{orderId}</strong>. It may have been removed or the link is incorrect.
          </p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold px-6 py-3 rounded-[var(--radius)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStep = STATUS_STEP_MAP[order.status];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/account" className="hover:text-[var(--primary)] transition-colors">My Account</Link>
            <ChevronRight size={14} />
            <Link href="/account/orders" className="hover:text-[var(--primary)] transition-colors">Orders</Link>
            <ChevronRight size={14} />
            <span className="text-[var(--foreground)] font-medium">#{order.id}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Back button ── */}
        <Reveal>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6 font-medium"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </Reveal>

        {/* ── Page title ── */}
        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Order #{order.id}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                STATUS_COLORS[order.status]
              }`}
            >
              {order.status === "delivered" && <CheckCircle size={14} />}
              {order.status === "shipped" && <Truck size={14} />}
              {order.status === "processing" && <Clock size={14} />}
              {order.status === "cancelled" && <AlertCircle size={14} />}
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </Reveal>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Order Status Hero Card */}
            <Reveal delay={0.08}>
              <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    {order.status === "delivered" ? (
                      <CheckCircle size={32} className="text-green-600" />
                    ) : order.status === "shipped" ? (
                      <Truck size={32} className="text-[var(--primary)]" />
                    ) : order.status === "cancelled" ? (
                      <AlertCircle size={32} className="text-red-500" />
                    ) : (
                      <Clock size={32} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold text-[var(--foreground)] mb-1">
                      {order.status === "delivered"
                        ? `Delivered on ${formatDate(order.deliveredAt ?? order.estimatedDelivery)}`
                        : `Estimated Delivery: ${formatDate(order.estimatedDelivery)}`}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      Placed on {formatDate(order.placedAt)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm text-[var(--muted)]">Tracking:</span>
                      <span className="text-sm font-mono font-semibold text-[var(--foreground)]">
                        {order.trackingNumber}
                      </span>
                      <CopyButton text={order.trackingNumber} />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 2. Tracking Timeline */}
            <Reveal delay={0.12}>
              <div
                id="tracking"
                className="bg-white rounded-[var(--radius)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)]"
              >
                <h2 className="font-display text-lg font-bold text-[var(--foreground)] mb-6">
                  Order Tracking
                </h2>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[var(--border)]" aria-hidden="true" />

                  <ol className="space-y-8">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      const Icon = step.icon;

                      return (
                        <li key={step.id} className="relative flex gap-4">
                          {/* Step circle */}
                          <div className="relative z-10 flex-shrink-0">
                            {isCompleted ? (
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isCurrent
                                    ? "bg-[var(--primary)] ring-4 ring-[var(--primary)]/30"
                                    : "bg-[var(--primary)]"
                                }`}
                              >
                                {isCurrent ? (
                                  <Icon size={18} className="text-white" />
                                ) : (
                                  <Check size={18} className="text-white" />
                                )}
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] bg-white flex items-center justify-center">
                                <Icon size={18} className="text-[var(--muted)]" />
                              </div>
                            )}
                          </div>

                          {/* Step content */}
                          <div className="flex-1 pb-2">
                            <p
                              className={`font-semibold text-sm ${
                                isCompleted
                                  ? "text-[var(--foreground)]"
                                  : "text-[var(--muted)]"
                              }`}
                            >
                              {step.label}
                              {isCurrent && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full font-medium">
                                  Current
                                </span>
                              )}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${
                                isCompleted ? "text-[var(--muted)]" : "text-[var(--border)]"
                              }`}
                            >
                              {isCompleted ? step.date : "Pending"}
                            </p>
                            <p
                              className={`text-sm mt-1 ${
                                isCompleted
                                  ? "text-[var(--muted)]"
                                  : "text-gray-300"
                              }`}
                            >
                              {step.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </Reveal>

            {/* 3. Order Items */}
            <Reveal delay={0.16}>
              <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-display text-lg font-bold text-[var(--foreground)] mb-4">
                  Order Items ({order.items.length})
                </h2>

                <ul className="divide-y divide-[var(--border)]">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-4 flex items-start gap-4">
                      {/* Placeholder image */}
                      <div className="w-16 h-16 rounded-[var(--radius)] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                        <Package size={24} className="text-[var(--muted)]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[var(--foreground)] leading-snug">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {item.variant} · Qty: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm text-[var(--foreground)]">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {formatPrice(item.unitPrice)} each
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">

            {/* 1. Order Summary */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-display text-base font-bold text-[var(--foreground)] mb-4">
                  Order Summary
                </h2>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Order ID</dt>
                    <dd className="font-mono font-semibold text-[var(--foreground)] text-xs">#{order.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Date Placed</dt>
                    <dd className="text-[var(--foreground)]">{formatDate(order.placedAt)}</dd>
                  </div>

                  <div className="border-t border-[var(--border)] my-3" />

                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Subtotal</dt>
                    <dd className="text-[var(--foreground)]">{formatPrice(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Shipping</dt>
                    <dd className="text-green-600 font-medium">
                      {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Tax</dt>
                    <dd className="text-[var(--foreground)]">{formatPrice(order.tax)}</dd>
                  </div>

                  <div className="border-t border-[var(--border)] my-3" />

                  <div className="flex justify-between">
                    <dt className="font-bold text-[var(--foreground)]">Total</dt>
                    <dd className="font-bold text-lg text-[var(--foreground)]">{formatPrice(order.total)}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            {/* 2. Shipping Address */}
            <Reveal delay={0.14}>
              <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-display text-base font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-[var(--primary)]" />
                  Shipping Address
                </h2>
                <address className="not-italic text-sm text-[var(--muted)] leading-relaxed">
                  <p className="font-semibold text-[var(--foreground)]">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </address>
              </div>
            </Reveal>

            {/* 3. Need Help? */}
            <Reveal delay={0.18}>
              <div className="bg-white rounded-[var(--radius)] border border-[var(--border)] p-6 shadow-[var(--shadow-card)]">
                <h2 className="font-display text-base font-bold text-[var(--foreground)] mb-4">
                  Need Help?
                </h2>

                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 text-sm text-[var(--foreground)] hover:text-[var(--primary)] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                      <Phone size={14} className="text-[var(--muted)] group-hover:text-[var(--primary)]" />
                    </div>
                    <span>Contact Support</span>
                    <ChevronRight size={14} className="ml-auto text-[var(--muted)]" />
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center gap-3 text-sm text-[var(--foreground)] hover:text-[var(--primary)] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                      <Mail size={14} className="text-[var(--muted)] group-hover:text-[var(--primary)]" />
                    </div>
                    <span>Email Us</span>
                    <ChevronRight size={14} className="ml-auto text-[var(--muted)]" />
                  </Link>

                  <div className="border-t border-[var(--border)] pt-3 space-y-2">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium px-4 py-2.5 rounded-[var(--radius)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                    >
                      <RotateCcw size={14} />
                      Return Item
                    </button>

                    <Link
                      href={`/product/${order.items[0]?.id ?? ""}`}
                      className="w-full flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium px-4 py-2.5 rounded-[var(--radius)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                    >
                      <Star size={14} />
                      Write a Review
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
