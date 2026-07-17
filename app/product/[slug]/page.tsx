"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Check, Truck, RotateCcw, Shield, Minus, Plus, ZoomIn, ThumbsUp, ChevronLeft, ChevronDown } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  getProductBySlug,
  products,
  formatPrice,
  CURRENCY_SYMBOL,
  type Product,
  type ProductVariant,
  type ProductReview,
} from "@/lib/data";
import { fadeInUp, staggerContainer, staggerItem, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline helpers ────────────────────────────────────────────────────────────

function StarRating({
  rating,
  size = 16,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gray-200 fill-gray-200"
              strokeWidth={0}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: filled ? "100%" : half ? "50%" : "0%" }}
            >
              <Star
                size={size}
                className="text-[var(--primary)] fill-[var(--primary)]"
                strokeWidth={0}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-right text-[var(--muted-foreground)]">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--primary)] rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className="w-8 text-[var(--muted-foreground)]">{count}</span>
    </div>
  );
}

// ─── Inline mock data ──────────────────────────────────────────────────────────

const MOCK_PRODUCT: Product = {
  id: "p001",
  slug: "sony-wh1000xm5-headphones",
  name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
  brand: "Sony",
  category: "Electronics",
  categorySlug: "electronics",
  price: 279.99,
  originalPrice: 399.99,
  discountPercent: 30,
  rating: 4.7,
  reviewCount: 2847,
  image: "/images/sony-wh1000xm5-headphones.jpg",
  images: [
    "/images/sony-wh1000xm5-headphones.jpg",
    "/images/sony-headphones-side-view.jpg",
    "/images/sony-headphones-folded.jpg",
    "/images/sony-headphones-case.jpg",
    "/images/sony-headphones-wearing.jpg",
  ],
  badge: "sale",
  description:
    "Industry-leading noise canceling with two processors and eight microphones. 30-hour battery life with quick charging. Multipoint connection lets you pair with two Bluetooth devices simultaneously. Crystal clear hands-free calling with precise voice pickup.",
  features: [
    "Industry-leading noise cancellation powered by two processors",
    "30-hour battery life with 3-min quick charge (3 hrs playback)",
    "Multipoint connection — pair with two devices simultaneously",
    "Crystal-clear hands-free calling with 8 microphones",
    "Speak-to-Chat pauses music when you start talking",
    "Adaptive Sound Control adjusts to your activity",
    "Lightweight, ergonomic design with soft-fit leather",
    "Hi-Res Audio and LDAC support for studio-quality sound",
  ],
  variants: [
    { id: "v1", label: "Color", value: "Midnight Black", available: true },
    { id: "v2", label: "Color", value: "Platinum Silver", available: true },
    { id: "v3", label: "Color", value: "Smoke Blue", available: false },
  ],
  inStock: true,
  stockCount: 14,
  isBestseller: true,
  isNew: false,
  tags: ["headphones", "wireless", "noise-canceling", "sony", "audio"],
  reviews: [
    {
      id: "r1",
      author: "Marcus T.",
      rating: 5,
      title: "Best headphones I have ever owned",
      body: "The noise cancellation is absolutely incredible. I use these on my daily commute and they block out everything. Sound quality is rich and detailed. Battery lasts all week with my usage.",
      date: "2024-11-15",
      verified: true,
    },
    {
      id: "r2",
      author: "Priya S.",
      rating: 4,
      title: "Excellent ANC, slightly tight fit",
      body: "Sound quality and noise cancellation are top-notch. My only minor complaint is that after 3+ hours they feel a bit tight. But the audio experience is unmatched at this price point.",
      date: "2024-10-28",
      verified: true,
    },
    {
      id: "r3",
      author: "James R.",
      rating: 5,
      title: "Worth every penny",
      body: "Upgraded from the XM4 and the improvement is noticeable. Lighter, better call quality, and the new ear cushions are much more comfortable. Multipoint connection works flawlessly.",
      date: "2024-10-05",
      verified: true,
    },
  ],
};

const RELATED_PRODUCTS: Product[] = [
  {
    id: "rp1",
    slug: "bose-quietcomfort-45",
    name: "Bose QuietComfort 45 Headphones",
    brand: "Bose",
    category: "Electronics",
    categorySlug: "electronics",
    price: 249.99,
    originalPrice: 329.99,
    discountPercent: 24,
    rating: 4.5,
    reviewCount: 1923,
    image: "https://m.media-amazon.com/images/I/51HHABMPoVL._AC_UF894,1000_QL80_.jpg",
    images: ["https://m.media-amazon.com/images/I/51HHABMPoVL._AC_UF894,1000_QL80_.jpg"],
    badge: "sale",
    description: "Acclaimed noise cancellation and audio performance.",
    features: [],
    inStock: true,
    tags: ["headphones", "bose"],
    reviews: [],
  },
  {
    id: "rp2",
    slug: "apple-airpods-pro-2",
    name: "Apple AirPods Pro (2nd Generation)",
    brand: "Apple",
    category: "Electronics",
    categorySlug: "electronics",
    price: 199.99,
    originalPrice: 249.99,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 5412,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    images: ["https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg"],
    badge: "bestseller",
    description: "Adaptive Audio, Transparency mode, and Personalized Spatial Audio.",
    features: [],
    inStock: true,
    isBestseller: true,
    tags: ["earbuds", "apple"],
    reviews: [],
  },
  {
    id: "rp3",
    slug: "jabra-evolve2-85",
    name: "Jabra Evolve2 85 Wireless Headset",
    brand: "Jabra",
    category: "Electronics",
    categorySlug: "electronics",
    price: 319.99,
    originalPrice: 379.99,
    discountPercent: 16,
    rating: 4.4,
    reviewCount: 876,
    image: "/images/jabra-evolve2-85-headset.jpg",
    images: ["/images/jabra-evolve2-85-headset.jpg"],
    badge: "new",
    description: "Professional-grade headset with advanced ANC for focused work.",
    features: [],
    inStock: true,
    isNew: true,
    tags: ["headset", "jabra", "professional"],
    reviews: [],
  },
  {
    id: "rp4",
    slug: "sennheiser-momentum-4",
    name: "Sennheiser Momentum 4 Wireless",
    brand: "Sennheiser",
    category: "Electronics",
    categorySlug: "electronics",
    price: 229.99,
    originalPrice: 299.99,
    discountPercent: 23,
    rating: 4.6,
    reviewCount: 1104,
    image: "/images/sennheiser-momentum-4-wireless.jpg",
    images: ["/images/sennheiser-momentum-4-wireless.jpg"],
    badge: "sale",
    description: "60-hour battery life with adaptive noise cancellation.",
    features: [],
    inStock: true,
    tags: ["headphones", "sennheiser"],
    reviews: [],
  },
];

const RATING_BREAKDOWN = [
  { label: "5 stars", count: 1980 },
  { label: "4 stars", count: 568 },
  { label: "3 stars", count: 185 },
  { label: "2 stars", count: 72 },
  { label: "1 star", count: 42 },
];

// ─── Cart store (Zustand-compatible inline mock) ───────────────────────────────

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
};

// Simple in-memory cart state using React state (Zustand would be wired here)
function useInlineCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useCallback(
    (product: Product, quantity: number, variant?: string) => {
      setCartItems((prev) => {
        const key = `${product.id}-${variant ?? "default"}`;
        const existing = prev.find((i) => i.id === key);
        if (existing) {
          return prev.map((i) =>
            i.id === key ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [
          ...prev,
          {
            id: key,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            variant,
          },
        ];
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    },
    []
  );

  return { cartItems, addToCart, addedToCart };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const safeImages = images.length > 0 ? images : ["https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892"];
  const activeImage = safeImages[activeIdx] ?? safeImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-black/5 cursor-zoom-in select-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.img
          key={activeIdx}
          src={activeImage}
          alt={name}
          className="w-full h-full object-contain p-4"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: "scale(1.8)",
                  transition: "transform 0.1s ease-out",
                }
              : { transform: "scale(1)", transition: "transform 0.3s ease-out" }
          }
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
          }}
        />
        {/* Zoom hint */}
        {!isZoomed && (
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm pointer-events-none">
            <ZoomIn size={14} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {safeImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              activeIdx === idx
                ? "border-[var(--accent)] shadow-md"
                : "border-transparent hover:border-gray-300"
            }`}
            aria-label={`View image ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${name} thumbnail ${idx + 1}`}
              className="w-full h-full object-contain p-1 bg-gray-50"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ProductVariant[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const colorMap: Record<string, string> = {
    "Midnight Black": "#1a1a1a",
    "Platinum Silver": "#c0c0c0",
    "Smoke Blue": "#6b8cae",
  };

  return (
    <div>
      <p className="text-sm font-semibold text-[var(--foreground)] mb-2">
        Color:{" "}
        <span className="font-normal text-[var(--muted-foreground)]">{selected}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = selected === v.value;
          const bg = colorMap[v.value];
          return (
            <button
              key={v.id}
              onClick={() => v.available && onSelect(v.value)}
              disabled={!v.available}
              title={v.available ? v.value : `${v.value} (Out of stock)`}
              className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                isSelected
                  ? "border-[var(--accent)] scale-110 shadow-md"
                  : "border-transparent hover:border-gray-400"
              } ${!v.available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              style={{ backgroundColor: bg ?? "#ccc" }}
              aria-label={v.value}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check size={12} className="text-white drop-shadow" />
                </span>
              )}
              {!v.available && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-0.5 bg-white/70 rotate-45 block" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuantityPicker({
  quantity,
  max,
  onChange,
}: {
  quantity: number;
  max: number;
  onChange: (q: number) => void;
}) {
  return (
    <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="w-12 text-center text-sm font-semibold text-[var(--foreground)] border-x border-gray-200 h-10 flex items-center justify-center">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl border border-black/5 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} size={14} />
            {review.verified && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                <Check size={10} /> Verified
              </span>
            )}
          </div>
          <p className="font-semibold text-sm text-[var(--foreground)]">{review.title}</p>
        </div>
        <span className="text-xs text-[var(--muted-foreground)] flex-shrink-0">
          {review.date}
        </span>
      </div>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3">{review.body}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--foreground)]">{review.author}</span>
        <button className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
          <ThumbsUp size={12} /> Helpful
        </button>
      </div>
    </motion.div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const discount = product.discountPercent ?? 0;
  const badgeColors: Record<string, string> = {
    sale: "bg-red-100 text-red-700",
    new: "bg-blue-100 text-blue-700",
    bestseller: "bg-amber-100 text-amber-700",
    deal: "bg-purple-100 text-purple-700",
  };

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex-shrink-0 w-52 cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-3"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
            }}
          />
          {product.badge && (
            <span
              className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                badgeColors[product.badge] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-[var(--muted-foreground)] mb-0.5">{product.brand}</p>
          <p className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 leading-snug mb-1">
            {product.name}
          </p>
          <StarRating rating={product.rating} size={12} />
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-sm font-bold text-[var(--foreground)]">
              {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
            </span>
            {(product.originalPrice ?? 0) > 0 && (
              <span className="text-xs text-[var(--muted-foreground)] line-through">
                {CURRENCY_SYMBOL}{(product.originalPrice ?? 0).toFixed(2)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs text-red-600 font-semibold">{discount}% off</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page component ────────────────────────────────────────────────────────────

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Resolve product — fall back to mock if not found in data
  const dataProduct = getProductBySlug(params.slug);
  const product: Product = dataProduct ?? MOCK_PRODUCT;

  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.[0]?.value ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"features" | "reviews">("features");

  const { addToCart, addedToCart } = useInlineCart();

  const maxQty = product.stockCount ?? 10;
  const discount = product.discountPercent ?? 0;
  const savings = (product.originalPrice ?? 0) - product.price;

  const totalReviews = RATING_BREAKDOWN.reduce((s, r) => s + r.count, 0);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    window.location.href = "/checkout";
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Breadcrumb ── */}
      <Reveal>
        <nav
          aria-label="Breadcrumb"
          className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1 text-sm text-[var(--muted-foreground)]"
        >
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <Link
            href={`/category/${product.categorySlug}`}
            className="hover:text-[var(--accent)] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} className="flex-shrink-0" />
          <span className="text-[var(--foreground)] font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>
      </Reveal>

      {/* ── Main product section ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Gallery */}
          <Reveal delay={0.05}>
            <ProductGallery images={product.images} name={product.name} />
          </Reveal>

          {/* Info panel */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-5">
              {/* Brand + badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.isBestseller && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    New
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {discount}% Off
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--foreground)] leading-tight tracking-tight text-balance">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={product.rating} size={18} />
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {product.rating.toFixed(1)}
                </span>
                <a
                  href="#reviews"
                  className="text-sm text-[var(--accent)] hover:underline"
                >
                  {product.reviewCount.toLocaleString("en-US")} ratings
                </a>
              </div>

              {/* Price block */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-black/5">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-[var(--foreground)]">
                    {CURRENCY_SYMBOL}{product.price.toFixed(2)}
                  </span>
                  {(product.originalPrice ?? 0) > 0 && (
                    <span className="text-lg text-[var(--muted-foreground)] line-through">
                      {CURRENCY_SYMBOL}{(product.originalPrice ?? 0).toFixed(2)}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-sm text-emerald-600 font-semibold mt-1">
                    You save {CURRENCY_SYMBOL}{savings.toFixed(2)} ({discount}%)
                  </p>
                )}
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Free delivery on orders over $35. Ships from BazaarX.
                </p>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-emerald-600">In Stock</span>
                    {(product.stockCount ?? 0) < 20 && (
                      <span className="text-sm text-orange-600">
                        — Only {product.stockCount} left
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-red-600">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {product.description}
              </p>

              {/* Variant selector */}
              {(product.variants?.length ?? 0) > 0 && (
                <VariantSelector
                  variants={product.variants ?? []}
                  selected={selectedVariant}
                  onSelect={setSelectedVariant}
                />
              )}

              {/* Quantity + actions */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <QuantityPicker
                    quantity={quantity}
                    max={maxQty}
                    onChange={setQuantity}
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Max {maxQty} per order
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {/* Add to cart */}
                  <motion.button
                    onClick={() =>
                      addToCart(product, quantity, selectedVariant || undefined)
                    }
                    disabled={!product.inStock}
                    whileTap={{ scale: 0.97 }}
                    className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      addedToCart
                        ? "bg-emerald-500 text-white"
                        : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)]"
                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]`}
                  >
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <Check size={16} /> Added to Cart
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart size={16} /> Add to Cart
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Buy now */}
                  <motion.button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 min-w-[160px] px-6 py-3 rounded-xl font-semibold text-sm bg-[var(--accent)] text-white hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                  >
                    Buy Now
                  </motion.button>
                </div>

                {/* Wishlist + Share */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWishlist((w) => !w)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      wishlist
                        ? "text-red-500 font-semibold"
                        : "text-[var(--muted-foreground)] hover:text-red-500"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={16}
                      className={wishlist ? "fill-red-500" : ""}
                    />
                    {wishlist ? "Saved" : "Save to Wishlist"}
                  </button>
                  <span className="text-gray-200">|</span>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                      aria-label="Share product"
                    >
                      <Share2 size={16} /> Share
                    </button>
                    <AnimatePresence>
                      {showShareToast && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute bottom-full left-0 mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap"
                        >
                          Link copied!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5">
                {[
                  { icon: Truck, label: "Free Shipping", sub: "Orders over $35" },
                  { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free" },
                  { icon: Shield, label: "Secure Payment", sub: "256-bit SSL" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1 p-2 rounded-xl bg-gray-50">
                    <Icon size={18} className="text-[var(--accent)]" />
                    <span className="text-xs font-semibold text-[var(--foreground)]">{label}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Features / Reviews tabs ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 pb-12" id="reviews">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {(["features", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab === "features" ? "Product Features" : `Reviews (${product.reviewCount.toLocaleString("en-US")})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "features" ? (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(product.features ?? []).map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-white rounded-xl border border-black/5 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-[var(--foreground)]" />
                      </span>
                      <span className="text-sm text-[var(--foreground)] leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Aggregate */}
                <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] h-fit">
                  <div className="text-center mb-4">
                    <p className="text-5xl font-bold text-[var(--foreground)]">
                      {product.rating.toFixed(1)}
                    </p>
                    <StarRating rating={product.rating} size={20} className="justify-center mt-1" />
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {product.reviewCount.toLocaleString("en-US")} global ratings
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {RATING_BREAKDOWN.map((r) => (
                      <RatingBar
                        key={r.label}
                        label={r.label}
                        count={r.count}
                        total={totalReviews}
                      />
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="lg:col-span-2 flex flex-col gap-4"
                >
                  {(product.reviews ?? []).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  <button className="self-start text-sm text-[var(--accent)] font-semibold hover:underline mt-1">
                    See all {product.reviewCount.toLocaleString("en-US")} reviews
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </Reveal>

      {/* ── Related products carousel ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display font-bold text-[var(--foreground)] tracking-tight">
              Customers Also Viewed
            </h2>
            <Link
              href={`/category/${product.categorySlug}`}
              className="text-sm text-[var(--accent)] font-semibold hover:underline flex items-center gap-1"
            >
              See all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth">
              {RELATED_PRODUCTS.map((rp, i) => (
                <Reveal key={rp.id} delay={i * 0.07} className="snap-start">
                  <RelatedProductCard product={rp} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}