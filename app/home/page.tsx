"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowRight, Star, ShoppingCart, Heart, Zap, Shield, Truck, RotateCcw, ChevronRight, Sparkles, Clock, TrendingUp, Package, Eye } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  APP_NAME,
  APP_TAGLINE,
  CURRENCY_SYMBOL,
  categories,
  products,
  dealOfTheDay,
  bestsellers,
  newArrivals,
  formatPrice,
  type Product,
} from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, staggerItem, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Hero slides ─────────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    eyebrow: "New Arrivals 2025",
    headline: "Next-Gen Tech, Delivered Fast",
    sub: "Explore the latest smartphones, laptops, and audio gear at unbeatable prices.",
    cta: "Shop Electronics",
    href: "/category/electronics",
    badge: "Up to 40% off",
    image: "https://img.magnific.com/free-psd/black-friday-super-sale-facebook-cover-banner-template_120329-5177.jpg?semt=ais_hybrid&w=740&q=80",
    accent: "var(--primary)",
  },
  {
    id: 2,
    eyebrow: "Fashion Forward",
    headline: "Style That Speaks for Itself",
    sub: "Curated collections for every season, every occasion, every you.",
    cta: "Browse Fashion",
    href: "/category/fashion",
    badge: "Free shipping over $49",
    image: "https://s3-alpha.figma.com/hub/file/2487300310/4b7cf365-091f-4df0-818e-d57f3e021fec-cover.png",
    accent: "var(--primary)",
  },
  {
    id: 3,
    eyebrow: "Home Refresh",
    headline: "Transform Your Living Space",
    sub: "Premium cookware, smart appliances, and décor that elevates every room.",
    cta: "Shop Home & Kitchen",
    href: "/category/home-kitchen",
    badge: "New arrivals weekly",
    image: "https://i.pcmag.com/imagery/articles/05gRKvauYOM6j5a1gW7aKHG-1.fit_lim.v1569484637.jpg",
    accent: "var(--primary)",
  },
];

// ─── Trust badges ─────────────────────────────────────────────────────────────
const trustBadges = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over $49" },
  { icon: Shield, label: "Secure Checkout", sub: "256-bit SSL encryption" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day hassle-free returns" },
  { icon: Zap, label: "Fast Delivery", sub: "2-day delivery available" },
];

// ─── Promo banners ────────────────────────────────────────────────────────────
const promoBanners = [
  {
    id: "b1",
    label: "Books Sale",
    headline: "Read More, Spend Less",
    sub: "Up to 50% off bestsellers and new releases.",
    href: "/category/books",
    image: "/images/promo-books-sale.jpg",
    badge: "50% off",
  },
  {
    id: "b2",
    label: "Sports & Fitness",
    headline: "Gear Up for Greatness",
    sub: "Premium fitness equipment and activewear.",
    href: "/category/sports",
    image: "/images/promo-sports-fitness.jpg",
    badge: "New gear in",
  },
];

// ─── Stat strip ───────────────────────────────────────────────────────────────
const stats = [
  { value: "2M+", label: "Happy Customers" },
  { value: "50K+", label: "Products Listed" },
  { value: "99.4%", label: "Satisfaction Rate" },
  { value: "2-Day", label: "Avg. Delivery" },
];

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetHours: number) {
  const [timeLeft, setTimeLeft] = useState({ h: targetHours, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const end = Date.now() + targetHours * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHours]);

  return { timeLeft, mounted };
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((v) => !v);
  };

  return (
    <Reveal delay={delay}>
      <motion.div
        className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14),0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-300"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Image */}
        <Link href={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
            }}
          />
          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
              product.badge === "sale" || product.badge === "deal"
                ? "bg-red-500 text-white"
                : product.badge === "new"
                ? "bg-[var(--primary)] text-[var(--foreground)]"
                : product.badge === "bestseller"
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}>
              {product.badge === "deal" ? "Deal" : product.badge === "sale" ? `${product.discountPercent ?? 0}% off` : product.badge}
            </span>
          )}
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart
              size={15}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>
          {/* Quick view */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-2 flex items-center justify-center gap-1 text-white text-xs font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={13} />
            Quick View
          </div>
        </Link>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{product.brand}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
              {product.name}
            </h3>
          </Link>
          {/* Rating */}
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({(product.reviewCount ?? 0).toLocaleString("en-US")})</span>
          </div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto pt-2">
            <span className="text-base font-bold text-gray-900">
              {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className={`mt-2 w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              addedToCart
                ? "bg-green-500 text-white"
                : "bg-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            <ShoppingCart size={13} />
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </motion.div>
    </Reveal>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  sub,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-1">{eyebrow}</p>
        )}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight text-balance">
          {title}
        </h2>
        {sub && <p className="text-sm text-gray-500 mt-1 text-pretty">{sub}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:gap-2 transition-all duration-200 flex-shrink-0"
        >
          {linkLabel}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const t = useTranslations();
  const [activeSlide, setActiveSlide] = useState(0);
  const { timeLeft, mounted } = useCountdown(8);

  // Auto-advance hero
  useEffect(() => {
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = heroSlides[activeSlide];
  const dealProduct = dealOfTheDay ?? products[0];
  const bestsellerList = (bestsellers ?? []).slice(0, 8);
  const newArrivalList = (newArrivals ?? []).slice(0, 8);

  return (
    <main className="min-h-screen bg-[var(--background)]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--accent)] min-h-[480px] md:min-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/80 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 text-white max-w-xl"
            >
              <span className="inline-block bg-[var(--primary)] text-[var(--foreground)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                {slide.badge}
              </span>
              <p className="text-sm font-medium text-white/70 mb-2">{slide.eyebrow}</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight text-balance mb-4">
                {slide.headline}
              </h1>
              <p className="text-base text-white/80 leading-relaxed mb-8 text-pretty">{slide.sub}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 bg-[var(--primary)] text-[var(--foreground)] font-bold px-6 py-3 rounded-xl hover:bg-[var(--primary-hover)] transition-colors duration-200 shadow-lg"
                >
                  {slide.cta}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/20"
                >
                  Browse All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-8 bg-[var(--primary)]" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader
            eyebrow="Explore"
            title="Shop by Category"
            sub="Find exactly what you need across our curated departments."
            href="/shop"
            linkLabel="All Categories"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.07}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] block shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)] transition-shadow duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-bold text-sm leading-tight">{cat.name}</p>
                    <p className="text-white/70 text-[10px] mt-0.5">{(cat.productCount ?? 0).toLocaleString("en-US")} items</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Shop
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── DEAL OF THE DAY ──────────────────────────────────────────────── */}
      {dealProduct && (
        <Reveal>
          <section className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/90 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col lg:flex-row items-center gap-10 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                {/* Image */}
                <div className="flex-shrink-0 w-full lg:w-72 aspect-square rounded-2xl overflow-hidden bg-white/10">
                  <img
                    src={dealProduct.image}
                    alt={dealProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
                {/* Content */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-[var(--primary)]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Deal of the Day</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2 text-balance">
                    {dealProduct.name}
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">{dealProduct.description}</p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-[var(--primary)]">
                      {CURRENCY_SYMBOL}{(dealProduct.price ?? 0).toFixed(2)}
                    </span>
                    {dealProduct.originalPrice && (
                      <span className="text-lg text-white/50 line-through">
                        {CURRENCY_SYMBOL}{dealProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {dealProduct.discountPercent && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {dealProduct.discountPercent}% off
                      </span>
                    )}
                  </div>
                  {/* Countdown */}
                  <div className="flex items-center gap-3 mb-6">
                    <Clock size={14} className="text-white/60" />
                    <span className="text-xs text-white/60 font-medium">Ends in:</span>
                    {mounted ? (
                      <div className="flex gap-2">
                        {[
                          { val: timeLeft.h, label: "hr" },
                          { val: timeLeft.m, label: "min" },
                          { val: timeLeft.s, label: "sec" },
                        ].map(({ val, label }) => (
                          <div key={label} className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-1.5 min-w-[48px]">
                            <span className="text-lg font-bold text-white tabular-nums">
                              {String(val).padStart(2, "0")}
                            </span>
                            <span className="text-[9px] text-white/50 uppercase tracking-wide">{label}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {["hr", "min", "sec"].map((label) => (
                          <div key={label} className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-1.5 min-w-[48px]">
                            <span className="text-lg font-bold text-white">--</span>
                            <span className="text-[9px] text-white/50 uppercase tracking-wide">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/product/${dealProduct.slug}`}
                    className="inline-flex items-center gap-2 bg-[var(--primary)] text-[var(--foreground)] font-bold px-6 py-3 rounded-xl hover:bg-[var(--primary-hover)] transition-colors duration-200"
                  >
                    Grab This Deal
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ── BESTSELLERS ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <Reveal>
          <SectionHeader
            eyebrow="Top Picks"
            title="Bestsellers"
            sub="The products our customers love most, week after week."
            href="/shop?sort=bestseller"
            linkLabel="See All Bestsellers"
          />
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {bestsellerList.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 0.06} />
          ))}
        </div>
      </section>

      {/* ── PROMO BANNERS ────────────────────────────────────────────────── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {promoBanners.map((banner) => (
              <Link
                key={banner.id}
                href={banner.href}
                className="group relative rounded-2xl overflow-hidden aspect-[16/7] block shadow-[0_2px_8px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)] transition-shadow duration-300"
              >
                <img
                  src={banner.image}
                  alt={banner.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-8">
                  <span className="inline-block bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 w-fit">
                    {banner.badge}
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1 tracking-tight">
                    {banner.headline}
                  </h3>
                  <p className="text-sm text-white/75 mb-4">{banner.sub}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] group-hover:gap-2.5 transition-all duration-200">
                    Shop Now <ChevronRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <SectionHeader
              eyebrow="Just In"
              title="New Arrivals"
              sub="Fresh products added this week. Be the first to own them."
              href="/shop?sort=newest"
              linkLabel="View All New"
            />
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newArrivalList.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-[var(--accent)] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map(({ value, label }, i) => (
                <Reveal key={label} delay={i * 0.08}>
                  <div>
                    <p className="text-3xl md:text-4xl font-display font-bold text-[var(--primary)] mb-1">{value}</p>
                    <p className="text-sm text-white/70 font-medium">{label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── TRENDING CATEGORIES STRIP ────────────────────────────────────── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-14">
          <SectionHeader
            eyebrow="Trending Now"
            title="What People Are Buying"
            sub="Real-time trending picks across every category."
          />
          <div className="flex flex-wrap gap-3">
            {[
              "Wireless Earbuds", "Running Shoes", "Air Fryer", "Yoga Mat",
              "Thriller Novels", "Smart Watch", "Denim Jacket", "Coffee Maker",
              "Resistance Bands", "Graphic Tees", "Instant Pot", "Sci-Fi Books",
              "Laptop Stand", "Hiking Boots", "Blender", "Protein Powder",
            ].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-4 py-2 rounded-full bg-white border border-black/8 text-sm font-medium text-gray-700 hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-[var(--foreground)] transition-all duration-200 shadow-sm"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 py-16 border-t border-black/5">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Sparkles size={32} className="text-[var(--accent)] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight mb-3">
              Get Exclusive Deals First
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Join over 2 million shoppers who get early access to flash sales, new arrivals, and members-only discounts.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </Reveal>

    </main>
  );
}

// ─── Newsletter form (isolated to avoid controlled input issues) ──────────────
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-2 text-green-700"
      >
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <TrendingUp size={22} className="text-green-600" />
        </div>
        <p className="font-semibold">You are on the list!</p>
        <p className="text-sm text-gray-500">Watch your inbox for exclusive BazaarX deals.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        aria-label="Email address for newsletter"
        className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm bg-white outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent)]/90 transition-colors duration-200 text-sm flex-shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}