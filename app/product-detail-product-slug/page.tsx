"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Check, ChevronDown, ChevronRight, Minus, Plus, Share2, ArrowLeft, AlertCircle, ThumbsUp, Package, Zap } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, staggerItem, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

interface ReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface VariantOption {
  id: string;
  label: string;
  available: boolean;
}

interface ProductImage {
  src: string;
  alt: string;
}

const PRODUCT = {
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
  reviewCount: 2843,
  badge: "sale" as const,
  inStock: true,
  stockCount: 14,
  description:
    "Experience industry-leading noise cancellation with the Sony WH-1000XM5. Featuring 8 microphones and two processors, these headphones deliver unparalleled sound isolation. With up to 30 hours of battery life, multipoint connection for two devices simultaneously, and crystal-clear hands-free calling, the XM5 redefines what wireless headphones can do.",
  features: [
    "Industry-leading noise cancellation with 8 microphones and 2 processors",
    "Up to 30 hours battery life (3 hours from 3-minute quick charge)",
    "Multipoint connection — connect to two Bluetooth devices simultaneously",
    "Speak-to-Chat pauses music when you start talking",
    "Adaptive Sound Control adjusts to your activity automatically",
    "Lightweight design at just 250g with soft fit leather",
    "Hi-Res Audio and LDAC support for studio-quality wireless sound",
    "Precise Voice Pickup technology for crystal-clear calls",
  ],
  images: [
    { src: "https://d1ncau8tqf99kp.cloudfront.net/360/M5_360view/WF-1000XM5_black_3600000_web.png", alt: "Sony WH-1000XM5 front view" },
    { src: "https://d1ncau8tqf99kp.cloudfront.net/360/M5_360view/WF-1000XM5_black_3600000_web.png", alt: "Sony WH-1000XM5 side view" },
    { src: "https://d1ncau8tqf99kp.cloudfront.net/360/M5_360view/WF-1000XM5_black_3600000_web.png", alt: "Sony WH-1000XM5 folded" },
    { src: "https://d1ncau8tqf99kp.cloudfront.net/360/M5_360view/WF-1000XM5_black_3600000_web.png", alt: "Sony WH-1000XM5 with case" },
  ] as ProductImage[],
  colors: [
    { id: "black", label: "Midnight Black", available: true },
    { id: "silver", label: "Platinum Silver", available: true },
    { id: "blue", label: "Midnight Blue", available: false },
  ] as VariantOption[],
  reviews: [
    {
      id: "r1",
      author: "Marcus T.",
      avatar: "https://colorguide.org/images/1024p/midnight_black_color_918_1ASapoH.jpg",
      rating: 5,
      title: "Best headphones I've ever owned",
      body: "The noise cancellation is absolutely incredible. I work in a busy open office and these completely block out all the chatter. Sound quality is rich and detailed. Battery lasts all week with my usage. Worth every penny.",
      date: "Jan 12, 2025",
      verified: true,
      helpful: 247,
    },
    {
      id: "r2",
      author: "Priya S.",
      avatar: "https://everydayparisian.com/wp-content/uploads/2025/03/101724_plotnick_rebecca_061-1-596x894.webp",
      rating: 5,
      title: "Perfect for long flights",
      body: "Flew 14 hours with these and my ears never got tired. The adaptive sound control is a game changer — it automatically switches to ambient mode when I land. Multipoint connection means I can switch between my laptop and phone seamlessly.",
      date: "Dec 28, 2024",
      verified: true,
      helpful: 189,
    },
    {
      id: "r3",
      author: "James K.",
      avatar: "http://mellysews.com/wp-content/uploads/2014/03/jeanfit8.jpg",
      rating: 4,
      title: "Excellent but slightly tight fit",
      body: "Sound quality and noise cancellation are top-tier. My only minor complaint is the headband feels a bit tight after 3+ hours. That said, the audio quality is phenomenal and the call quality is the best I've experienced on any headphone.",
      date: "Dec 15, 2024",
      verified: true,
      helpful: 134,
    },
    {
      id: "r4",
      author: "Aisha M.",
      avatar: "https://preview.redd.it/upgraded-from-xm4-to-xm5-worth-it-v0-5krptld2sbhe1.jpeg?auto=webp&s=5dc900e9be8dc9134720cd1b6d7e04425e2a4cc7",
      rating: 5,
      title: "Upgraded from XM4 — worth it",
      body: "The XM5 is a significant upgrade from the XM4. The noise cancellation is noticeably better, the design is sleeker, and the call quality improvement is massive. The new microphone array picks up my voice perfectly even in windy conditions.",
      date: "Nov 30, 2024",
      verified: true,
      helpful: 98,
    },
  ] as ReviewItem[],
};

const RELATED_PRODUCTS = [
  {
    id: "rp1",
    name: "Bose QuietComfort 45",
    brand: "Bose",
    price: 249.99,
    originalPrice: 329.99,
    rating: 4.5,
    reviewCount: 1920,
    image: "https://m.media-amazon.com/images/I/51HHABMPoVL._AC_UF894,1000_QL80_.jpg",
    slug: "bose-quietcomfort-45",
  },
  {
    id: "rp2",
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 5412,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    slug: "apple-airpods-pro-2nd-gen",
  },
  {
    id: "rp3",
    name: "Jabra Evolve2 85",
    brand: "Jabra",
    price: 319.99,
    originalPrice: 449.99,
    rating: 4.4,
    reviewCount: 876,
    image: "/images/jabra-evolve2-85-headphones.jpg",
    slug: "jabra-evolve2-85",
  },
  {
    id: "rp4",
    name: "Sennheiser Momentum 4",
    brand: "Sennheiser",
    price: 289.99,
    originalPrice: 379.99,
    rating: 4.6,
    reviewCount: 1103,
    image: "/images/sennheiser-momentum-4-headphones.jpg",
    slug: "sennheiser-momentum-4",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating >= star - 0.5;
        return (
          <span key={star} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gray-200 fill-gray-200"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? "50%" : "100%" }}
              >
                <Star size={size} className="text-[var(--primary)] fill-[var(--primary)]" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-12 text-right text-[var(--foreground)]/70 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--primary)] rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className="w-8 text-[var(--foreground)]/60 shrink-0">{count}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const t = useTranslations();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "features" | "reviews">("description");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const discount = PRODUCT.originalPrice
    ? Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100)
    : 0;

  const savings = PRODUCT.originalPrice
    ? (PRODUCT.originalPrice - PRODUCT.price).toFixed(2)
    : "0.00";

  const ratingBreakdown = [
    { label: "5 star", count: 1842 },
    { label: "4 star", count: 621 },
    { label: "3 star", count: 248 },
    { label: "2 star", count: 89 },
    { label: "1 star", count: 43 },
  ];

  const faqs = [
    {
      q: "Does it work with both Android and iOS?",
      a: "Yes. The Sony WH-1000XM5 connects via Bluetooth to any device including Android, iOS, Windows, and Mac. The Sony Headphones Connect app is available on both platforms for advanced customization.",
    },
    {
      q: "Can I use it while charging?",
      a: "Yes, you can use the headphones while they charge via USB-C. A 3-minute quick charge gives you approximately 3 hours of playback.",
    },
    {
      q: "Is the noise cancellation adjustable?",
      a: "Absolutely. You can fine-tune the noise cancellation level through the Sony Headphones Connect app, or use the Adaptive Sound Control feature which automatically adjusts based on your activity.",
    },
    {
      q: "What is included in the box?",
      a: "The package includes the WH-1000XM5 headphones, a carrying case, USB-C charging cable, 3.5mm audio cable, and an airplane adapter.",
    },
  ];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const incrementQty = () => setQuantity((q) => Math.min(q + 1, PRODUCT.stockCount ?? 10));
  const decrementQty = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumb */}
      <Reveal>
        <div className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-[var(--foreground)]/60" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                {t("nav.home")}
              </Link>
              <ChevronRight size={14} />
              <Link href="/shop" className="hover:text-[var(--accent)] transition-colors">
                {t("nav.shop")}
              </Link>
              <ChevronRight size={14} />
              <Link
                href={`/category/${PRODUCT.categorySlug}`}
                className="hover:text-[var(--accent)] transition-colors"
              >
                {PRODUCT.category}
              </Link>
              <ChevronRight size={14} />
              <span className="text-[var(--foreground)] font-medium truncate max-w-[200px]">
                {PRODUCT.name}
              </span>
            </nav>
          </div>
        </div>
      </Reveal>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* ── Image Gallery ── */}
          <Reveal className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={PRODUCT.images[selectedImage]?.src ?? "https://d1ncau8tqf99kp.cloudfront.net/360/M5_360view/WF-1000XM5_black_3600000_web.png"}
                  alt={PRODUCT.images[selectedImage]?.alt ?? PRODUCT.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/sony-wh1000xm5-headphones.jpg";
                  }}
                />
              </AnimatePresence>

              {/* Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{discount}%
                </div>
              )}

              {/* Wishlist button */}
              <motion.button
                onClick={() => setIsWishlisted((w) => !w)}
                whileTap={{ scale: 0.85 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-black/5 hover:border-[var(--primary)] transition-colors"
                aria-label={t("product.wishlist")}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </motion.button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    selectedImage === idx
                      ? "border-[var(--primary)] shadow-md"
                      : "border-black/8 hover:border-[var(--primary)]/50"
                  }`}
                  aria-label={img.alt}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/sony-wh1000xm5-headphones.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </Reveal>

          {/* ── Product Info ── */}
          <Reveal delay={0.1} className="flex flex-col gap-5">
            {/* Brand + title */}
            <div>
              <Link
                href={`/shop?brand=${PRODUCT.brand}`}
                className="text-sm font-semibold text-[var(--accent)] hover:underline uppercase tracking-wide"
              >
                {PRODUCT.brand}
              </Link>
              <h1 className="mt-1 text-2xl md:text-3xl font-display font-bold text-[var(--foreground)] leading-tight tracking-tight text-balance">
                {PRODUCT.name}
              </h1>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={PRODUCT.rating} size={18} />
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {PRODUCT.rating.toFixed(1)}
              </span>
              <span className="text-sm text-[var(--foreground)]/60">
                ({PRODUCT.reviewCount.toLocaleString("en-US")} {t("product.reviews")})
              </span>
              <span className="text-sm text-green-600 font-medium">
                {t("product.inStock")}
              </span>
            </div>

            {/* Price block */}
            <div className="bg-[var(--primary)]/8 rounded-2xl p-4 border border-[var(--primary)]/20">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-[var(--foreground)]">
                  {CURRENCY_SYMBOL}{PRODUCT.price.toFixed(2)}
                </span>
                {PRODUCT.originalPrice && (
                  <span className="text-lg text-[var(--foreground)]/40 line-through">
                    {CURRENCY_SYMBOL}{PRODUCT.originalPrice.toFixed(2)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    {t("product.save")} {CURRENCY_SYMBOL}{savings}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--foreground)]/50 mt-1">
                {t("product.taxNote")}
              </p>
            </div>

            {/* Color selector */}
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-2">
                {t("product.color")}:{" "}
                <span className="font-normal text-[var(--foreground)]/70">
                  {PRODUCT.colors.find((c) => c.id === selectedColor)?.label ?? ""}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {PRODUCT.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => color.available && setSelectedColor(color.id)}
                    disabled={!color.available}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                      selectedColor === color.id
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : color.available
                        ? "border-black/10 hover:border-[var(--accent)] text-[var(--foreground)]"
                        : "border-black/5 text-[var(--foreground)]/30 cursor-not-allowed line-through"
                    }`}
                    aria-pressed={selectedColor === color.id}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Quantity */}
              <div className="flex items-center border-2 border-black/10 rounded-xl overflow-hidden">
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  aria-label={t("product.decreaseQty")}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-[var(--foreground)]">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= (PRODUCT.stockCount ?? 10)}
                  className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  aria-label={t("product.increaseQty")}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white"
                }`}
                aria-label={t("product.addToCart")}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} />
                      {t("product.added")}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      {t("product.addToCart")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Share */}
              <button
                className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-black/10 hover:border-[var(--accent)] text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-all"
                aria-label={t("product.share")}
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Buy now */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
            >
              {t("product.buyNow")}
            </motion.button>

            {/* Stock warning */}
            {(PRODUCT.stockCount ?? 0) < 20 && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-xl px-4 py-2.5 border border-orange-100">
                <AlertCircle size={15} />
                <span>
                  {t("product.onlyLeft", { count: PRODUCT.stockCount ?? 0 })}
                </span>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-black/5">
              {[
                { icon: Truck, label: t("product.freeShipping"), sub: t("product.freeShippingSub") },
                { icon: RotateCcw, label: t("product.returns"), sub: t("product.returnsSub") },
                { icon: Shield, label: t("product.warranty"), sub: t("product.warrantySub") },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 p-2">
                  <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center">
                    <Icon size={16} className="text-[var(--accent)]" />
                  </div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">{label}</p>
                  <p className="text-[10px] text-[var(--foreground)]/50">{sub}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Tabs: Description / Features / Reviews ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 pb-12">
          {/* Tab nav */}
          <div className="flex gap-1 border-b border-black/8 mb-8">
            {(["description", "features", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-all duration-200 border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                }`}
              >
                {tab === "reviews"
                  ? `${t("product.tabReviews")} (${PRODUCT.reviewCount.toLocaleString("en-US")})`
                  : tab === "description"
                  ? t("product.tabDescription")
                  : t("product.tabFeatures")}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="max-w-3xl"
              >
                <p className="text-[var(--foreground)]/80 leading-relaxed text-base">
                  {PRODUCT.description}
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Zap, label: t("product.specBattery"), value: "30 hours" },
                    { icon: Package, label: t("product.specWeight"), value: "250g" },
                    { icon: Shield, label: t("product.specBluetooth"), value: "Bluetooth 5.2" },
                    { icon: Truck, label: t("product.specDriver"), value: "30mm" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--foreground)]/50">{label}</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "features" && (
              <motion.div
                key="features"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="max-w-3xl"
              >
                <ul className="space-y-3">
                  {PRODUCT.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      variants={staggerItem}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="text-[var(--foreground)]" />
                      </div>
                      <span className="text-sm text-[var(--foreground)]/80 leading-relaxed">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Rating summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] sticky top-24">
                      <div className="text-center mb-6">
                        <p className="text-6xl font-bold text-[var(--foreground)]">
                          {PRODUCT.rating.toFixed(1)}
                        </p>
                        <StarRating rating={PRODUCT.rating} size={20} />
                        <p className="text-sm text-[var(--foreground)]/50 mt-1">
                          {PRODUCT.reviewCount.toLocaleString("en-US")} {t("product.reviews")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {ratingBreakdown.map((row) => (
                          <RatingBar
                            key={row.label}
                            label={row.label}
                            count={row.count}
                            total={PRODUCT.reviewCount}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="lg:col-span-2 space-y-4">
                    {PRODUCT.reviews.map((review, i) => (
                      <motion.div
                        key={review.id}
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover border border-black/8 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=random`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-[var(--foreground)]">
                                {review.author}
                              </span>
                              {review.verified && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                  <Check size={10} />
                                  {t("product.verifiedPurchase")}
                                </span>
                              )}
                              <span className="text-xs text-[var(--foreground)]/40 ml-auto">
                                {review.date}
                              </span>
                            </div>
                            <StarRating rating={review.rating} size={14} />
                            <p className="mt-2 font-semibold text-sm text-[var(--foreground)]">
                              {review.title}
                            </p>
                            <p className="mt-1 text-sm text-[var(--foreground)]/70 leading-relaxed">
                              {review.body}
                            </p>
                            <button
                              onClick={() => handleHelpful(review.id)}
                              className={`mt-3 flex items-center gap-1.5 text-xs transition-colors ${
                                helpfulVotes[review.id]
                                  ? "text-[var(--accent)] font-semibold"
                                  : "text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
                              }`}
                            >
                              <ThumbsUp size={12} />
                              {t("product.helpful")} ({review.helpful + (helpfulVotes[review.id] ? 1 : 0)})
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </Reveal>

      {/* ── FAQ ── */}
      <Reveal>
        <section className="bg-white border-y border-black/5 py-12">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-display font-bold text-[var(--foreground)] mb-6 tracking-tight">
              {t("product.faqTitle")}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-black/8 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={expandedFaq === i}
                  >
                    <span className="font-semibold text-sm text-[var(--foreground)]">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-[var(--foreground)]/50 shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-[var(--foreground)]/70 leading-relaxed border-t border-black/5 pt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Related Products ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-[var(--foreground)] tracking-tight">
              {t("product.relatedTitle")}
            </h2>
            <Link
              href="/category/electronics"
              className="text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              {t("product.viewAll")}
              <ChevronRight size={14} />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {RELATED_PRODUCTS.map((rp) => {
              const rpDiscount = rp.originalPrice
                ? Math.round(((rp.originalPrice - rp.price) / rp.originalPrice) * 100)
                : 0;
              return (
                <motion.div
                  key={rp.id}
                  variants={staggerItem}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.16)] transition-shadow duration-300"
                >
                  <Link href={`/product/${rp.slug}`} className="block">
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
                        }}
                      />
                      {rpDiscount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{rpDiscount}%
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wide">
                        {rp.brand}
                      </p>
                      <p className="text-sm font-semibold text-[var(--foreground)] leading-snug mt-0.5 line-clamp-2">
                        {rp.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={rp.rating} size={12} />
                        <span className="text-[10px] text-[var(--foreground)]/50">
                          ({rp.reviewCount.toLocaleString("en-US")})
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-bold text-[var(--foreground)]">
                          {CURRENCY_SYMBOL}{rp.price.toFixed(2)}
                        </span>
                        {rp.originalPrice && (
                          <span className="text-xs text-[var(--foreground)]/40 line-through">
                            {CURRENCY_SYMBOL}{rp.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-3">
                    <button className="w-full py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center gap-1.5">
                      <ShoppingCart size={12} />
                      {t("product.addToCart")}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </Reveal>

      {/* ── Back to shop ── */}
      <Reveal>
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={16} />
            {t("product.backToShop")}
          </Link>
        </div>
      </Reveal>
    </main>
  );
}