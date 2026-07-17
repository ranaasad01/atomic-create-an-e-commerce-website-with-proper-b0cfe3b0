"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Lock, CreditCard, Truck, Check, AlertCircle, ShoppingBag, Tag, ChevronDown, Shield } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

// ─── Mock cart items ───────────────────────────────────────────────────────────
const MOCK_CART = [
  {
    id: "p001",
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    image: "/images/sony-wh1000xm5-headphones.jpg",
    price: 279.99,
    originalPrice: 399.99,
    qty: 1,
    variant: "Midnight Black",
  },
  {
    id: "p002",
    name: "Apple MacBook Air M2 13-inch",
    brand: "Apple",
    image: "/images/apple-macbook-air-m2.jpg",
    price: 1099.0,
    originalPrice: 1199.0,
    qty: 1,
    variant: "Space Gray / 256GB",
  },
  {
    id: "p003",
    name: "Nike Air Zoom Pegasus 40",
    brand: "Nike",
    image: "/images/nike-air-zoom-pegasus-40.jpg",
    price: 119.99,
    originalPrice: 130.0,
    qty: 2,
    variant: "Size 10 / White",
  },
];

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: 0 },
  { id: "express", label: "Express Shipping", sub: "2–3 business days", price: 9.99 },
  { id: "overnight", label: "Overnight Shipping", sub: "Next business day", price: 24.99 },
];

const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10,
  BAZAAR20: 20,
  WELCOME15: 15,
};

type Step = "information" | "shipping" | "payment" | "review";

const STEPS: { id: Step; label: string }[] = [
  { id: "information", label: "Information" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Checkout steps" className="flex items-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-[var(--accent)] text-white"
                    : active
                    ? "bg-[var(--primary)] text-[var(--foreground)]"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                {done ? <Check size={13} /> : idx + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  active ? "text-[var(--foreground)]" : done ? "text-[var(--accent)]" : "text-neutral-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <ChevronRight size={14} className="mx-2 text-neutral-300 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function OrderSummary({
  shippingPrice,
  couponDiscount,
}: {
  shippingPrice: number;
  couponDiscount: number;
}) {
  const subtotal = MOCK_CART.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + shippingPrice + tax - couponDiscount;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
      <div className="px-5 py-4 border-b border-black/5">
        <h2 className="font-semibold text-base flex items-center gap-2">
          <ShoppingBag size={16} className="text-[var(--accent)]" />
          Order Summary
        </h2>
      </div>
      <div className="px-5 py-4 space-y-3 max-h-72 overflow-y-auto">
        {MOCK_CART.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="relative flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-xl object-cover border border-black/5"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/56x56/f3f4f6/9ca3af?text=IMG";
                }}
              />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug line-clamp-2">{item.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{item.variant}</p>
            </div>
            <p className="text-sm font-semibold flex-shrink-0">
              {CURRENCY_SYMBOL}{(item.price * item.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-black/5 space-y-2 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Shipping</span>
          <span>{shippingPrice === 0 ? "Free" : `${CURRENCY_SYMBOL}${shippingPrice.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Tax (8%)</span>
          <span>{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Coupon Discount</span>
            <span>-{CURRENCY_SYMBOL}{couponDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t border-black/5">
          <span>Total</span>
          <span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step forms ───────────────────────────────────────────────────────────────

interface InfoForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

function InformationStep({
  form,
  setForm,
  onNext,
}: {
  form: InfoForm;
  setForm: (f: InfoForm) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<InfoForm>>({});

  const validate = () => {
    const e: Partial<InfoForm> = {};
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.firstName.trim()) e.firstName = "First name required";
    if (!form.lastName.trim()) e.lastName = "Last name required";
    if (!form.address.trim()) e.address = "Address required";
    if (!form.city.trim()) e.city = "City required";
    if (!form.state.trim()) e.state = "State required";
    if (!form.zip.trim()) e.zip = "ZIP code required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  const field = (
    key: keyof InfoForm,
    label: string,
    placeholder: string,
    type = "text",
    className = ""
  ) => (
    <div className={className}>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 ${
          errors[key]
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
            : "border-black/10 bg-white focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
        }`}
      />
      {errors[key] && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold mb-4">Contact Information</h2>
        {field("email", "Email Address", "you@example.com", "email")}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-4">
          {field("firstName", "First Name", "Jane", "text")}
          {field("lastName", "Last Name", "Smith", "text")}
        </div>
        <div className="mt-4 space-y-4">
          {field("address", "Street Address", "123 Main Street")}
          {field("apt", "Apartment, suite, etc. (optional)", "Apt 4B")}
          <div className="grid grid-cols-3 gap-4">
            {field("city", "City", "New York")}
            {field("state", "State", "NY")}
            {field("zip", "ZIP Code", "10001")}
          </div>
          {field("phone", "Phone (optional)", "+1 (555) 000-0000", "tel")}
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Continue to Shipping <ChevronRight size={16} />
      </button>
    </form>
  );
}

function ShippingStep({
  selected,
  setSelected,
  onNext,
  onBack,
}: {
  selected: string;
  setSelected: (s: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Shipping Method</h2>
      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              selected === opt.id
                ? "border-[var(--accent)] bg-[var(--accent)]/5 ring-2 ring-[var(--accent)]/20"
                : "border-black/10 hover:border-[var(--accent)]/40"
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              className="accent-[var(--accent)]"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className="text-xs text-neutral-500">{opt.sub}</p>
            </div>
            <p className="text-sm font-bold">
              {opt.price === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `${CURRENCY_SYMBOL}${opt.price.toFixed(2)}`
              )}
            </p>
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-black/10 text-sm font-semibold hover:bg-neutral-50 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Continue to Payment <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

interface PaymentForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

function PaymentStep({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: PaymentForm;
  setForm: (f: PaymentForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentForm, string>>>({});
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const e: Partial<Record<keyof PaymentForm, string>> = {};
    if (payMethod === "card") {
      if (!form.cardName.trim()) e.cardName = "Name required";
      const rawCard = form.cardNumber.replace(/\s/g, "");
      if (rawCard.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
      if (!form.expiry || form.expiry.length < 5) e.expiry = "Enter valid expiry MM/YY";
      if (!form.cvv || form.cvv.length < 3) e.cvv = "Enter valid CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-bold">Payment</h2>

      {/* Method toggle */}
      <div className="flex gap-3">
        {(["card", "paypal"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setPayMethod(m)}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              payMethod === m
                ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)]"
                : "border-black/10 text-neutral-500 hover:border-[var(--accent)]/40"
            }`}
          >
            {m === "card" ? "Credit / Debit Card" : "PayPal"}
          </button>
        ))}
      </div>

      {payMethod === "card" ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-neutral-50 border border-black/5 flex items-center gap-3">
            <Lock size={14} className="text-green-600" />
            <p className="text-xs text-neutral-500">
              Your payment info is encrypted and never stored on our servers.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Name on Card</label>
            <input
              type="text"
              value={form.cardName}
              onChange={(e) => setForm({ ...form, cardName: e.target.value })}
              placeholder="Jane Smith"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 ${
                errors.cardName
                  ? "border-red-400 bg-red-50"
                  : "border-black/10 bg-white focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              }`}
            />
            {errors.cardName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.cardName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Card Number</label>
            <div className="relative">
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e) =>
                  setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-3 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all duration-200 font-mono ${
                  errors.cardNumber
                    ? "border-red-400 bg-red-50"
                    : "border-black/10 bg-white focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                }`}
              />
              <CreditCard
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </div>
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.cardNumber}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Expiry Date</label>
              <input
                type="text"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 font-mono ${
                  errors.expiry
                    ? "border-red-400 bg-red-50"
                    : "border-black/10 bg-white focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                }`}
              />
              {errors.expiry && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.expiry}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">CVV</label>
              <input
                type="text"
                value={form.cvv}
                onChange={(e) =>
                  setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                placeholder="123"
                maxLength={4}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 font-mono ${
                  errors.cvv
                    ? "border-red-400 bg-red-50"
                    : "border-black/10 bg-white focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                }`}
              />
              {errors.cvv && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.cvv}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.saveCard}
              onChange={(e) => setForm({ ...form, saveCard: e.target.checked })}
              className="accent-[var(--accent)] w-4 h-4"
            />
            <span className="text-sm text-neutral-600">Save card for future purchases</span>
          </label>
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-black/10 bg-neutral-50 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <span className="text-2xl font-extrabold text-blue-700">P</span>
          </div>
          <p className="text-sm text-neutral-600">
            You will be redirected to PayPal to complete your payment securely.
          </p>
          <p className="text-xs text-neutral-400">Demo mode: PayPal redirect is simulated.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-black/10 text-sm font-semibold hover:bg-neutral-50 transition-all duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Review Order <ChevronRight size={16} />
        </button>
      </div>
    </form>
  );
}

function ReviewStep({
  info,
  shipping,
  onBack,
  onPlace,
  placing,
}: {
  info: InfoForm;
  shipping: string;
  onBack: () => void;
  onPlace: () => void;
  placing: boolean;
}) {
  const shippingOpt = SHIPPING_OPTIONS.find((o) => o.id === shipping) ?? SHIPPING_OPTIONS[0];
  const subtotal = MOCK_CART.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + (shippingOpt?.price ?? 0) + tax;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Review Your Order</h2>

      {/* Delivery info */}
      <div className="rounded-xl border border-black/5 overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 border-b border-black/5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            Delivery Address
          </span>
          <button className="text-xs text-[var(--accent)] font-semibold hover:underline">
            Edit
          </button>
        </div>
        <div className="px-4 py-3 text-sm text-neutral-700 space-y-0.5">
          <p className="font-semibold">
            {info.firstName} {info.lastName}
          </p>
          <p>{info.address}{info.apt ? `, ${info.apt}` : ""}</p>
          <p>
            {info.city}, {info.state} {info.zip}
          </p>
          <p className="text-neutral-500">{info.email}</p>
        </div>
      </div>

      {/* Shipping method */}
      <div className="rounded-xl border border-black/5 overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 border-b border-black/5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            Shipping Method
          </span>
          <button className="text-xs text-[var(--accent)] font-semibold hover:underline">
            Edit
          </button>
        </div>
        <div className="px-4 py-3 text-sm text-neutral-700 flex items-center justify-between">
          <div>
            <p className="font-semibold">{shippingOpt?.label}</p>
            <p className="text-neutral-500 text-xs">{shippingOpt?.sub}</p>
          </div>
          <p className="font-bold">
            {(shippingOpt?.price ?? 0) === 0
              ? "Free"
              : `${CURRENCY_SYMBOL}${(shippingOpt?.price ?? 0).toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-black/5 overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 border-b border-black/5">
          <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            Items ({MOCK_CART.reduce((a, i) => a + i.qty, 0)})
          </span>
        </div>
        <div className="divide-y divide-black/5">
          {MOCK_CART.map((item) => (
            <div key={item.id} className="px-4 py-3 flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-black/5 flex-shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/48x48/f3f4f6/9ca3af?text=IMG";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                <p className="text-xs text-neutral-500">
                  {item.variant} &times; {item.qty}
                </p>
              </div>
              <p className="text-sm font-bold flex-shrink-0">
                {CURRENCY_SYMBOL}{(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-black/5 space-y-1.5 text-sm">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Shipping</span>
            <span>
              {(shippingOpt?.price ?? 0) === 0
                ? "Free"
                : `${CURRENCY_SYMBOL}${(shippingOpt?.price ?? 0).toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Tax (8%)</span>
            <span>{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1.5 border-t border-black/5">
            <span>Total</span>
            <span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-neutral-400 flex items-start gap-1.5">
        <Shield size={12} className="mt-0.5 flex-shrink-0 text-green-500" />
        By placing your order you agree to BazaarX&apos;s Terms of Service and Privacy Policy.
        Your payment is secured with 256-bit SSL encryption.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-black/10 text-sm font-semibold hover:bg-neutral-50 transition-all duration-200"
        >
          Back
        </button>
        <motion.button
          onClick={onPlace}
          disabled={placing}
          whileHover={{ scale: placing ? 1 : 1.02 }}
          whileTap={{ scale: placing ? 1 : 0.98 }}
          className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {placing ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              />
              Placing Order...
            </>
          ) : (
            <>
              <Lock size={14} /> Place Order
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Coupon bar ───────────────────────────────────────────────────────────────
function CouponBar({
  discount,
  setDiscount,
}: {
  discount: number;
  setDiscount: (d: number) => void;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [applied, setApplied] = useState("");

  const apply = () => {
    const upper = code.trim().toUpperCase();
    if (VALID_COUPONS[upper] !== undefined) {
      setDiscount(VALID_COUPONS[upper]);
      setApplied(upper);
      setStatus("ok");
    } else {
      setStatus("err");
    }
  };

  const remove = () => {
    setDiscount(0);
    setApplied("");
    setCode("");
    setStatus("idle");
  };

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] px-5 py-4">
      <p className="text-sm font-semibold flex items-center gap-2 mb-3">
        <Tag size={14} className="text-[var(--accent)]" /> Coupon Code
      </p>
      {status === "ok" ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <span className="text-sm text-green-700 font-semibold">
            <Check size={13} className="inline mr-1" />
            {applied} applied — ${discount} off
          </span>
          <button onClick={remove} className="text-xs text-red-500 hover:underline font-medium">
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value); setStatus("idle"); }}
            placeholder="Enter code (try SAVE10)"
            className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none transition-all duration-200 ${
              status === "err"
                ? "border-red-400 bg-red-50"
                : "border-black/10 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
            }`}
          />
          <button
            onClick={apply}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-all duration-200"
          >
            Apply
          </button>
        </div>
      )}
      {status === "err" && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} /> Invalid or expired coupon code.
        </p>
      )}
    </div>
  );
}

// ─── Success overlay ──────────────────────────────────────────────────────────
function SuccessOverlay({ orderNum }: { orderNum: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"
        >
          <Check size={36} className="text-green-600" strokeWidth={2.5} />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
        <p className="text-neutral-500 text-sm mb-1">
          Thank you for shopping with BazaarX.
        </p>
        <p className="text-neutral-400 text-xs mb-6">
          Order #{orderNum} &bull; Confirmation sent to your email.
        </p>
        <div className="space-y-3">
          <Link
            href="/order-confirmation"
            className="block w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-all duration-200"
          >
            View Order Details
          </Link>
          <Link
            href="/shop"
            className="block w-full py-3 rounded-xl border border-black/10 text-sm font-semibold hover:bg-neutral-50 transition-all duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("information");
  const [placing, setPlacing] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [infoForm, setInfoForm] = useState<InfoForm>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [selectedShipping, setSelectedShipping] = useState("standard");

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const shippingPrice =
    SHIPPING_OPTIONS.find((o) => o.id === selectedShipping)?.price ?? 0;

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const num = `BX-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNum(num);
      setPlacing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {orderNum && <SuccessOverlay orderNum={orderNum} />}

      {/* Page header */}
      <Reveal>
        <div className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-neutral-500">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/cart" className="hover:text-[var(--accent)] transition-colors">
              Cart
            </Link>
            <ChevronRight size={14} />
            <span className="text-[var(--foreground)] font-medium">Checkout</span>
          </div>
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Reveal>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Checkout</h1>
          <p className="text-neutral-500 text-sm mb-6">
            Complete your purchase securely. All transactions are encrypted.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: steps */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6 md:p-8">
                <StepIndicator current={step} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {step === "information" && (
                      <InformationStep
                        form={infoForm}
                        setForm={setInfoForm}
                        onNext={() => setStep("shipping")}
                      />
                    )}
                    {step === "shipping" && (
                      <ShippingStep
                        selected={selectedShipping}
                        setSelected={setSelectedShipping}
                        onNext={() => setStep("payment")}
                        onBack={() => setStep("information")}
                      />
                    )}
                    {step === "payment" && (
                      <PaymentStep
                        form={paymentForm}
                        setForm={setPaymentForm}
                        onNext={() => setStep("review")}
                        onBack={() => setStep("shipping")}
                      />
                    )}
                    {step === "review" && (
                      <ReviewStep
                        info={infoForm}
                        shipping={selectedShipping}
                        onBack={() => setStep("payment")}
                        onPlace={handlePlaceOrder}
                        placing={placing}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Trust badges */}
            <Reveal delay={0.1}>
              <div className="mt-4 flex flex-wrap gap-4 items-center justify-center text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Lock size={11} className="text-green-500" /> SSL Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <Shield size={11} className="text-green-500" /> Buyer Protection
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={11} className="text-blue-500" /> Free Returns
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard size={11} className="text-purple-500" /> Visa, MC, Amex, PayPal
                </span>
              </div>
            </Reveal>
          </div>

          {/* Right: summary */}
          <div className="space-y-4">
            <Reveal delay={0.05}>
              <OrderSummary
                shippingPrice={shippingPrice}
                couponDiscount={couponDiscount}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <CouponBar discount={couponDiscount} setDiscount={setCouponDiscount} />
            </Reveal>

            {/* Accepted payments */}
            <Reveal delay={0.15}>
              <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] px-5 py-4">
                <p className="text-xs font-semibold text-neutral-500 mb-3 uppercase tracking-wide">
                  Accepted Payments
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Visa", "Mastercard", "Amex", "Discover", "PayPal"].map((card) => (
                    <span
                      key={card}
                      className="px-3 py-1.5 rounded-lg border border-black/8 text-xs font-semibold text-neutral-600 bg-neutral-50"
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}