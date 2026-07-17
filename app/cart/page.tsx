"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Truck, Shield, RotateCcw, ChevronRight, X } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, staggerItem, fadeInUp, scaleIn } from "@/lib/motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  category: string;
  inStock: boolean;
}

// ─── Initial mock cart data ───────────────────────────────────────────────────

const INITIAL_CART: CartItem[] = [
  {
    id: "p001",
    slug: "sony-wh1000xm5-headphones",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    image: "/images/sony-wh1000xm5-wireless-headphones.jpg",
    price: 279.99,
    originalPrice: 399.99,
    quantity: 1,
    variant: "Black",
    category: "Electronics",
    inStock: true,
  },
  {
    id: "p002",
    slug: "nike-air-max-270",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    image: "/images/nike-air-max-270-running-shoes.jpg",
    price: 129.99,
    originalPrice: 159.99,
    quantity: 2,
    variant: "Size 10 / White",
    category: "Sports",
    inStock: true,
  },
  {
    id: "p003",
    slug: "instant-pot-duo-7-in-1",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brand: "Instant Pot",
    image: "/images/instant-pot-duo-pressure-cooker.jpg",
    price: 89.95,
    originalPrice: 119.95,
    quantity: 1,
    variant: "6 Quart",
    category: "Home & Kitchen",
    inStock: true,
  },
  {
    id: "p004",
    slug: "atomic-habits-book",
    name: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    brand: "Penguin Random House",
    image: "/images/atomic-habits-james-clear-book.jpg",
    price: 14.99,
    originalPrice: 27.0,
    quantity: 1,
    variant: "Paperback",
    category: "Books",
    inStock: true,
  },
];

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08875;

// ─── Utility ──────────────────────────────────────────────────────────────────

function safeFixed(n: number | undefined, digits = 2): string {
  return ((n ?? 0) as number).toFixed(digits);
}

// ─── QuantityPicker ───────────────────────────────────────────────────────────

interface QuantityPickerProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

function QuantityPicker({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}: QuantityPickerProps) {
  return (
    <div className="flex items-center border border-black/10 rounded-xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-[var(--foreground)] select-none">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--primary)]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ─── CartItemRow ──────────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  const lineTotal = (item.price ?? 0) * (item.quantity ?? 1);
  const savings =
    item.originalPrice != null
      ? (item.originalPrice - item.price) * item.quantity
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      className="flex gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300"
    >
      {/* Product image */}
      <Link
        href={`/product/${item.slug}`}
        className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-black/5"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--accent)]/60 uppercase tracking-wide mb-0.5">
              {item.brand}
            </p>
            <Link
              href={`/product/${item.slug}`}
              className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug"
            >
              {item.name}
            </Link>
            {item.variant && (
              <p className="text-xs text-[var(--foreground)]/50 mt-1">
                {item.variant}
              </p>
            )}
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[var(--foreground)]/40 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X size={14} />
          </button>
        </div>

        {/* Bottom row: qty + price */}
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <QuantityPicker
            quantity={item.quantity}
            onIncrease={() => onIncrease(item.id)}
            onDecrease={() => onDecrease(item.id)}
          />

          <div className="text-right">
            <p className="text-base font-bold text-[var(--foreground)]">
              {CURRENCY_SYMBOL}{safeFixed(lineTotal)}
            </p>
            {savings > 0 && (
              <p className="text-xs text-emerald-600 font-medium">
                Save {CURRENCY_SYMBOL}{safeFixed(savings)}
              </p>
            )}
            {item.originalPrice != null && (
              <p className="text-xs text-[var(--foreground)]/40 line-through">
                {CURRENCY_SYMBOL}{safeFixed(item.originalPrice * item.quantity)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PromoCode ────────────────────────────────────────────────────────────────

interface PromoCodeProps {
  appliedCode: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  discount: number;
}

function PromoCode({ appliedCode, onApply, onRemove, discount }: PromoCodeProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a promo code.");
      return;
    }
    if (trimmed === "BAZAAR10" || trimmed === "SAVE20" || trimmed === "WELCOME15") {
      onApply(trimmed);
      setError("");
      setInput("");
    } else {
      setError("Invalid promo code. Try BAZAAR10.");
    }
  };

  return (
    <div className="mt-4">
      {appliedCode ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">{appliedCode}</span>
            <span className="text-xs text-emerald-600">
              -{CURRENCY_SYMBOL}{safeFixed(discount)} off
            </span>
          </div>
          <button
            onClick={onRemove}
            className="text-emerald-600 hover:text-red-500 transition-colors"
            aria-label="Remove promo code"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder="Enter promo code"
              className="flex-1 px-3 py-2 text-sm border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors bg-white"
              aria-label="Promo code"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
            />
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent)]/90 transition-colors"
            >
              Apply
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1.5">{error}</p>
          )}
          <p className="text-xs text-[var(--foreground)]/40 mt-1.5">
            Try: BAZAAR10, SAVE20, WELCOME15
          </p>
        </div>
      )}
    </div>
  );
}

// ─── OrderSummary ─────────────────────────────────────────────────────────────

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
  appliedCode: string | null;
  onApplyCode: (code: string) => void;
  onRemoveCode: () => void;
}

function OrderSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  itemCount,
  appliedCode,
  onApplyCode,
  onRemoveCode,
}: OrderSummaryProps) {
  const isFreeShipping = subtotal >= SHIPPING_THRESHOLD;
  const amountToFreeShipping = SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6 sticky top-24">
      <h2 className="text-lg font-bold text-[var(--foreground)] mb-5">
        Order Summary
      </h2>

      {/* Free shipping progress */}
      {!isFreeShipping && (
        <div className="mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={14} className="text-amber-600" />
            <p className="text-xs font-medium text-amber-700">
              Add {CURRENCY_SYMBOL}{safeFixed(amountToFreeShipping)} more for free shipping
            </p>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
      {isFreeShipping && (
        <div className="mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
          <Truck size={14} className="text-emerald-600" />
          <p className="text-xs font-semibold text-emerald-700">
            You qualify for free shipping!
          </p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[var(--foreground)]/70">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-medium text-[var(--foreground)]">
            {CURRENCY_SYMBOL}{safeFixed(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-[var(--foreground)]/70">
          <span>Estimated Shipping</span>
          <span className={`font-medium ${isFreeShipping ? "text-emerald-600" : "text-[var(--foreground)]"}`}>
            {isFreeShipping ? "FREE" : `${CURRENCY_SYMBOL}${safeFixed(shipping)}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Promo Discount</span>
            <span className="font-medium">-{CURRENCY_SYMBOL}{safeFixed(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[var(--foreground)]/70">
          <span>Estimated Tax (8.875%)</span>
          <span className="font-medium text-[var(--foreground)]">
            {CURRENCY_SYMBOL}{safeFixed(tax)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-black/5 my-4" />

      {/* Total */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-base font-bold text-[var(--foreground)]">
          Order Total
        </span>
        <span className="text-xl font-bold text-[var(--foreground)]">
          {CURRENCY_SYMBOL}{safeFixed(total)}
        </span>
      </div>

      {/* Promo code */}
      <PromoCode
        appliedCode={appliedCode}
        onApply={onApplyCode}
        onRemove={onRemoveCode}
        discount={discount}
      />

      {/* CTA */}
      <Link
        href="/checkout"
        className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-bold rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0"
      >
        Proceed to Checkout
        <ArrowRight size={16} />
      </Link>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[var(--foreground)]/40">
        <span className="flex items-center gap-1">
          <Shield size={11} />
          Secure Checkout
        </span>
        <span className="flex items-center gap-1">
          <RotateCcw size={11} />
          30-Day Returns
        </span>
      </div>

      {/* Payment icons */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((method) => (
          <span
            key={method}
            className="px-2 py-1 text-[10px] font-semibold bg-gray-100 text-gray-500 rounded-md border border-gray-200"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="w-28 h-28 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-6">
        <ShoppingCart size={48} className="text-[var(--primary)]" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        Your cart is empty
      </h2>
      <p className="text-[var(--foreground)]/60 max-w-sm leading-relaxed mb-8">
        Looks like you haven't added anything yet. Browse our catalog and find something you'll love.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-bold rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
      >
        <ShoppingBag size={18} />
        Start Shopping
      </Link>

      {/* Category quick links */}
      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        {["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"].map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
            className="px-4 py-2 text-sm font-medium bg-white border border-black/8 rounded-full text-[var(--foreground)]/70 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          >
            {cat}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── RecentlyViewed ───────────────────────────────────────────────────────────

const RECENTLY_VIEWED = [
  {
    id: "rv1",
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    price: 1199.99,
    image: "/images/samsung-galaxy-s24-ultra-smartphone.jpg",
    category: "Electronics",
  },
  {
    id: "rv2",
    slug: "levi-501-original-jeans",
    name: "Levi's 501 Original Fit Jeans",
    price: 69.99,
    image: "/images/levis-501-original-jeans.jpg",
    category: "Fashion",
  },
  {
    id: "rv3",
    slug: "nespresso-vertuo-coffee-machine",
    name: "Nespresso Vertuo Coffee Machine",
    price: 159.0,
    image: "/images/nespresso-vertuo-coffee-machine.jpg",
    category: "Home & Kitchen",
  },
  {
    id: "rv4",
    slug: "the-psychology-of-money",
    name: "The Psychology of Money",
    price: 16.99,
    image: "/images/psychology-of-money-book.jpg",
    category: "Books",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const PROMO_DISCOUNTS: Record<string, number> = {
    BAZAAR10: 0.10,
    SAVE20: 0.20,
    WELCOME15: 0.15,
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const isFreeShipping = subtotal >= SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  const discountRate = appliedCode != null ? (PROMO_DISCOUNTS[appliedCode] ?? 0) : 0;
  const discount = subtotal * discountRate;
  const taxableAmount = subtotal - discount + shipping;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);

  const handleIncrease = useCallback((id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    );
  }, []);

  const handleDecrease = useCallback((id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleApplyCode = useCallback((code: string) => {
    setAppliedCode(code);
  }, []);

  const handleRemoveCode = useCallback(() => {
    setAppliedCode(null);
  }, []);

  const isEmpty = cartItems.length === 0;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Page header */}
      <Reveal>
        <div className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-5">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-[var(--foreground)]/50 mb-3">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-[var(--foreground)]">Shopping Cart</span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                  Shopping Cart
                </h1>
                {!isEmpty && (
                  <p className="text-sm text-[var(--foreground)]/50 mt-1">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                  </p>
                )}
              </div>
              {!isEmpty && (
                <Link
                  href="/shop"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                >
                  Continue Shopping
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* ── Left column: cart items ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select all / clear */}
              <Reveal>
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}
                  </p>
                  <button
                    onClick={() => setCartItems([])}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Clear Cart
                  </button>
                </div>
              </Reveal>

              {/* Items list */}
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.06}>
                    <CartItemRow
                      item={item}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  </Reveal>
                ))}
              </AnimatePresence>

              {/* Continue shopping (mobile) */}
              <Reveal>
                <Link
                  href="/shop"
                  className="sm:hidden flex items-center justify-center gap-2 w-full py-3 border border-black/10 rounded-xl text-sm font-medium text-[var(--foreground)]/70 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 bg-white"
                >
                  Continue Shopping
                  <ChevronRight size={14} />
                </Link>
              </Reveal>

              {/* Savings summary */}
              {cartItems.some((item) => item.originalPrice != null) && (
                <Reveal>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Tag size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        You're saving{" "}
                        {CURRENCY_SYMBOL}
                        {safeFixed(
                          cartItems.reduce((sum, item) => {
                            if (item.originalPrice == null) return sum;
                            return sum + (item.originalPrice - item.price) * item.quantity;
                          }, 0)
                        )}{" "}
                        on this order
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Compared to original prices
                      </p>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* ── Right column: order summary ── */}
            <Reveal className="lg:col-span-1" delay={0.1}>
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                discount={discount}
                total={total}
                itemCount={itemCount}
                appliedCode={appliedCode}
                onApplyCode={handleApplyCode}
                onRemoveCode={handleRemoveCode}
              />
            </Reveal>
          </div>
        )}

        {/* Recently Viewed */}
        <Reveal className="mt-16">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
                Recently Viewed
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors flex items-center gap-1"
              >
                View All
                <ChevronRight size={14} />
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {RECENTLY_VIEWED.map((product, i) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="group block bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-[var(--foreground)]/40 mb-1">
                        {product.category}
                      </p>
                      <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 leading-snug mb-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-[var(--foreground)]">
                        {CURRENCY_SYMBOL}{safeFixed(product.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}