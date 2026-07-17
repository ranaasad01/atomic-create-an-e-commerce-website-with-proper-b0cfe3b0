"use client";

import Link from "next/link";
import { CheckCircle, Package, Truck, MapPin, Mail, ArrowRight, Star, Home, ShoppingBag } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ORDER_NUMBER = "#BZX-2025-84721";
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
                Thank you for shopping with{" "}
                <span className="font-semibold text-[var(--primary)]">BazaarX</span>! Your
                order has been placed and is being processed.
              </p>

              {/* Delivery estimate */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-800 text-sm font-medium">
                <Truck size={16} className="text-green-600" />
                Estimated delivery: <strong>3–5 business days, by {ESTIMATED_DELIVERY}</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Main Two-Column Layout ── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Order Details (2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Order Items */}
            <Reveal>
              <div
                className="bg-white rounded-xl p-6"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <h2 className="font-display text-lg font-bold text-[var(--foreground)] mb-5 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[var(--primary)]" />
                  Order Items
                </h2>

                <div className="divide-y divide-[var(--border)]">
                  {ORDER_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      {/* Placeholder image */}
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center border border-[var(--border)]">
                        <Package size={28} className="text-gray-300" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[var(--foreground)] leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {item.brand} · {item.variant}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-[var(--foreground)]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ${(item.originalPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-sm text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--muted)]">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--muted)]">
                    <span>Tax (8.875%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[var(--foreground)] pt-2 border-t border-[var(--border)]">
                    <span>Total Charged</span>
                    <span className="text-[var(--primary)]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Shipping Address */}
            <Reveal delay={0.1}>
              <div
                className="bg-white rounded-xl p-6"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <h2 className="font-display text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[var(--primary)]" />
                  Shipping Address
                </h2>
                <div className="text-sm text-[var(--muted)] space-y-1">
                  <p className="font-semibold text-[var(--foreground)]">John Smith</p>
                  <p>123 Main Street, Apt 4B</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Right: Next Steps Sidebar (1/3) ── */}
          <div className="flex flex-col gap-5">
            {/* Track Your Order */}
            <Reveal delay={0.05}>
              <div
                className="bg-white rounded-xl p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <Truck size={16} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="font-display font-bold text-[var(--foreground)] text-sm">
                    Track Your Order
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] mb-2">
                  Use your tracking number to follow your shipment in real time.
                </p>
                <div className="bg-[var(--background)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--foreground)] border border-[var(--border)] break-all">
                  {TRACKING_NUMBER}
                </div>
                <button className="mt-3 w-full text-xs font-semibold text-[var(--primary)] hover:underline flex items-center justify-center gap-1">
                  Track Shipment <ArrowRight size={12} />
                </button>
              </div>
            </Reveal>

            {/* Email Confirmation */}
            <Reveal delay={0.1}>
              <div
                className="bg-white rounded-xl p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <Mail size={16} className="text-blue-500" />
                  </div>
                  <h3 className="font-display font-bold text-[var(--foreground)] text-sm">
                    Email Confirmation
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  A confirmation receipt has been sent to:
                </p>
                <p className="text-xs font-semibold text-[var(--foreground)] mt-1 break-all">
                  {MOCK_EMAIL}
                </p>
              </div>
            </Reveal>

            {/* Need Help? */}
            <Reveal delay={0.15}>
              <div
                className="bg-white rounded-xl p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                    <Package size={16} className="text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-[var(--foreground)] text-sm">
                    Need Help?
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] mb-3">
                  Our support team is available 24/7 to assist with your order,
                  returns, or any questions.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  Contact Support <ArrowRight size={12} />
                </Link>
              </div>
            </Reveal>

            {/* What's Next */}
            <Reveal delay={0.2}>
              <div
                className="bg-[var(--accent)] rounded-xl p-5 text-white"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <h3 className="font-display font-bold text-sm mb-3">What Happens Next?</h3>
                <ol className="space-y-2">
                  {[
                    "Order is being packed at our warehouse",
                    "Shipped via UPS Ground (1–2 days)",
                    "Out for delivery in your area",
                    "Delivered to your door!",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--foreground)] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA Section ── */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <Reveal>
          <div
            className="bg-white rounded-xl p-8 text-center"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
              Ready to shop again?
            </h2>
            <p className="text-[var(--muted)] text-sm mb-6">
              Discover thousands of products across Electronics, Fashion, Home & Kitchen, Books, and Sports.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-bold px-8 py-3 rounded-xl transition-colors text-sm"
              >
                <ShoppingBag size={16} />
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 border-2 border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
              >
                <Home size={16} />
                View All Orders
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── You Might Also Like ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <Reveal>
          <h2 className="font-display text-xl font-bold text-[var(--foreground)] mb-6">
            You Might Also Like
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {RECOMMENDATIONS.map((rec, i) => (
            <Reveal key={rec.id} delay={i * 0.08}>
              <div
                className="bg-white rounded-xl overflow-hidden flex flex-col"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                {/* Placeholder image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  <Package size={48} className="text-gray-300" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--accent)]">
                    {rec.badge}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="font-semibold text-sm text-[var(--foreground)] leading-snug line-clamp-2 mb-1">
                    {rec.name}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={rec.rating} />
                    <span className="text-xs text-gray-400">
                      ({rec.reviews.toLocaleString("en-US")})
                    </span>
                  </div>
                  <p className="font-bold text-[var(--foreground)] text-base mb-3">
                    ${rec.price.toFixed(2)}
                  </p>
                  <button className="mt-auto w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
