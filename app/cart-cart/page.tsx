"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Truck, Shield, RotateCcw, ChevronRight, Heart, X } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion";

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
  inStock: boolean;
  maxStock: number;
}

const initialCartItems: CartItem[] = [
  {
    id: "p001",
    slug: "sony-wh1000xm5-headphones",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    image: "/images/sony-wh1000xm5-headphones.jpg",
    price: 279.99,
    originalPrice: 399.99,
    quantity: 1,
    variant: "Black",
    inStock: true,
    maxStock: 8,
  },
  {
    id: "p002",
    slug: "apple-macbook-air-m2",
    name: "Apple MacBook Air 13-inch M2 Chip",
    brand: "Apple",
    image: "/images/apple-macbook-air-m2.jpg",
    price: 1099.0,
    originalPrice: 1299.0,
    quantity: 1,
    variant: "Space Gray / 256GB",
    inStock: true,
    maxStock: 3,
  },
  {
    id: "p005",
    slug: "nike-air-max-270",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    image: "/images/nike-air-max-270-running-shoes.jpg",
    price: 89.95,
    originalPrice: 130.0,
    quantity: 2,
    variant: "Size 10 / Black",
    inStock: true,
    maxStock: 5,
  },
  {
    id: "p008",
    slug: "instant-pot-duo-7-in-1",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brand: "Instant Pot",
    image: "/images/instant-pot-duo-7-in-1-pressure-cooker.jpg",
    price: 69.99,
    originalPrice: 99.99,
    quantity: 1,
    variant: "6 Quart",
    inStock: true,
    maxStock: 12,
  },
];

const PROMO_CODES: Record<string, number> = {
  BAZAAR10: 10,
  SAVE20: 20,
  WELCOME15: 15,
};

export default function CartPage() {
  const t = useTranslations();
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = Math.max(1, Math.min(item.maxStock, item.quantity + delta));
        return { ...item, quantity: next };
      })
    );
  };

  const removeItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const saveForLater = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSavedItems((prev) => [...prev, item]);
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find((i) => i.id === id);
    if (!item) return;
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => [...prev, item]);
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code.");
      return;
    }
    if (PROMO_CODES[code] !== undefined) {
      setAppliedPromo(code);
      setPromoDiscount(PROMO_CODES[code]);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try BAZAAR10, SAVE20, or WELCOME15.");
      setAppliedPromo(null);
      setPromoDiscount(0);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
    setPromoError("");
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = items.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const itemSavings = originalTotal - subtotal;
  const promoSavingsAmount = (subtotal * promoDiscount) / 100;
  const shippingThreshold = 49;
  const shipping = subtotal >= shippingThreshold ? 0 : 5.99;
  const tax = (subtotal - promoSavingsAmount) * 0.08;
  const total = subtotal - promoSavingsAmount + shipping + tax;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      {/* Page header */}
      <Reveal>
        <div className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-1">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-[var(--foreground)] font-medium">Shopping Cart</span>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-[var(--accent)]" />
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--foreground)] tracking-tight">
                Shopping Cart
              </h1>
              {totalItems > 0 && (
                <span className="bg-[var(--accent)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {items.length === 0 && savedItems.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-6">
                <ShoppingCart size={40} className="text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl font-display font-bold text-[var(--foreground)] mb-2">
                Your cart is empty
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-sm">
                Looks like you haven't added anything yet. Browse our catalog and find something you love.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover,var(--accent))] text-white font-semibold px-8 py-3 rounded-[var(--radius)] transition-all duration-300 hover:opacity-90"
              >
                Start Shopping <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping progress */}
              {shipping > 0 && (
                <Reveal>
                  <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck size={16} className="text-[var(--accent)]" />
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Add{" "}
                        <span className="text-[var(--accent)] font-bold">
                          {CURRENCY_SYMBOL}{(shippingThreshold - subtotal).toFixed(2)}
                        </span>{" "}
                        more to get FREE shipping
                      </p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        className="bg-[var(--accent)] h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </Reveal>
              )}
              {shipping === 0 && (
                <Reveal>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <Truck size={18} className="text-green-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700">
                      You qualify for FREE shipping on this order.
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Cart items list */}
              <Reveal>
                <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
                  <div className="px-6 py-4 border-b border-black/5">
                    <h2 className="font-semibold text-[var(--foreground)]">
                      Cart Items ({totalItems})
                    </h2>
                  </div>
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-black/5"
                  >
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.li
                          key={item.id}
                          variants={staggerItem}
                          exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                          className={`p-5 transition-colors ${removingId === item.id ? "opacity-50" : ""}`}
                        >
                          <div className="flex gap-4">
                            {/* Product image */}
                            <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                              <div className="w-24 h-24 rounded-xl overflow-hidden border border-black/5 bg-gray-50">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            </Link>

                            {/* Product info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide mb-0.5">
                                    {item.brand}
                                  </p>
                                  <Link
                                    href={`/product/${item.slug}`}
                                    className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug"
                                  >
                                    {item.name}
                                  </Link>
                                  {item.variant && (
                                    <p className="text-xs text-[var(--muted)] mt-1">
                                      Variant: <span className="font-medium">{item.variant}</span>
                                    </p>
                                  )}
                                </div>
                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                  <p className="font-bold text-[var(--foreground)]">
                                    {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  {item.originalPrice && (
                                    <p className="text-xs text-[var(--muted)] line-through">
                                      {CURRENCY_SYMBOL}{(item.originalPrice * item.quantity).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Actions row */}
                              <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                {/* Quantity stepper */}
                                <div className="flex items-center gap-1 border border-black/10 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    disabled={item.quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center text-sm font-semibold text-[var(--foreground)]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    disabled={item.quantity >= item.maxStock}
                                    className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                {/* Item actions */}
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => saveForLater(item.id)}
                                    className="flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                                  >
                                    <Heart size={13} />
                                    Save for later
                                  </button>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {/* Stock warning */}
                              {item.maxStock <= 3 && (
                                <p className="text-xs text-orange-500 font-medium mt-1.5">
                                  Only {item.maxStock} left in stock
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </div>
              </Reveal>

              {/* Saved for later */}
              {savedItems.length > 0 && (
                <Reveal>
                  <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-black/5">
                      <h2 className="font-semibold text-[var(--foreground)]">
                        Saved for Later ({savedItems.length})
                      </h2>
                    </div>
                    <ul className="divide-y divide-black/5">
                      {savedItems.map((item) => (
                        <li key={item.id} className="p-5">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-black/5 bg-gray-50 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide mb-0.5">
                                {item.brand}
                              </p>
                              <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-sm font-bold text-[var(--accent)] mt-1">
                                {CURRENCY_SYMBOL}{item.price.toFixed(2)}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() => moveToCart(item.id)}
                                  className="text-xs font-semibold text-[var(--accent)] hover:underline transition-colors"
                                >
                                  Move to Cart
                                </button>
                                <button
                                  onClick={() =>
                                    setSavedItems((prev) => prev.filter((i) => i.id !== item.id))
                                  }
                                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}

              {/* Continue shopping */}
              <Reveal>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline transition-colors"
                >
                  <ArrowRight size={15} className="rotate-180" />
                  Continue Shopping
                </Link>
              </Reveal>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Promo code */}
                <Reveal>
                  <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-5">
                    <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                      <Tag size={16} className="text-[var(--accent)]" />
                      Promo Code
                    </h3>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-green-700">{appliedPromo}</p>
                          <p className="text-xs text-green-600">{promoDiscount}% discount applied</p>
                        </div>
                        <button
                          onClick={removePromo}
                          className="text-green-500 hover:text-green-700 transition-colors"
                          aria-label="Remove promo code"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 text-sm border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors bg-gray-50"
                          aria-label="Promo code"
                        />
                        <button
                          onClick={applyPromo}
                          className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-xs text-red-500 mt-2">{promoError}</p>
                    )}
                    {!appliedPromo && (
                      <p className="text-xs text-[var(--muted)] mt-2">
                        Try: BAZAAR10, SAVE20, or WELCOME15
                      </p>
                    )}
                  </div>
                </Reveal>

                {/* Order summary */}
                <Reveal delay={0.05}>
                  <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-5">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-[var(--muted)]">
                        <span>Subtotal ({totalItems} items)</span>
                        <span className="text-[var(--foreground)] font-medium">
                          {CURRENCY_SYMBOL}{subtotal.toFixed(2)}
                        </span>
                      </div>
                      {itemSavings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Item savings</span>
                          <span className="font-medium">-{CURRENCY_SYMBOL}{itemSavings.toFixed(2)}</span>
                        </div>
                      )}
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo ({appliedPromo})</span>
                          <span className="font-medium">-{CURRENCY_SYMBOL}{promoSavingsAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[var(--muted)]">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-green-600 font-medium" : "text-[var(--foreground)] font-medium"}>
                          {shipping === 0 ? "FREE" : `${CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-[var(--muted)]">
                        <span>Estimated tax (8%)</span>
                        <span className="text-[var(--foreground)] font-medium">
                          {CURRENCY_SYMBOL}{tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-black/5 pt-3 flex justify-between">
                        <span className="font-bold text-[var(--foreground)] text-base">Order Total</span>
                        <span className="font-bold text-[var(--foreground)] text-base">
                          {CURRENCY_SYMBOL}{total.toFixed(2)}
                        </span>
                      </div>
                      {(itemSavings > 0 || promoDiscount > 0) && (
                        <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-center">
                          <p className="text-xs font-semibold text-green-700">
                            You save {CURRENCY_SYMBOL}{(itemSavings + promoSavingsAmount).toFixed(2)} on this order
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Checkout button */}
                    <Link href="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-5 bg-[var(--accent)] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                      >
                        Proceed to Checkout
                        <ArrowRight size={16} />
                      </motion.button>
                    </Link>

                    {/* Trust badges */}
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Shield size={12} className="text-green-500" />
                        Secure checkout
                      </span>
                      <span className="flex items-center gap-1">
                        <RotateCcw size={12} className="text-blue-500" />
                        Free returns
                      </span>
                    </div>

                    {/* Payment icons */}
                    <div className="mt-4 pt-4 border-t border-black/5">
                      <p className="text-xs text-[var(--muted)] text-center mb-2">We accept</p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map((method) => (
                          <span
                            key={method}
                            className="text-[10px] font-bold px-2 py-1 border border-black/10 rounded-md text-[var(--muted)] bg-gray-50"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Delivery estimate */}
                <Reveal delay={0.1}>
                  <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-5">
                    <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                      <Truck size={16} className="text-[var(--accent)]" />
                      Delivery Estimate
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">Standard (5-7 days)</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">Express (2-3 days)</span>
                        <span className="font-medium text-[var(--foreground)]">{CURRENCY_SYMBOL}9.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">Overnight (1 day)</span>
                        <span className="font-medium text-[var(--foreground)]">{CURRENCY_SYMBOL}19.99</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed">
                      Delivery options are selected at checkout. Orders placed before 2 PM ET ship same day.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}