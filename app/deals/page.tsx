"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, Tag, Star, ShoppingCart, Heart, Filter, ChevronDown, Flame, Percent, ArrowRight, Check } from 'lucide-react';
import { products, formatPrice, CURRENCY_SYMBOL, type Product } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "discount" | "price-asc" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "discount", label: "Biggest Discount" },
  { value: "price-asc", label: "Lowest Price" },
  { value: "rating", label: "Highest Rated" },
];

const CATEGORY_TABS = [
  "All Deals",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports",
];

// ─── Flash Sale Mock Data ─────────────────────────────────────────────────────

const FLASH_SALES = [
  {
    id: "fs1",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    originalPrice: 399.99,
    price: 179.99,
    image: "/images/sony-wh1000xm5-wireless-headphones.jpg",
    rating: 4.8,
    reviewCount: 2847,
    slug: "sony-wh1000xm5-headphones",
  },
  {
    id: "fs2",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    originalPrice: 159.99,
    price: 74.99,
    image: "/images/nike-air-max-270-running-shoes.jpg",
    rating: 4.6,
    reviewCount: 1523,
    slug: "nike-air-max-270",
  },
  {
    id: "fs3",
    name: "Instant Pot Duo 7-in-1 Pressure Cooker",
    brand: "Instant Pot",
    originalPrice: 119.95,
    price: 49.99,
    image: "/images/instant-pot-duo-pressure-cooker.jpg",
    rating: 4.7,
    reviewCount: 3201,
    slug: "instant-pot-duo-7-in-1",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcDiscount(price: number, originalPrice: number): number {
  return Math.round((1 - price / originalPrice) * 100);
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    String(h).padStart(2, "0"),
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].join(":");
}

function getInitialSeconds(): number {
  // Count down from 23:59:59 — purely client-side, safe after mount
  const now = new Date();
  const endOfDay =
    23 * 3600 +
    59 * 60 +
    59 -
    (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
  return endOfDay > 0 ? endOfDay : 23 * 3600 + 59 * 60 + 59;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
        <span className="text-xs text-gray-500 ml-0.5">
          ({count.toLocaleString("en-US")})
        </span>
      )}
    </div>
  );
}

function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
      <Percent size={9} />
      {percent}% OFF
    </span>
  );
}

function MiniCountdown({ seconds }: { seconds: number }) {
  return (
    <div className="flex items-center gap-1 text-red-600">
      <Clock size={12} />
      <span className="text-xs font-mono font-bold">{formatCountdown(seconds)}</span>
    </div>
  );
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

function DealCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? calcDiscount(product.price, product.originalPrice)
      : 0;

  const savings =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((v) => !v);
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col h-full shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/product/${product.slug}`} className="block relative">
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <DiscountBadge percent={discount} />
          </div>
        )}
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
        {/* Image */}
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                `https://placehold.co/400x400/F3F3F3/131921?text=${encodeURIComponent(product.brand)}`;
            }}
          />
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs text-[var(--muted)] font-medium">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 hover:text-[var(--primary)] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-[var(--primary)]">
            {CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {savings > 0 && (
          <p className="text-xs font-semibold text-emerald-600">
            Save {CURRENCY_SYMBOL}{savings.toFixed(2)}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            added
              ? "bg-emerald-500 text-white"
              : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)]"
          }`}
        >
          {added ? (
            <><Check size={15} /> Added!</>
          ) : (
            <><ShoppingCart size={15} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Flash Sale Card ──────────────────────────────────────────────────────────

function FlashSaleCard({
  item,
  countdown,
}: {
  item: (typeof FLASH_SALES)[0];
  countdown: number;
}) {
  const [added, setAdded] = useState(false);
  const discount = calcDiscount(item.price, item.originalPrice);

  return (
    <div className="bg-white rounded-2xl border border-red-200 overflow-hidden flex flex-col shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <DiscountBadge percent={discount} />
        </div>
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                `https://placehold.co/400x400/F3F3F3/131921?text=${encodeURIComponent(item.brand)}`;
            }}
          />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs text-[var(--muted)] font-medium">{item.brand}</p>
        <h3 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 leading-snug">
          {item.name}
        </h3>
        <StarRating rating={item.rating} count={item.reviewCount} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--primary)]">
            {CURRENCY_SYMBOL}{item.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {CURRENCY_SYMBOL}{item.originalPrice.toFixed(2)}
          </span>
        </div>
        <MiniCountdown seconds={countdown} />
        <button
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            added
              ? "bg-emerald-500 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {added ? <><Check size={15} /> Added!</> : <><ShoppingCart size={15} /> Grab Deal</>}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsPage() {
  const [activeCategory, setActiveCategory] = useState("All Deals");
  const [sortBy, setSortBy] = useState<SortKey>("discount");
  const [sortOpen, setSortOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: only start timer after mount
  useEffect(() => {
    setMounted(true);
    setCountdown(getInitialSeconds());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 23 * 3600 + 59 * 60 + 59;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Filter products that are on sale
  const saleProducts = products.filter(
    (p) => p.originalPrice !== undefined && p.originalPrice > p.price
  );

  // Apply category filter
  const categoryFiltered =
    activeCategory === "All Deals"
      ? saleProducts
      : saleProducts.filter(
          (p) =>
            p.category.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  // Sort
  const sorted = [...categoryFiltered].sort((a, b) => {
    if (sortBy === "discount") {
      const da = a.originalPrice ? calcDiscount(a.price, a.originalPrice) : 0;
      const db = b.originalPrice ? calcDiscount(b.price, b.originalPrice) : 0;
      return db - da;
    }
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Featured deal — highest discount product
  const featuredDeal = sorted[0] ?? saleProducts[0];
  const featuredDiscount =
    featuredDeal?.originalPrice
      ? calcDiscount(featuredDeal.price, featuredDeal.originalPrice)
      : 0;

  const countdownDisplay = mounted ? formatCountdown(countdown) : "23:59:59";
  const [hh, mm, ss] = countdownDisplay.split(":");

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── 1. Hero Banner ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[var(--accent)] to-[#1a252f] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left: heading */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={28} className="text-[var(--primary)] fill-[var(--primary)]" />
                <span className="text-[var(--primary)] font-bold text-sm uppercase tracking-widest">
                  Limited Time Offers
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Today&apos;s Best Deals
              </h1>
              <p className="text-white/70 text-lg max-w-md">
                Limited time offers — don&apos;t miss out! Prices drop every day at midnight.
              </p>
            </div>

            {/* Right: countdown */}
            <div className="flex-shrink-0 text-center">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
                Deals End In:
              </p>
              <div className="flex items-center gap-2">
                {[hh, mm, ss].map((unit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="bg-[var(--primary)] text-[var(--foreground)] rounded-xl px-4 py-3 min-w-[64px] text-center">
                      <span className="font-mono font-bold text-3xl leading-none block">
                        {unit}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest mt-1 block opacity-80">
                        {i === 0 ? "HRS" : i === 1 ? "MIN" : "SEC"}
                      </span>
                    </div>
                    {i < 2 && (
                      <span className="text-[var(--primary)] font-bold text-2xl">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Filter Tabs ────────────────────────────────────────── */}
      <section className="bg-white border-b border-[var(--border)] sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === tab
                    ? "bg-[var(--primary)] text-[var(--foreground)] border-[var(--primary)]"
                    : "bg-white text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">
        {/* ── 3. Featured Deal of the Day ──────────────────────────────────── */}
        {featuredDeal && (
          <Reveal>
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Tag size={20} className="text-[var(--primary)]" />
                <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  Deal of the Day
                </h2>
              </div>
              <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-card)] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative bg-gray-50 flex items-center justify-center min-h-[300px] md:min-h-[400px] overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                        <Percent size={13} />
                        {featuredDiscount}% OFF
                      </span>
                    </div>
                    <img
                      src={featuredDeal.image}
                      alt={featuredDeal.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          `https://placehold.co/600x400/F3F3F3/131921?text=${encodeURIComponent(featuredDeal.brand)}`;
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-8 flex flex-col justify-center gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--muted)] mb-1">
                        {featuredDeal.brand} · {featuredDeal.category}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-tight mb-3">
                        {featuredDeal.name}
                      </h3>
                      <StarRating
                        rating={featuredDeal.rating}
                        count={featuredDeal.reviewCount}
                      />
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-[var(--primary)]">
                        {CURRENCY_SYMBOL}{featuredDeal.price.toFixed(2)}
                      </span>
                      {featuredDeal.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {CURRENCY_SYMBOL}{featuredDeal.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {featuredDeal.originalPrice && (
                      <p className="text-emerald-600 font-semibold">
                        You save {CURRENCY_SYMBOL}
                        {(featuredDeal.originalPrice - featuredDeal.price).toFixed(2)}
                      </p>
                    )}

                    {featuredDeal.stockCount !== undefined && (
                      <p className="text-sm text-red-500 font-semibold">
                        Only {featuredDeal.stockCount} left in stock!
                      </p>
                    )}

                    <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
                      {featuredDeal.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <Link
                        href={`/product/${featuredDeal.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-bold py-3 px-6 rounded-xl transition-colors"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </Link>
                      <Link
                        href={`/product/${featuredDeal.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[#1a252f] text-white font-bold py-3 px-6 rounded-xl transition-colors"
                      >
                        View Details
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* ── 4. Deals Grid ────────────────────────────────────────────────── */}
        <Reveal>
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-[var(--primary)]" />
                <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  All Deals
                </h2>
                <span className="text-sm text-[var(--muted)] ml-1">
                  ({sorted.length} offers)
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 bg-white border border-[var(--border)] rounded-xl px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                >
                  <Filter size={14} />
                  Sort by: {currentSortLabel}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg z-20 min-w-[200px] overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === opt.value
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                            : "hover:bg-gray-50 text-[var(--foreground)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="text-center py-20">
                <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-2">
                  No deals in this category right now
                </h3>
                <p className="text-[var(--muted)] mb-6">
                  Check back soon — new deals drop every day!
                </p>
                <button
                  onClick={() => setActiveCategory("All Deals")}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold px-6 py-2.5 rounded-xl transition-colors"
                >
                  View All Deals
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sorted.map((product) => (
                  <DealCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </Reveal>

        {/* ── 5. Flash Sale Section ─────────────────────────────────────────── */}
        <Reveal>
          <section className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <Flame size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Flash Sale
                  </h2>
                  <p className="text-sm text-red-600 font-medium">
                    50%+ off — ultra-limited stock!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <Clock size={16} />
                <span className="text-sm font-semibold">Ends in:</span>
                <span className="font-mono font-bold text-lg">{countdownDisplay}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FLASH_SALES.map((item) => (
                <FlashSaleCard key={item.id} item={item} countdown={countdown} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 6. Bottom CTA ─────────────────────────────────────────────────── */}
        <Reveal>
          <section className="text-center py-10">
            <h2 className="font-display text-2xl font-bold text-[var(--foreground)] mb-3">
              Looking for more?
            </h2>
            <p className="text-[var(--muted)] mb-6">
              Browse our full catalog of 50,000+ products across all categories.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[#1a252f] text-white font-bold py-3 px-8 rounded-xl transition-colors text-base"
            >
              See All Products
              <ArrowRight size={18} />
            </Link>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
