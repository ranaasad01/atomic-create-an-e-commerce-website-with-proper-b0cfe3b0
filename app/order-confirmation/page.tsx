"use client";

import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, Mail, ArrowRight, Star, Home, ShoppingBag } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ORDER_NUMBER = "#BZX-2025-84721";
const ORDER_ID = "BZX-2025-84721";
const TRACKING_NUMBER = "1Z999AA10123456784";
const MOCK_EMAIL = "john.smith@email.com";
const ESTIMATED_DELIVERY = "January 15, 2025";

const ORDER_ITEMS = [
  {
    id: "p001",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    variant: "Black",
    quantity: 1,
    price: 279.99,
    originalPrice: 399.99,
  },
  {
    id: "p002",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    variant: "Size 10 / White",
    quantity: 2,
    price: 129.99,
    originalPrice: 159.99,
  },
  {
    id: "p003",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brand: "Instant Pot",
    variant: "6 Quart",
    quantity: 1,
    price: 89.95,
    originalPrice: 119.95,
  },
  {
    id: "p004",
    name: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    brand: "Penguin Random House",
    variant: "Paperback",
    quantity: 1,
    price: 14.99,
    originalPrice: 27.0,
  },
];

const RECOMMENDATIONS = [
  {
    id: "r001",
    name: "Apple AirPods Pro (2nd Gen)",
    price: 249.0,
    rating: 4.8,
    reviews: 12430,
    badge: "Bestseller",
  },
  {
    id: "r002",
    name: "Levi's Classic Trucker Jacket",
    price: 89.5,
    rating: 4.6,
    reviews: 3210,
    badge: "Sale",
  },
  {
    id: "r003",
    name: "Ninja Foodi 9-in-1 Air Fryer",
    price: 159.99,
    rating: 4.7,
    reviews: 8900,
    badge: "New",
  },
];

const TAX_RATE = 0.08875;

function calcTotals() {
  const subtotal = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage() {
  const { subtotal, shipping, tax, total } = calcTotals();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Hero Success Section ── */}
      <section className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Reveal>
            <div className="flex flex-col items-center gap-4">
              {/* Checkmark */}
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
                <CheckCircle size={52} className="text-green-600" strokeWidth={2} />
              </div>

              {/* Heading */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)] mt-2">
                Order Confirmed!
              </h1>

              {/* Order number badge */}
              <span className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--foreground)] font-semibold text-sm px-4 py-1.5 rounded-full border border-[var(--primary)]/30">
                <Package size={14} className="text-[var(--primary)]" />
                {ORDER_NUMBER}
              </span>

              {/* Subtext */}
              <p className="text-[var(--muted)] text-lg max-w-xl">
                Thank you for shopping with BazaarX! Your order has been placed
                successfully and is being prepared for shipment.
              </p>

              {/* Email notice */}
              <div className="flex items-center gap-2 text-sm text-[var(--muted)] bg-[var(--background)] px-4 py-2 rounded-lg border border-[var(--border)]">
                <Mail size={14} className="text-[var(--primary)]" />
                Confirmation sent to{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {MOCK_EMAIL}
                </span>
              </div>

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                {/* Primary CTA: Track Your Order */}
                <Link
                  href={`/account/orders/${ORDER_ID}`}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-bold px-6 py-3 rounded flex items-center gap-2 transition-colors"
                >
                  <Truck size={18} />
                  Track Your Order
                </Link>

                {/* Secondary CTA: View All Orders */}
                <Link
                  href="/account/orders"
                  className="border border-[var(--border)] bg-white hover:bg-[var(--background)] text-[var(--foreground)] font-semibold px-6 py-3 rounded flex items-center gap-2 transition-colors"
                >
                  <ShoppingBag size={18} />
                  View All Orders
                </Link>

                {/* Tertiary CTA: Continue Shopping */}
                <Link
                  href="/"
                  className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold px-6 py-3 rounded flex items-center gap-2 transition-colors underline-offset-2 hover:underline"
                >
                  <Home size={18} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Delivery Info Banner ── */}
      <section className="bg-[var(--accent)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Truck size={28} className="text-[var(--primary)] flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Estimated Delivery</p>
                <p className="text-[var(--primary)] font-bold">{ESTIMATED_DELIVERY}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20" />
            <div className="flex items-center gap-3">
              <MapPin size={28} className="text-[var(--primary)] flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Tracking Number</p>
                <p className="text-[var(--primary)] font-bold font-mono">{TRACKING_NUMBER}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/20" />
            <div className="flex items-center gap-3">
              <Package size={28} className="text-[var(--primary)] flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Items in Order</p>
                <p className="text-[var(--primary)] font-bold">{ORDER_ITEMS.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Order Items ── */}
          <div className="lg:col-span-2 space-y-6">
            <Reveal>
              <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-[var(--foreground)]">
                    Order Items
                  </h2>
                  <span className="text-sm text-[var(--muted)]">
                    {ORDER_ITEMS.length} items
                  </span>
                </div>
                <ul className="divide-y divide-[var(--border)]">
                  {ORDER_ITEMS.map((item) => (
                    <li key={item.id} className="px-6 py-4 flex items-start gap-4">
                      {/* Placeholder image */}
                      <div className="w-16 h-16 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                        <Package size={24} className="text-[var(--muted)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[var(--foreground)] leading-snug">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {item.brand} · {item.variant}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-[var(--foreground)]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-xs text-[var(--muted)] line-through">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* ── Shipping Progress ── */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="font-display font-bold text-lg text-[var(--foreground)]">
                    Shipment Status
                  </h2>
                </div>
                <div className="px-6 py-6">
                  <ol className="relative border-l-2 border-[var(--primary)] space-y-6 ml-3">
                    {[
                      { label: "Order Placed", sub: "Your order has been received", done: true },
                      { label: "Payment Confirmed", sub: "Payment processed successfully", done: true },
                      { label: "Preparing Shipment", sub: "Items are being packed", done: false },
                      { label: "Out for Delivery", sub: `Expected by ${ESTIMATED_DELIVERY}`, done: false },
                      { label: "Delivered", sub: "Package delivered to your address", done: false },
                    ].map((step, idx) => (
                      <li key={idx} className="ml-6">
                        <span
                          className={`absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full ${
                            step.done
                              ? "bg-[var(--primary)]"
                              : "bg-white border-2 border-[var(--border)]"
                          }`}
                        >
                          {step.done && (
                            <svg className="w-3 h-3 text-[var(--foreground)]" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <p className={`font-semibold text-sm ${step.done ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{step.sub}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="space-y-6">
            <Reveal delay={0.05}>
              <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="font-display font-bold text-lg text-[var(--foreground)]">
                    Order Summary
                  </h2>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Tax (8.875%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[var(--border)] pt-3 flex justify-between">
                    <span className="font-bold text-[var(--foreground)]">Total</span>
                    <span className="font-bold text-[var(--foreground)] text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── Recommendations ── */}
            <Reveal delay={0.15}>
              <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="font-display font-bold text-base text-[var(--foreground)]">
                    You Might Also Like
                  </h2>
                </div>
                <ul className="divide-y divide-[var(--border)]">
                  {RECOMMENDATIONS.map((rec) => (
                    <li key={rec.id} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                          <Package size={18} className="text-[var(--muted)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
                            {rec.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <StarRating rating={rec.rating} />
                            <span className="text-xs text-[var(--muted)]">
                              ({rec.reviews.toLocaleString("en-US")})
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-bold text-sm text-[var(--foreground)]">
                              ${rec.price.toFixed(2)}
                            </span>
                            <span className="text-xs bg-[var(--primary)]/10 text-[var(--foreground)] px-2 py-0.5 rounded font-semibold">
                              {rec.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/shop"
                        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] border border-[var(--primary)]/40 hover:border-[var(--primary)] rounded py-1.5 transition-colors"
                      >
                        View Product <ArrowRight size={12} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
