"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X, Star, Heart, ShoppingCart, Grid, List, ChevronRight, Tag, Zap, Package, Filter } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  categories,
  products,
  getProductsByCategory,
  formatPrice,
  type Product,
  type Category,
} from "@/lib/data";
import { fadeInUp, staggerContainer, staggerItem, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── generateStaticParams (exported for Next.js static generation) ────────────
export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

// ─── Inline types ─────────────────────────────────────────────────────────────
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid" | "list";

interface FilterState {
  priceMin: string;
  priceMax: string;
  rating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  brands: string[];
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: "",
  priceMax: "",
  rating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  brands: [],
};

// ─── Category promotional banners ─────────────────────────────────────────────
const PROMO_BANNERS: Record<string, { headline: string; sub: string; cta: string; bg: string; accent: string }> = {
  electronics: {
    headline: "Tech Week Sale",
    sub: "Up to 40% off on top electronics brands. Limited time only.",
    cta: "Shop Deals",
    bg: "from-[var(--accent)] to-[#1a3a5c]",
    accent: "var(--primary)",
  },
  fashion: {
    headline: "New Season Arrivals",
    sub: "Fresh styles just landed. Discover the latest trends in fashion.",
    cta: "Explore Now",
    bg: "from-[#3d1a5c] to-[#1a1a3d]",
    accent: "#e879f9",
  },
  "home-kitchen": {
    headline: "Home Refresh Event",
    sub: "Transform your space with premium cookware, appliances, and decor.",
    cta: "Shop Home",
    bg: "from-[#1a3d2b] to-[#1a2a1a]",
    accent: "#4ade80",
  },
  books: {
    headline: "Read More, Pay Less",
    sub: "Thousands of titles on sale. Expand your library today.",
    cta: "Browse Books",
    bg: "from-[#3d2a1a] to-[#2a1a0a]",
    accent: "#fb923c",
  },
  sports: {
    headline: "Gear Up for Greatness",
    sub: "Top-rated fitness gear and outdoor equipment at unbeatable prices.",
    cta: "Shop Sports",
    bg: "from-[#1a2a3d] to-[#0a1a2a]",
    accent: "#38bdf8",
  },
};

// ─── Star Rating component ────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? "fill-[var(--primary)] text-[var(--primary)]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, viewMode }: { product: Product; viewMode: ViewMode }) {
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

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="bg-white rounded-2xl border border-black/5 overflow-hidden flex gap-4 p-4"
      >
        <Link href={`/product/${product.slug}`} className="flex-shrink-0 w-36 h-36 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892"; }}
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[var(--accent)]/60 font-medium mb-1">{product.brand}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={product.rating} />
              <span className="text-xs text-gray-500">({(product.reviewCount ?? 0).toLocaleString("en-US")})</span>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--foreground)]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlist}
                className="p-2 rounded-full border border-black/10 hover:border-red-300 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-3 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-xs font-semibold rounded-xl transition-colors"
              >
                <ShoppingCart size={14} />
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col group"
    >
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892"; }}
        />
        {product.badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
            {product.badge}
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform"
          aria-label="Add to wishlist"
        >
          <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-[var(--accent)]/60 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[11px] text-gray-400">({(product.reviewCount ?? 0).toLocaleString("en-US")})</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-base font-bold text-[var(--foreground)]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-xs font-semibold rounded-xl transition-colors"
          >
            <ShoppingCart size={13} />
            {addedToCart ? "Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
function FilterSidebar({
  filters,
  setFilters,
  brands,
  onClose,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  brands: string[];
  onClose?: () => void;
}) {
  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: next });
  };

  const resetAll = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[var(--foreground)] text-sm flex items-center gap-2">
          <Filter size={15} />
          Filters
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={resetAll} className="text-xs text-[var(--accent)] hover:underline">
            Reset all
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Minimum rating */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Minimum Rating</p>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, rating: filters.rating === r ? 0 : r })}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                filters.rating === r ? "bg-[var(--primary)]/20 text-[var(--foreground)] font-semibold" : "hover:bg-gray-50"
              }`}
            >
              <StarRating rating={r} size={12} />
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="mb-5 flex flex-col gap-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-medium text-[var(--foreground)]">In Stock Only</span>
          <button
            role="switch"
            aria-checked={filters.inStockOnly}
            onClick={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })}
            className={`w-9 h-5 rounded-full transition-colors relative ${filters.inStockOnly ? "bg-[var(--accent)]" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.inStockOnly ? "translate-x-4" : ""}`}
            />
          </button>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-medium text-[var(--foreground)]">On Sale Only</span>
          <button
            role="switch"
            aria-checked={filters.onSaleOnly}
            onClick={() => setFilters({ ...filters, onSaleOnly: !filters.onSaleOnly })}
            className={`w-9 h-5 rounded-full transition-colors relative ${filters.onSaleOnly ? "bg-[var(--accent)]" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.onSaleOnly ? "translate-x-4" : ""}`}
            />
          </button>
        </label>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Brand</p>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-3.5 h-3.5 accent-[var(--accent)] rounded"
                />
                <span className="text-xs text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const category = categories.find((c) => c.slug === slug) ?? null;
  const allCategoryProducts = useMemo(
    () => (category ? getProductsByCategory(category.slug) : []),
    [category]
  );

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const brands = useMemo(() => {
    const set = new Set<string>();
    allCategoryProducts.forEach((p) => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort();
  }, [allCategoryProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...allCategoryProducts];

    if (filters.priceMin !== "") {
      const min = parseFloat(filters.priceMin);
      if (!isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (filters.priceMax !== "") {
      const max = parseFloat(filters.priceMax);
      if (!isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (filters.rating > 0) {
      list = list.filter((p) => (p.rating ?? 0) >= filters.rating);
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    if (filters.onSaleOnly) {
      list = list.filter((p) => !!p.discountPercent);
    }
    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
        break;
      default:
        list = list.filter((p) => p.isBestseller).concat(list.filter((p) => !p.isBestseller));
    }

    return list;
  }, [allCategoryProducts, filters, sortBy]);

  const promo = PROMO_BANNERS[slug] ?? PROMO_BANNERS["electronics"];

  const sortLabels: Record<SortOption, string> = {
    featured: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    rating: "Highest Rated",
    newest: "Newest First",
  };

  if (!category) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <Package size={48} className="text-gray-300" />
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Category Not Found</h1>
        <p className="text-gray-500 text-sm">The category you are looking for does not exist.</p>
        <Link
          href="/shop"
          className="mt-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold rounded-xl transition-colors text-sm"
        >
          Browse All Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Promotional Banner ── */}
      <Reveal>
        <div className={`bg-gradient-to-r ${promo.bg} text-white`}>
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${promo.accent}22` }}
              >
                <Zap size={20} style={{ color: promo.accent }} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-0.5">
                  {category.name} Promotion
                </p>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{promo.headline}</h2>
                <p className="text-sm opacity-75 mt-0.5 max-w-md">{promo.sub}</p>
              </div>
            </div>
            <button
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: promo.accent, color: "var(--foreground)" }}
            >
              {promo.cta}
            </button>
          </div>
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ── Breadcrumb ── */}
        <Reveal>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link href="/shop" className="hover:text-[var(--accent)] transition-colors">
              Shop
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-[var(--foreground)] font-medium">{category.name}</span>
          </nav>
        </Reveal>

        {/* ── Category Header ── */}
        <Reveal>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={14} className="text-[var(--accent)]" />
                  <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-widest">
                    Category
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight text-balance">
                  {category.name}
                </h1>
                <p className="text-gray-500 mt-1.5 text-sm leading-relaxed max-w-xl">
                  {category.description}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {(category.productCount ?? 0).toLocaleString("en-US")}
                  </p>
                  <p className="text-xs text-gray-500">Products available</p>
                </div>
              </div>
            </div>

            {/* Category image strip */}
            <div className="mt-5 rounded-2xl overflow-hidden h-40 md:h-52 relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-category.jpg"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/60 to-transparent" />
              <div className="absolute inset-0 flex items-center px-8">
                <div>
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                    BazaarX
                  </p>
                  <p className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                    {category.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Related Categories ── */}
        <Reveal>
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs text-gray-400 font-medium flex-shrink-0">Browse:</span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  cat.slug === slug
                    ? "bg-[var(--accent)] text-white"
                    : "bg-white border border-black/10 text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* ── Main Layout: Sidebar + Grid ── */}
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} setFilters={setFilters} brands={brands} />
            </div>
          </aside>

          {/* Product area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold hover:border-[var(--accent)] transition-colors"
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                  </button>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-[var(--foreground)]">
                      {filteredProducts.length}
                    </span>{" "}
                    results
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortDropdownOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white border border-black/10 rounded-xl text-xs font-semibold hover:border-[var(--accent)] transition-colors"
                    >
                      {sortLabels[sortBy]}
                      <ChevronDown size={13} className={`transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {sortDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-black/10 shadow-lg z-20 overflow-hidden"
                        >
                          {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setSortDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                sortBy === opt
                                  ? "bg-[var(--primary)]/20 font-semibold text-[var(--foreground)]"
                                  : "hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              {sortLabels[opt]}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* View mode toggle */}
                  <div className="flex items-center bg-white border border-black/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[var(--accent)] text-white" : "text-gray-400 hover:text-[var(--foreground)]"}`}
                      aria-label="Grid view"
                    >
                      <Grid size={14} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${viewMode === "list" ? "bg-[var(--accent)] text-white" : "text-gray-400 hover:text-[var(--foreground)]"}`}
                      aria-label="List view"
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Active filter chips */}
            {(filters.brands.length > 0 || filters.rating > 0 || filters.inStockOnly || filters.onSaleOnly || filters.priceMin || filters.priceMax) && (
              <Reveal>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setFilters({ ...filters, brands: filters.brands.filter((x) => x !== b) })}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full hover:bg-[var(--accent)]/20 transition-colors"
                    >
                      {b} <X size={10} />
                    </button>
                  ))}
                  {filters.rating > 0 && (
                    <button
                      onClick={() => setFilters({ ...filters, rating: 0 })}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full hover:bg-[var(--accent)]/20 transition-colors"
                    >
                      {filters.rating}+ Stars <X size={10} />
                    </button>
                  )}
                  {filters.inStockOnly && (
                    <button
                      onClick={() => setFilters({ ...filters, inStockOnly: false })}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full hover:bg-[var(--accent)]/20 transition-colors"
                    >
                      In Stock <X size={10} />
                    </button>
                  )}
                  {filters.onSaleOnly && (
                    <button
                      onClick={() => setFilters({ ...filters, onSaleOnly: false })}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full hover:bg-[var(--accent)]/20 transition-colors"
                    >
                      On Sale <X size={10} />
                    </button>
                  )}
                  {(filters.priceMin || filters.priceMax) && (
                    <button
                      onClick={() => setFilters({ ...filters, priceMin: "", priceMax: "" })}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full hover:bg-[var(--accent)]/20 transition-colors"
                    >
                      Price range <X size={10} />
                    </button>
                  )}
                </div>
              </Reveal>
            )}

            {/* Product Grid / List */}
            {filteredProducts.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Package size={48} className="text-gray-200" />
                  <p className="text-lg font-semibold text-gray-400">No products match your filters</p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-semibold rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </Reveal>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product, i) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <ProductCard product={product} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--background)] z-50 overflow-y-auto p-4 lg:hidden"
            >
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                brands={brands}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}