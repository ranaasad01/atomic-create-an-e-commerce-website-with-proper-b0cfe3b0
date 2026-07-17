"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Filter, ChevronDown, ChevronRight, Search, X, Check, Zap, Award, Truck, RotateCcw, ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { staggerContainer, staggerItem, fadeInUp, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

interface SportsProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: "new" | "sale" | "bestseller" | "deal";
  inStock: boolean;
  subcategory: string;
  tags: string[];
  description: string;
}

const sportsProducts: SportsProduct[] = [
  {
    id: "sp001",
    slug: "nike-air-zoom-pegasus-40",
    name: "Nike Air Zoom Pegasus 40 Running Shoes",
    brand: "Nike",
    price: 129.99,
    originalPrice: 159.99,
    discountPercent: 19,
    rating: 4.7,
    reviewCount: 2341,
    image: "/images/nike-air-zoom-pegasus-running-shoes.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Footwear",
    tags: ["running", "shoes", "nike"],
    description: "Responsive cushioning for everyday training runs.",
  },
  {
    id: "sp002",
    slug: "bowflex-adjustable-dumbbells",
    name: "Bowflex SelectTech 552 Adjustable Dumbbells (Pair)",
    brand: "Bowflex",
    price: 349.99,
    originalPrice: 429.99,
    discountPercent: 19,
    rating: 4.8,
    reviewCount: 5812,
    image: "/images/bowflex-adjustable-dumbbells-pair.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Fitness Equipment",
    tags: ["dumbbells", "weights", "home gym"],
    description: "Replaces 15 sets of weights in one compact design.",
  },
  {
    id: "sp003",
    slug: "garmin-forerunner-255-gps-watch",
    name: "Garmin Forerunner 255 GPS Running Smartwatch",
    brand: "Garmin",
    price: 299.99,
    originalPrice: 349.99,
    discountPercent: 14,
    rating: 4.6,
    reviewCount: 1874,
    image: "/images/garmin-forerunner-255-gps-smartwatch.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Wearables",
    tags: ["gps", "watch", "running", "garmin"],
    description: "Advanced training metrics and multi-sport tracking.",
  },
  {
    id: "sp004",
    slug: "yeti-rambler-water-bottle",
    name: "YETI Rambler 26 oz Vacuum Insulated Bottle",
    brand: "YETI",
    price: 44.99,
    rating: 4.9,
    reviewCount: 9203,
    image: "/images/yeti-rambler-insulated-water-bottle.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Accessories",
    tags: ["water bottle", "hydration", "yeti"],
    description: "Keeps drinks cold 24 hrs and hot 12 hrs.",
  },
  {
    id: "sp005",
    slug: "peloton-yoga-mat",
    name: "Peloton Premium Yoga & Fitness Mat",
    brand: "Peloton",
    price: 79.99,
    originalPrice: 99.99,
    discountPercent: 20,
    rating: 4.5,
    reviewCount: 743,
    image: "/images/peloton-premium-yoga-fitness-mat.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Yoga & Pilates",
    tags: ["yoga", "mat", "fitness"],
    description: "Non-slip surface with alignment lines for all levels.",
  },
  {
    id: "sp006",
    slug: "wilson-pro-staff-tennis-racket",
    name: "Wilson Pro Staff 97 v14 Tennis Racket",
    brand: "Wilson",
    price: 219.99,
    originalPrice: 259.99,
    discountPercent: 15,
    rating: 4.7,
    reviewCount: 612,
    image: "/images/wilson-pro-staff-tennis-racket.jpg",
    badge: "new",
    inStock: true,
    subcategory: "Racket Sports",
    tags: ["tennis", "racket", "wilson"],
    description: "Tour-level control with a classic feel.",
  },
  {
    id: "sp007",
    slug: "under-armour-compression-shirt",
    name: "Under Armour HeatGear Compression Long Sleeve",
    brand: "Under Armour",
    price: 34.99,
    originalPrice: 44.99,
    discountPercent: 22,
    rating: 4.4,
    reviewCount: 3201,
    image: "/images/under-armour-heatgear-compression-shirt.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Activewear",
    tags: ["compression", "shirt", "activewear"],
    description: "Moisture-wicking fabric that keeps you cool and dry.",
  },
  {
    id: "sp008",
    slug: "spalding-nba-basketball",
    name: "Spalding NBA Official Game Basketball",
    brand: "Spalding",
    price: 149.99,
    rating: 4.8,
    reviewCount: 1456,
    image: "/images/spalding-nba-official-game-basketball.jpg",
    inStock: true,
    subcategory: "Team Sports",
    tags: ["basketball", "nba", "spalding"],
    description: "Official size and weight used in NBA games.",
  },
  {
    id: "sp009",
    slug: "trek-marlin-5-mountain-bike",
    name: "Trek Marlin 5 Gen 3 Mountain Bike",
    brand: "Trek",
    price: 699.99,
    originalPrice: 849.99,
    discountPercent: 18,
    rating: 4.6,
    reviewCount: 389,
    image: "/images/trek-marlin-5-mountain-bike.jpg",
    badge: "deal",
    inStock: true,
    subcategory: "Cycling",
    tags: ["bike", "mountain bike", "trek"],
    description: "Versatile trail bike for beginners and enthusiasts.",
  },
  {
    id: "sp010",
    slug: "theragun-prime-massage-gun",
    name: "Theragun Prime Percussive Therapy Device",
    brand: "Therabody",
    price: 249.99,
    originalPrice: 299.99,
    discountPercent: 17,
    rating: 4.7,
    reviewCount: 2108,
    image: "/images/theragun-prime-percussive-massage-gun.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Recovery",
    tags: ["massage gun", "recovery", "theragun"],
    description: "Quiet, powerful deep muscle treatment in 4 speeds.",
  },
  {
    id: "sp011",
    slug: "adidas-ultraboost-23",
    name: "Adidas Ultraboost 23 Running Shoes",
    brand: "Adidas",
    price: 189.99,
    originalPrice: 219.99,
    discountPercent: 14,
    rating: 4.6,
    reviewCount: 1987,
    image: "/images/adidas-ultraboost-23-running-shoes.jpg",
    badge: "new",
    inStock: true,
    subcategory: "Footwear",
    tags: ["running", "shoes", "adidas"],
    description: "Responsive Boost midsole for energy return.",
  },
  {
    id: "sp012",
    slug: "resistance-bands-set",
    name: "Fit Simplify Resistance Loop Bands Set (5 Pack)",
    brand: "Fit Simplify",
    price: 19.99,
    originalPrice: 29.99,
    discountPercent: 33,
    rating: 4.5,
    reviewCount: 14320,
    image: "/images/resistance-loop-bands-set-5-pack.jpg",
    badge: "deal",
    inStock: true,
    subcategory: "Fitness Equipment",
    tags: ["resistance bands", "workout", "home gym"],
    description: "5 resistance levels for full-body workouts anywhere.",
  },
];

const subcategories = [
  "All",
  "Footwear",
  "Fitness Equipment",
  "Wearables",
  "Activewear",
  "Cycling",
  "Team Sports",
  "Racket Sports",
  "Yoga & Pilates",
  "Recovery",
  "Accessories",
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "discount", label: "Best Discount" },
];

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $250", min: 100, max: 250 },
  { label: "$250 & Above", min: 250, max: Infinity },
];

const featuredBrands = ["Nike", "Adidas", "Garmin", "Bowflex", "Wilson", "YETI", "Therabody", "Trek"];

const heroStats = [
  { value: "189+", label: "Products" },
  { value: "50+", label: "Top Brands" },
  { value: "4.7", label: "Avg Rating" },
  { value: "Free", label: "Returns" },
];

// ─── Badge component ─────────────────────────────────────────────────────────

function BadgePill({ badge }: { badge: SportsProduct["badge"] }) {
  if (!badge) return null;
  const map: Record<string, { label: string; cls: string }> = {
    new: { label: "New", cls: "bg-blue-500 text-white" },
    sale: { label: "Sale", cls: "bg-red-500 text-white" },
    bestseller: { label: "Bestseller", cls: "bg-[var(--primary)] text-[var(--foreground)]" },
    deal: { label: "Deal", cls: "bg-orange-500 text-white" },
  };
  const config = map[badge];
  if (!config) return null;
  return (
    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${config.cls}`}>
      {config.label}
    </span>
  );
}

// ─── Star rating ─────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: SportsProduct }) {
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
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <BadgePill badge={product.badge} />
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              size={15}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wide">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">
            {CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-xs font-semibold text-green-600">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.96 }}
          className={`mt-1 w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            addedToCart
              ? "bg-green-500 text-white"
              : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)]"
          }`}
        >
          {addedToCart ? (
            <>
              <Check size={15} />
              Added
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SportsCategoryPage() {
  const t = useTranslations();

  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedSubcategory("All");
    setSelectedPriceRange(null);
    setSelectedBrands([]);
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedSubcategory !== "All" ? 1 : 0) +
    (selectedPriceRange !== null ? 1 : 0) +
    selectedBrands.length;

  const filteredProducts = useMemo(() => {
    let list = [...sportsProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedSubcategory !== "All") {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      if (range) {
        list = list.filter((p) => p.price >= range.min && p.price < range.max);
      }
    }

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    switch (selectedSort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [searchQuery, selectedSubcategory, selectedPriceRange, selectedBrands, selectedSort]);

  const currentSortLabel = sortOptions.find((o) => o.value === selectedSort)?.label ?? "Featured";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <Reveal>
        <section className="relative overflow-hidden bg-[var(--accent)] text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--primary)] blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--primary)] blur-2xl -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
                    Home
                  </Link>
                  <ChevronRight size={14} className="text-white/40" />
                  <span className="text-[var(--primary)] text-sm font-medium">Sports</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-balance mb-4">
                  Sports &amp; Outdoors
                </h1>
                <p className="text-white/75 text-lg leading-relaxed text-pretty max-w-md">
                  Gear up for every game, trail, and training session. Top brands, unbeatable prices, and fast shipping on 189+ products.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {["Running", "Home Gym", "Cycling", "Team Sports", "Recovery"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const match = subcategories.find((s) =>
                          s.toLowerCase().includes(tag.toLowerCase().split(" ")[0])
                        );
                        if (match) setSelectedSubcategory(match);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-[var(--primary)] hover:text-[var(--foreground)] border border-white/20 transition-all duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center"
                  >
                    <p className="text-2xl font-bold text-[var(--primary)]">{stat.value}</p>
                    <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Trust bar ── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            {[
              { icon: Truck, text: "Free shipping on orders over $49" },
              { icon: RotateCcw, text: "30-day free returns" },
              { icon: Award, text: "Authentic brands guaranteed" },
              { icon: Zap, text: "Same-day dispatch on in-stock items" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon size={15} className="text-[var(--accent)]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Subcategory pills ── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100 sticky top-[64px] z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSubcategory === sub
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar filters (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-36 space-y-6">
              {/* Search within category */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Search Sports</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Price Range</h3>
                <div className="space-y-1">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setSelectedPriceRange(selectedPriceRange === idx ? null : idx)
                      }
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedPriceRange === idx
                          ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Brand</h3>
                <div className="space-y-1">
                  {featuredBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(brand)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedBrands.includes(brand)
                            ? "bg-[var(--accent)] border-[var(--accent)]"
                            : "border-gray-300 group-hover:border-[var(--accent)]"
                        }`}
                      >
                        {selectedBrands.includes(brand) && <Check size={10} className="text-white" />}
                      </div>
                      <span
                        onClick={() => toggleBrand(brand)}
                        className="text-sm text-gray-700 group-hover:text-gray-900"
                      >
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <X size={14} />
                  Clear all filters ({activeFilterCount})
                </button>
              )}
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {selectedSubcategory !== "All" && (
                  <> in <span className="font-semibold text-gray-900">{selectedSubcategory}</span></>
                )}
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sort: {currentSortLabel}
                    <ChevronDown size={14} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg z-40 overflow-hidden"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSelectedSort(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              selectedSort === opt.value
                                ? "bg-[var(--primary)]/20 text-[var(--foreground)] font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSubcategory !== "All" && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium">
                    {selectedSubcategory}
                    <button onClick={() => setSelectedSubcategory("All")}>
                      <X size={11} />
                    </button>
                  </span>
                )}
                {selectedPriceRange !== null && priceRanges[selectedPriceRange] && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium">
                    {priceRanges[selectedPriceRange].label}
                    <button onClick={() => setSelectedPriceRange(null)}>
                      <X size={11} />
                    </button>
                  </span>
                )}
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium"
                  >
                    {brand}
                    <button onClick={() => toggleBrand(brand)}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Featured collections banner ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Shop by Activity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Running Essentials",
                desc: "Shoes, GPS watches, and hydration gear for every distance.",
                image: "/images/sports-running-essentials-collection.jpg",
                sub: "Footwear",
                color: "from-blue-900/70",
              },
              {
                title: "Home Gym Setup",
                desc: "Dumbbells, resistance bands, and mats to build your perfect home gym.",
                image: "/images/sports-home-gym-setup-collection.jpg",
                sub: "Fitness Equipment",
                color: "from-emerald-900/70",
              },
              {
                title: "Recovery Zone",
                desc: "Massage guns, foam rollers, and compression gear to bounce back faster.",
                image: "/images/sports-recovery-zone-collection.jpg",
                sub: "Recovery",
                color: "from-purple-900/70",
              },
            ].map((col) => (
              <motion.button
                key={col.title}
                onClick={() => setSelectedSubcategory(col.sub)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] text-left group"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${col.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-white font-bold text-lg leading-tight">{col.title}</h3>
                  <p className="text-white/75 text-sm mt-1 leading-snug">{col.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-[var(--primary)] text-sm font-semibold">
                    Shop Now <ArrowRight size={14} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Top brands strip ── */}
      <Reveal>
        <section className="bg-white border-y border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Top Brands in Sports
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {featuredBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrands([brand]);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA banner ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--accent)] text-white px-8 py-12 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[var(--primary)] blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
                New arrivals every week
              </h2>
              <p className="text-white/75 text-base max-w-md">
                Subscribe and be the first to know about new gear drops, exclusive deals, and seasonal sales.
              </p>
            </div>
            <div className="relative flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 text-sm outline-none focus:border-[var(--primary)] transition-colors"
              />
              <button className="px-5 py-3 rounded-xl bg-[var(--primary)] text-[var(--foreground)] font-semibold text-sm hover:opacity-90 transition-opacity flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden overflow-y-auto p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Search</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {/* Subcategory */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Category</h3>
                <div className="space-y-1">
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedSubcategory === sub
                          ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Price Range</h3>
                <div className="space-y-1">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setSelectedPriceRange(selectedPriceRange === idx ? null : idx)
                      }
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedPriceRange === idx
                          ? "bg-[var(--primary)] text-[var(--foreground)] font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Brand</h3>
                <div className="space-y-1">
                  {featuredBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(brand)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedBrands.includes(brand)
                            ? "bg-[var(--accent)] border-[var(--accent)]"
                            : "border-gray-300 group-hover:border-[var(--accent)]"
                        }`}
                      >
                        {selectedBrands.includes(brand) && <Check size={10} className="text-white" />}
                      </div>
                      <span
                        onClick={() => toggleBrand(brand)}
                        className="text-sm text-gray-700"
                      >
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}