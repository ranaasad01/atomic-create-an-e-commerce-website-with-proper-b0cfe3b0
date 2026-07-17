"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Star, ArrowRight, HeartOff, Package } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  category: string;
  categoryColor: string;
  slug: string;
}

interface RecentlyViewedItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  category: string;
  categoryColor: string;
  slug: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "w001",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    price: 279.99,
    originalPrice: 399.99,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 2847,
    category: "Electronics",
    categoryColor: "from-blue-500 to-indigo-600",
    slug: "sony-wh1000xm5-headphones",
  },
  {
    id: "w002",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    price: 129.99,
    originalPrice: 159.99,
    discountPercent: 19,
    rating: 4.6,
    reviewCount: 1523,
    category: "Fashion",
    categoryColor: "from-pink-500 to-rose-600",
    slug: "nike-air-max-270",
  },
  {
    id: "w003",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brand: "Instant Pot",
    price: 89.95,
    originalPrice: 119.95,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 4201,
    category: "Home & Kitchen",
    categoryColor: "from-orange-400 to-amber-500",
    slug: "instant-pot-duo-7-in-1",
  },
  {
    id: "w004",
    name: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    brand: "Penguin Random House",
    price: 14.99,
    originalPrice: 27.0,
    discountPercent: 44,
    rating: 4.9,
    reviewCount: 9812,
    category: "Books",
    categoryColor: "from-emerald-500 to-teal-600",
    slug: "atomic-habits-book",
  },
  {
    id: "w005",
    name: "Manduka PRO Yoga Mat — 6mm Premium Thick",
    brand: "Manduka",
    price: 79.99,
    originalPrice: 120.0,
    discountPercent: 33,
    rating: 4.7,
    reviewCount: 876,
    category: "Sports",
    categoryColor: "from-violet-500 to-purple-600",
    slug: "manduka-pro-yoga-mat",
  },
];

const RECENTLY_VIEWED: RecentlyViewedItem[] = [
  {
    id: "rv001",
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    price: 199.99,
    rating: 4.8,
    category: "Electronics",
    categoryColor: "from-slate-400 to-gray-600",
    slug: "apple-airpods-pro-2nd-gen",
  },
  {
    id: "rv002",
    name: "Levi's 501 Original Fit Jeans",
    brand: "Levi's",
    price: 59.99,
    rating: 4.5,
    category: "Fashion",
    categoryColor: "from-blue-400 to-blue-600",
    slug: "levis-501-original-jeans",
  },
  {
    id: "rv003",
    name: "KitchenAid 5-Qt Artisan Stand Mixer",
    brand: "KitchenAid",
    price: 349.99,
    rating: 4.9,
    category: "Home & Kitchen",
    categoryColor: "from-red-400 to-rose-500",
    slug: "kitchenaid-artisan-stand-mixer",
  },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
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
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-0.5">({count.toLocaleString("en-US")})</span>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--accent)] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
      <ShoppingCart size={16} className="text-[var(--primary)]" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors" aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

// ─── Wishlist Item Card ───────────────────────────────────────────────────────

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onMoveToCart: (item: WishlistItem) => void;
}

function WishlistCard({ item, onRemove, onMoveToCart }: WishlistCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-[var(--shadow-card)] p-4 flex flex-col gap-3 border border-[var(--border)] hover:shadow-md transition-shadow duration-200">
      {/* Image placeholder */}
      <Link href={`/product/${item.slug}`} className="block relative">
        <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${item.categoryColor} flex items-center justify-center overflow-hidden`}>
          <Package size={48} className="text-white/60" />
        </div>
        {item.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{item.discountPercent}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">{item.brand}</p>
        <Link href={`/product/${item.slug}`}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors">
            {item.name}
          </h3>
        </Link>
        <StarRating rating={item.rating} count={item.reviewCount} />
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-[var(--foreground)]">${item.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => onMoveToCart(item)}
          className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold text-sm py-2 rounded-lg transition-colors"
        >
          <ShoppingCart size={14} />
          Move to Cart
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="w-full flex items-center justify-center gap-2 border border-[var(--border)] hover:border-red-300 hover:bg-red-50 text-[var(--muted)] hover:text-red-600 font-medium text-sm py-2 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Recently Viewed Card ─────────────────────────────────────────────────────

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  return (
    <Link href={`/product/${item.slug}`} className="block">
      <div className="bg-white rounded-xl shadow-[var(--shadow-card)] p-4 flex gap-4 items-center border border-[var(--border)] hover:shadow-md transition-shadow duration-200">
        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.categoryColor} flex items-center justify-center flex-shrink-0`}>
          <Package size={24} className="text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] mb-0.5">{item.brand}</p>
          <h4 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 leading-snug">{item.name}</h4>
          <div className="flex items-center justify-between mt-1">
            <StarRating rating={item.rating} />
            <span className="text-sm font-bold text-[var(--foreground)]">${item.price.toFixed(2)}</span>
          </div>
        </div>
        <ArrowRight size={16} className="text-[var(--muted)] flex-shrink-0" />
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-6">
        <HeartOff size={40} className="text-[var(--primary)]" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Your wishlist is empty</h2>
      <p className="text-[var(--muted)] mb-8 max-w-sm">
        Start adding items you love! Browse our store and click the heart icon on any product to save it here.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Browse Products
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [toast, setToast] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveToCart = (item: WishlistItem) => {
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
    setToast(`"${item.name.slice(0, 40)}…" added to cart!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Page Header ── */}
      <div className="bg-[var(--accent)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                <Heart size={20} className="text-[var(--primary)]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display">My Wishlist</h1>
                <p className="text-white/70 text-sm mt-0.5">Items you love, saved for later</p>
              </div>
            </div>
            {wishlist.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-[var(--primary)] text-[var(--foreground)] font-bold text-sm px-4 py-1.5 rounded-full">
                <Heart size={14} />
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
              </span>
            )}
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mt-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Wishlist Grid ── */}
            <section aria-label="Wishlist items">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Saved Items
                  <span className="ml-2 text-sm font-normal text-[var(--muted)]">({wishlist.length})</span>
                </h2>
                <button
                  onClick={() => setWishlist([])}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    onMoveToCart={handleMoveToCart}
                  />
                ))}
              </div>
            </section>

            {/* ── Continue Shopping CTA ── */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-6 shadow-[var(--shadow-card)] border border-[var(--border)]">
              <div>
                <p className="font-semibold text-[var(--foreground)]">Ready to shop more?</p>
                <p className="text-sm text-[var(--muted)]">Discover thousands of products across all categories.</p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                Browse All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}

        {/* ── Recently Viewed ── */}
        <section className="mt-12" aria-label="Recently viewed products">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[var(--primary)] rounded-full" />
            <h2 className="text-xl font-bold font-display text-[var(--foreground)]">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECENTLY_VIEWED.map((item) => (
              <RecentlyViewedCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* ── Trust Badges ── */}
        <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Trust badges">
          {[
            { icon: "🚚", title: "Free Shipping", sub: "On orders over $49" },
            { icon: "🔒", title: "Secure Checkout", sub: "256-bit SSL encryption" },
            { icon: "↩️", title: "Easy Returns", sub: "30-day hassle-free policy" },
            { icon: "⭐", title: "Top Rated", sub: "4.8★ average rating" },
          ].map((badge) => (
            <div
              key={badge.title}
              className="bg-white rounded-xl p-4 text-center shadow-[var(--shadow-card)] border border-[var(--border)]"
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{badge.title}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{badge.sub}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
