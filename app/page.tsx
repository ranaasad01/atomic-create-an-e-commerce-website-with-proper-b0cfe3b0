"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Star, ShoppingCart, Heart, ArrowRight, Truck, Shield, RotateCcw, Headphones, ChevronRight, Zap, TrendingUp, Award, Users, Package, Check, Clock, Sparkles } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  APP_NAME,
  APP_TAGLINE,
  CURRENCY_SYMBOL,
  categories,
  products,
  formatPrice,
  dealOfTheDay,
  bestsellers,
  newArrivals,
} from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, staggerItem, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

const heroSlides = [
  {
    id: "slide1",
    eyebrow: "New Arrivals 2025",
    headline: "Next-Gen Tech,\nDelivered Fast",
    sub: "Explore the latest Sony, Apple, and Samsung gear with free 2-day shipping on orders over $49.",
    cta: "Shop Electronics",
    href: "/category/electronics",
    image: "https://img.magnific.com/free-psd/black-friday-super-sale-facebook-cover-banner-template_120329-5177.jpg?semt=ais_hybrid&w=740&q=80",
    accent: "var(--primary)",
  },
  {
    id: "slide2",
    eyebrow: "Fashion Forward",
    headline: "Style That\nSpeaks Volumes",
    sub: "Curated collections from top brands. New drops every week — find your signature look today.",
    cta: "Browse Fashion",
    href: "/category/fashion",
    image: "https://s3-alpha.figma.com/hub/file/2487300310/4b7cf365-091f-4df0-818e-d57f3e021fec-cover.png",
    accent: "var(--primary)",
  },
  {
    id: "slide3",
    eyebrow: "Home Refresh",
    headline: "Transform Your\nLiving Space",
    sub: "Premium cookware, smart appliances, and décor essentials to make every room feel like home.",
    cta: "Shop Home & Kitchen",
    href: "/category/home-kitchen",
    image: "https://i.pcmag.com/imagery/articles/05gRKvauYOM6j5a1gW7aKHG-1.fit_lim.v1569484637.jpg",
    accent: "var(--primary)",
  },
];

const trustBadges = [
  { icon: Truck, label: "Free 2-Day Shipping", sub: "On orders over $49" },
  { icon: Shield, label: "Buyer Protection", sub: "100% secure checkout" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day hassle-free policy" },
  { icon: Headphones, label: "24/7 Support", sub: "Real humans, always ready" },
];

const stats = [
  { value: "2.4M+", label: "Happy Customers" },
  { value: "50K+", label: "Products Listed" },
  { value: "99.2%", label: "Satisfaction Rate" },
  { value: "4.8★", label: "Average Rating" },
];

const testimonials = [
  {
    id: "t1",
    name: "Marcus T.",
    location: "Austin, TX",
    rating: 5,
    text: "BazaarX has completely replaced my Amazon habit. The prices are better, shipping is just as fast, and the product quality is consistently excellent.",
    product: "Sony WH-1000XM5",
    avatar: "https://yt3.googleusercontent.com/ZNbKQvIcygyt1igH4EOHWYLlw0jgoYtTBMf7mC8KE2sAuUNSHAwy8CG2CzkpTE8RlVlYqmhQnA=s176-c-k-c0x00ffffff-no-rj-mo",
  },
  {
    id: "t2",
    name: "Priya S.",
    location: "Seattle, WA",
    rating: 5,
    text: "I ordered a kitchen stand mixer and it arrived in perfect condition, two days early. The packaging was immaculate and setup was a breeze.",
    product: "KitchenAid Stand Mixer",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQEsVGaT3gZljg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720453761122?e=2147483647&v=beta&t=fI57h9VVi0APY8AzA4yVkW9zOHjFnXyt8FqCm7X5BBc",
  },
  {
    id: "t3",
    name: "Jordan L.",
    location: "Chicago, IL",
    rating: 5,
    text: "The fashion section is genuinely curated — not just a dump of random items. Found a jacket I'd been hunting for months at 40% off.",
    product: "Levi's Trucker Jacket",
    avatar: "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2009%2F06%2Fnike-jordan-l-style-1.jpg?w=960&cbr=1&q=90&fit=max",
  },
];

const flashDeals = [
  {
    id: "fd1",
    name: "Apple AirPods Pro (2nd Gen)",
    price: 189.99,
    originalPrice: 249.99,
    discount: 24,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    rating: 4.9,
    reviewCount: 3241,
    href: "/product/apple-airpods-pro",
    endsIn: 14400,
  },
  {
    id: "fd2",
    name: "Instant Pot Duo 7-in-1",
    price: 59.99,
    originalPrice: 99.99,
    discount: 40,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviewCount: 8912,
    href: "/product/instant-pot-duo",
    endsIn: 14400,
  },
  {
    id: "fd3",
    name: "Nike Air Zoom Pegasus 40",
    price: 89.99,
    originalPrice: 130.0,
    discount: 31,
    image: "https://cdn.runrepeat.com/storage/gallery/product_primary/39801/nike-pegasus-40-21212260-main.jpg",
    rating: 4.7,
    reviewCount: 2187,
    href: "/product/nike-pegasus-40",
    endsIn: 14400,
  },
  {
    id: "fd4",
    name: "Atomic Habits — James Clear",
    price: 11.99,
    originalPrice: 27.0,
    discount: 56,
    image: "https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg",
    rating: 4.9,
    reviewCount: 15432,
    href: "/product/atomic-habits",
    endsIn: 14400,
  },
];

const whyChooseUs = [
  {
    id: "w1",
    icon: Zap,
    title: "Lightning-Fast Delivery",
    body: "Most orders ship same day and arrive within 2 business days anywhere in the continental US.",
  },
  {
    id: "w2",
    icon: Award,
    title: "Authenticity Guaranteed",
    body: "Every product is sourced directly from authorized distributors. Zero counterfeits, ever.",
  },
  {
    id: "w3",
    icon: TrendingUp,
    title: "Best Price Promise",
    body: "Find it cheaper elsewhere? We'll match the price and give you an extra 5% off. No questions asked.",
  },
  {
    id: "w4",
    icon: Users,
    title: "Community-Driven Curation",
    body: "Our catalog is shaped by real customer reviews and trending data — only the best makes the cut.",
  },
  {
    id: "w5",
    icon: Package,
    title: "Eco-Friendly Packaging",
    body: "100% recyclable materials across all shipments. We're committed to a greener supply chain.",
  },
  {
    id: "w6",
    icon: Check,
    title: "Hassle-Free Returns",
    body: "Changed your mind? Return anything within 30 days for a full refund — no restocking fees.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= Math.round(rating) ? "text-[var(--primary)] fill-[var(--primary)]" : "text-gray-300 fill-gray-300"}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      {[pad(h), pad(m), pad(s)].map((unit, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-[var(--accent)] text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {unit}
          </span>
          {i < 2 && <span className="text-[var(--accent)] font-bold text-xs">:</span>}
        </span>
      ))}
    </div>
  );
}

const productCardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function ProductCard({
  name,
  price,
  originalPrice,
  discount,
  image,
  rating,
  reviewCount,
  href,
  badge,
}: {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  reviewCount: number;
  href: string;
  badge?: string;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <motion.div
      variants={productCardVariant}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14)] transition-shadow duration-300"
    >
      <Link href={href} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
            }}
          />
          {badge && (
            <span className="absolute top-2 left-2 bg-[var(--primary)] text-[var(--accent)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {badge}
            </span>
          )}
          {discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-500 mb-0.5 truncate">{name.split(" ").slice(0, 2).join(" ")}</p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5">
            {name}
          </h3>
          <StarRating rating={rating} count={reviewCount} />
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">
              {CURRENCY_SYMBOL}{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {CURRENCY_SYMBOL}{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--accent)] text-xs font-semibold py-2 rounded-xl transition-all duration-200 active:scale-95"
        >
          {addedToCart ? (
            <>
              <Check size={13} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart size={13} />
              Add to Cart
            </>
          )}
        </button>
        <button
          onClick={() => setWishlisted((w) => !w)}
          className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all duration-200 ${
            wishlisted
              ? "bg-red-50 border-red-200 text-red-500"
              : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={13} className={wishlisted ? "fill-red-500" : ""} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"bestsellers" | "new" | "deals">("bestsellers");

  // Auto-advance hero
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  // Tab products
  const tabProducts =
    activeTab === "bestsellers"
      ? (bestsellers ?? []).slice(0, 8)
      : activeTab === "new"
      ? (newArrivals ?? []).slice(0, 8)
      : (products ?? []).filter((p) => (p.discountPercent ?? 0) >= 20).slice(0, 8);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--accent)] min-h-[520px] md:min-h-[600px]">
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
              alt={slide.headline.replace("\n", " ")}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/80 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-text"}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <span className="inline-block bg-[var(--primary)] text-[var(--accent)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                  {slide.eyebrow}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight mb-4 text-balance whitespace-pre-line">
                  {slide.headline}
                </h1>
                <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                  {slide.sub}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={slide.href}
                    className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--accent)] font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all duration-200"
                  >
                    View All Deals
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-8 bg-[var(--primary)]" : "w-2 bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0">
                    <badge.icon size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                    <p className="text-xs text-gray-500">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <Reveal>
        <section id="categories" className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-1">
                  Browse by Category
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight">
                  Everything You Need, One Place
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:text-[var(--primary)] transition-colors"
              >
                All Categories <ChevronRight size={16} />
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {(categories ?? []).map((cat, i) => (
                <motion.div key={cat.id} variants={staggerItem}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)] transition-shadow duration-300"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://www.shutterstock.com/image-vector/package-icon-trendy-modern-placeholder-260nw-1657310788.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-sm leading-tight">{cat.name}</p>
                      <p className="text-white/70 text-[10px] mt-0.5">
                        {cat.productCount.toLocaleString("en-US")} items
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── FLASH DEALS ──────────────────────────────────────────────────── */}
      <Reveal>
        <section id="deals" className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} className="text-red-500 fill-red-500" />
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest">
                      Flash Deals
                    </p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight">
                    Today&apos;s Best Offers
                  </h2>
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Clock size={10} /> Ends in
                  </p>
                  <CountdownTimer seconds={14400} />
                </div>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:text-[var(--primary)] transition-colors"
              >
                See All Deals <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashDeals.map((deal, i) => (
                <Reveal key={deal.id} delay={i * 0.07}>
                  <ProductCard
                    name={deal.name}
                    price={deal.price}
                    originalPrice={deal.originalPrice}
                    discount={deal.discount}
                    image={deal.image}
                    rating={deal.rating}
                    reviewCount={deal.reviewCount}
                    href={deal.href}
                    badge="Deal"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FEATURED PRODUCTS (tabbed) ────────────────────────────────────── */}
      <Reveal>
        <section id="featured" className="py-12 md:py-16 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-1">
                  <Sparkles size={11} className="inline mr-1" />
                  Curated For You
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight">
                  Shop Top Picks
                </h2>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                {(["bestsellers", "new", "deals"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "bestsellers" ? "Bestsellers" : tab === "new" ? "New Arrivals" : "On Sale"}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {(tabProducts ?? []).map((product, i) => (
                  <Reveal key={product.id} delay={i * 0.05}>
                    <ProductCard
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      discount={product.discountPercent}
                      image={product.image}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      href={`/product/${product.slug}`}
                      badge={product.badge}
                    />
                  </Reveal>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
              >
                Browse All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── STATS BANNER ─────────────────────────────────────────────────── */}
      <Reveal>
        <section className="py-12 md:py-16 bg-[var(--accent)]">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((stat, i) => (
                <motion.div key={stat.label} variants={staggerItem}>
                  <p className="text-3xl md:text-4xl font-display font-bold text-[var(--primary)] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/70 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <Reveal>
        <section id="about" className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-2">
                Why BazaarX
              </p>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-gray-900 tracking-tight mb-3 text-balance">
                Shopping Reimagined for the Modern Buyer
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
                We built BazaarX to fix everything frustrating about online shopping. Here is what sets us apart.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group p-6 rounded-2xl border border-black/5 bg-gray-50 hover:bg-white hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)]/30 transition-colors">
                    <item.icon size={20} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <Reveal>
        <section id="reviews" className="py-12 md:py-20 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-2">
                Customer Stories
              </p>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-gray-900 tracking-tight text-balance">
                Millions of Happy Shoppers
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {testimonials.map((review, i) => (
                <motion.div
                  key={review.id}
                  variants={staggerItem}
                  className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className="text-[var(--primary)] fill-[var(--primary)]"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--primary)]/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.location} · Verified Buyer</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <Reveal>
        <section id="contact" className="py-16 md:py-24 bg-[var(--accent)] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--primary)]/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block bg-[var(--primary)] text-[var(--accent)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5">
                Limited Time
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4 text-balance">
                Get 15% Off Your First Order
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                Join over 2.4 million shoppers who trust BazaarX for the best prices, fastest delivery, and unbeatable selection.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[var(--primary)] transition-colors text-sm"
                  aria-label="Email address for discount"
                  onChange={() => {}}
                />
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--accent)] font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg">
                  Claim My 15% Off
                </button>
              </div>
              <p className="text-white/40 text-xs mt-3">
                No spam. Unsubscribe anytime. Offer valid for new customers only.
              </p>
            </motion.div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}