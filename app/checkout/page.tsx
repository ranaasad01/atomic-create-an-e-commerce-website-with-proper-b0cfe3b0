"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, CreditCard, MapPin, Package, Shield, Truck, Lock, Tag, Headphones, RotateCcw } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const MOCK_ITEMS = [
  {
    id: "p001",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    variant: "Black",
    image: "/images/sony-wh1000xm5-wireless-headphones.jpg",
    price: 279.99,
    quantity: 1,
  },
  {
    id: "p002",
    name: "Nike Air Max 270 Running Shoes",
    variant: "Size 10 / White",
    image: "/images/nike-air-max-270-running-shoes.jpg",
    price: 129.99,
    quantity: 2,
  },
  {
    id: "p003",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    variant: "6 Quart",
    image: "/images/instant-pot-duo-pressure-cooker.jpg",
    price: 89.95,
    quantity: 1,
  },
];

const TAX_RATE = 0.08875;

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function maskCard(num: string): string {
  const digits = num.replace(/\D/g, "");
  return digits.length >= 4 ? `•••• •••• •••• ${digits.slice(-4)}` : "•••• •••• •••• ••••";
}

// ─── CheckoutSteps ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review & Confirm", icon: Package },
];

function CheckoutSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const isCompleted = current > step.id;
        const isActive = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--primary)] text-[var(--foreground)]"
                    : isActive
                    ? "bg-[var(--primary)] text-[var(--foreground)] ring-4 ring-[var(--primary)]/30"
                    : "bg-white border-2 border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {isCompleted ? <Check size={16} /> : <step.icon size={16} />}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-[var(--foreground)]" : isCompleted ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all duration-300 ${
                  current > step.id ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary({ promoCode, setPromoCode }: { promoCode: string; setPromoCode: (v: string) => void }) {
  const subtotal = MOCK_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="bg-[var(--accent)] px-5 py-4">
        <h2 className="font-display font-semibold text-white text-base">Order Summary</h2>
      </div>

      {/* Items */}
      <div className="divide-y divide-[var(--border)]">
        {MOCK_ITEMS.map((item) => (
          <div key={item.id} className="flex gap-3 px-5 py-4">
            <div className="w-14 h-14 rounded-lg bg-gray-50 border border-[var(--border)] overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/56x56/F3F3F3/131921?text=IMG";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--foreground)] line-clamp-2 leading-snug">
                {item.name}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{item.variant}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">Qty: {item.quantity}</p>
            </div>
            <div className="text-sm font-semibold text-[var(--foreground)] flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Promo code */}
      <div className="px-5 py-4 border-t border-[var(--border)]">
        <label className="text-xs font-semibold text-[var(--foreground)] block mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-body"
          />
          <button className="px-3 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--foreground)] transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="px-5 py-4 border-t border-[var(--border)] space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">Subtotal</span>
          <span className="font-medium text-[var(--foreground)]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">Shipping</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">Tax (8.875%)</span>
          <span className="font-medium text-[var(--foreground)]">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-[var(--border)] pt-3 mt-1">
          <span className="text-[var(--foreground)]">Order Total</span>
          <span className="text-[var(--primary)]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="px-5 py-4 border-t border-[var(--border)] bg-gray-50 space-y-2">
        {[
          { icon: Lock, label: "Secure Checkout", sub: "256-bit SSL encryption" },
          { icon: RotateCcw, label: "Free Returns", sub: "30-day hassle-free policy" },
          { icon: Headphones, label: "24/7 Support", sub: "Real humans, always ready" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0">
              <Icon size={13} className="text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">{label}</p>
              <p className="text-[10px] text-[var(--muted)]">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[var(--foreground)] font-body">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white font-body w-full transition-shadow";

// ─── Step 1 — Shipping ────────────────────────────────────────────────────────

function ShippingStep({
  form,
  onChange,
  onNext,
}: {
  form: ShippingForm;
  onChange: (field: keyof ShippingForm, value: string) => void;
  onNext: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={18} className="text-[var(--primary)]" />
        <h2 className="font-display font-semibold text-lg text-[var(--foreground)]">Shipping Address</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="Jane Doe"
            className={inputCls}
          />
        </Field>
        <Field label="Email Address" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="jane@example.com"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Phone Number" required>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="(555) 000-0000"
          className={inputCls}
        />
      </Field>

      <Field label="Address Line 1" required>
        <input
          type="text"
          required
          value={form.address1}
          onChange={(e) => onChange("address1", e.target.value)}
          placeholder="123 Main Street"
          className={inputCls}
        />
      </Field>

      <Field label="Address Line 2">
        <input
          type="text"
          value={form.address2}
          onChange={(e) => onChange("address2", e.target.value)}
          placeholder="Apt, Suite, Unit (optional)"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="City" required>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="New York"
            className={inputCls}
          />
        </Field>
        <Field label="State" required>
          <select
            required
            value={form.state}
            onChange={(e) => onChange("state", e.target.value)}
            className={inputCls}
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ZIP Code" required>
          <input
            type="text"
            required
            value={form.zip}
            onChange={(e) => onChange("zip", e.target.value)}
            placeholder="10001"
            maxLength={10}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Country">
        <input
          type="text"
          value={form.country}
          readOnly
          className={`${inputCls} bg-gray-50 cursor-not-allowed`}
        />
      </Field>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-display font-semibold py-3.5 rounded-xl transition-colors text-sm mt-2"
      >
        Continue to Payment
        <ChevronRight size={16} />
      </button>
    </form>
  );
}

// ─── Step 2 — Payment ─────────────────────────────────────────────────────────

function PaymentStep({
  form,
  onChange,
  onNext,
  onBack,
}: {
  form: PaymentForm;
  onChange: (field: keyof PaymentForm, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard size={18} className="text-[var(--primary)]" />
        <h2 className="font-display font-semibold text-lg text-[var(--foreground)]">Payment Method</h2>
      </div>

      {/* Express pay buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border-2 border-[var(--border)] rounded-xl py-3 px-4 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all font-semibold text-sm text-[var(--foreground)] bg-white"
        >
          <span className="text-base">🍎</span> Apple Pay
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border-2 border-[var(--border)] rounded-xl py-3 px-4 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all font-semibold text-sm text-[var(--foreground)] bg-white"
        >
          <span className="text-base">G</span> Google Pay
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--muted)] font-medium">or pay with card</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <Field label="Cardholder Name" required>
        <input
          type="text"
          required
          value={form.cardName}
          onChange={(e) => onChange("cardName", e.target.value)}
          placeholder="Jane Doe"
          className={inputCls}
        />
      </Field>

      <Field label="Card Number" required>
        <div className="relative">
          <input
            type="text"
            required
            value={form.cardNumber}
            onChange={(e) => onChange("cardNumber", formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`${inputCls} pr-12`}
          />
          <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiry Date" required>
          <input
            type="text"
            required
            value={form.expiry}
            onChange={(e) => onChange("expiry", formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className={inputCls}
          />
        </Field>
        <Field label="CVV" required>
          <input
            type="text"
            required
            value={form.cvv}
            onChange={(e) => onChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="•••"
            maxLength={4}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Stripe badge */}
      <div className="flex items-center gap-2 bg-gray-50 border border-[var(--border)] rounded-xl px-4 py-3">
        <Lock size={14} className="text-green-600 flex-shrink-0" />
        <p className="text-xs text-[var(--muted)]">
          Your payment is <span className="font-semibold text-[var(--foreground)]">secured by Stripe</span>. We never store your card details.
        </p>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-[var(--border)] text-[var(--foreground)] font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-display font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Review Order
          <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
}

// ─── Step 3 — Review & Confirm ────────────────────────────────────────────────

function ReviewStep({
  shipping,
  payment,
  onBack,
}: {
  shipping: ShippingForm;
  payment: PaymentForm;
  onBack: () => void;
}) {
  const subtotal = MOCK_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <Package size={18} className="text-[var(--primary)]" />
        <h2 className="font-display font-semibold text-lg text-[var(--foreground)]">Review & Confirm</h2>
      </div>

      {/* Shipping summary */}
      <div className="bg-gray-50 border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck size={15} className="text-[var(--primary)]" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Shipping Address</h3>
        </div>
        <p className="text-sm text-[var(--foreground)] font-medium">{shipping.fullName}</p>
        <p className="text-sm text-[var(--muted)]">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ""}</p>
        <p className="text-sm text-[var(--muted)]">{shipping.city}, {shipping.state} {shipping.zip}</p>
        <p className="text-sm text-[var(--muted)]">{shipping.country}</p>
        <p className="text-sm text-[var(--muted)] mt-1">{shipping.email} · {shipping.phone}</p>
      </div>

      {/* Payment summary */}
      <div className="bg-gray-50 border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={15} className="text-[var(--primary)]" />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Payment Method</h3>
        </div>
        <p className="text-sm text-[var(--foreground)]">
          {payment.cardName || "Cardholder"} — {maskCard(payment.cardNumber)}
        </p>
        <p className="text-xs text-[var(--muted)] mt-0.5">Expires {payment.expiry || "••/••"}</p>
      </div>

      {/* Items */}
      <div className="border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Order Items</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {MOCK_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-[var(--border)] overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/48x48/F3F3F3/131921?text=IMG";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--foreground)] line-clamp-1">{item.name}</p>
                <p className="text-xs text-[var(--muted)]">{item.variant} · Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)] flex-shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-[var(--border)] bg-gray-50 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Shipping</span>
            <span className="text-green-600 font-semibold">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Tax (8.875%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-[var(--border)] pt-2 mt-1">
            <span>Order Total</span>
            <span className="text-[var(--primary)]">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-[var(--border)] text-[var(--foreground)] font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Back
        </button>
        <Link
          href="/order-confirmation"
          className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-display font-semibold py-3.5 rounded-xl transition-colors text-sm text-center"
        >
          <Shield size={15} />
          Place Order
        </Link>
      </div>

      <p className="text-center text-xs text-[var(--muted)] flex items-center justify-center gap-1">
        <Lock size={11} /> By placing your order you agree to BazaarX&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [promoCode, setPromoCode] = useState("");

  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const updateShipping = (field: keyof ShippingForm, value: string) =>
    setShipping((prev) => ({ ...prev, [field]: value }));

  const updatePayment = (field: keyof PaymentForm, value: string) =>
    setPayment((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-[var(--background)] font-body">
      {/* Page header */}
      <div className="bg-[var(--accent)] text-white py-5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-[var(--primary)]">
            BazaarX
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Lock size={12} className="text-[var(--primary)]" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Steps indicator */}
        <CheckoutSteps current={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left — form area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] p-6 sm:p-8">
              {currentStep === 1 && (
                <ShippingStep
                  form={shipping}
                  onChange={updateShipping}
                  onNext={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 2 && (
                <PaymentStep
                  form={payment}
                  onChange={updatePayment}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <ReviewStep
                  shipping={shipping}
                  payment={payment}
                  onBack={() => setCurrentStep(2)}
                />
              )}
            </div>
          </div>

          {/* Right — sticky order summary */}
          <div className="lg:sticky lg:top-24">
            <OrderSummary promoCode={promoCode} setPromoCode={setPromoCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
