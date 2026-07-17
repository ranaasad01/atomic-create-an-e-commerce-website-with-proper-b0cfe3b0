"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, ChevronDown, X, Grid, List, ArrowUpDown, Check, Filter } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  products,
  categories,
  formatPrice,
  CURRENCY_SYMBOL,
  type Product,
} from "@/lib/data";
import { staggerContainer, staggerItem, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid" | "list";

interface ActiveFilters {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "$200 & Above", min: 200, max: Infinity },
];

const RATING_OPTIONS = [4, 3, 2, 1];

// ─── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.round(rating)
                ? "fill-[var(--primary)] text-[var(--primary)]"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

// ─── Product Card (Grid) ───────────────────────────────────────────────────────
function ProductCardGrid({ product }: { product: Product }) {
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
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="group bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                product.badge === "sale" || product.badge === "deal"
                  ? "bg-red-500 text-white"
                  : product.badge === "new"
                  ? "bg-emerald-500 text-white"
                  : product.badge === "bestseller"
                  ? "bg-[var(--primary)] text-[var(--foreground)]"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {product.badge}
            </span>
          )}
          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              size={15}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-900">
                {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {CURRENCY_SYMBOL}{(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>
            {product.discountPercent && (
              <span className="text-xs text-red-500 font-semibold">
                Save {product.discountPercent}%
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              addedToCart
                ? "bg-emerald-500 text-white scale-110"
                : "bg-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {addedToCart ? <Check size={14} /> : <ShoppingCart size={14} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Product Card (List) ───────────────────────────────────────────────────────
function ProductCardList({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden flex gap-4 p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      <Link href={`/product/${product.slug}`} className="flex-shrink-0">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 hover:text-[var(--accent)] transition-colors line-clamp-2 mt-0.5">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">{product.description}</p>
        <div className="mt-auto pt-2 flex items-center gap-3 flex-wrap">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {CURRENCY_SYMBOL}{(product.originalPrice).toFixed(2)}
              </span>
            )}
            {product.discountPercent && (
              <span className="text-xs text-red-500 font-semibold ml-1.5">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={(e) => { e.preventDefault(); setWishlisted((v) => !v); }}
              aria-label="Wishlist"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
            >
              <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                addedToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)]"
              }`}
            >
              {addedToCart ? <Check size={12} /> : <ShoppingCart size={12} />}
              {addedToCart ? "Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Filter Panel ──────────────────────────────────────────────────────
function FilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: ActiveFilters;
  onChange: (f: Partial<ActiveFilters>) => void;
  onReset: () => void;
}) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ categories: next });
  };

  const activeCount =
    filters.categories.length +
    (filters.minPrice > 0 || filters.maxPrice < Infinity ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0);

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[var(--accent)]" />
          <span className="font-semibold text-gray-800 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-[var(--primary)] text-[var(--foreground)] rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-[var(--accent)] hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</p>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.categories.includes(cat.slug)
                    ? "bg-[var(--accent)] border-[var(--accent)]"
                    : "border-gray-300 group-hover:border-[var(--accent)]"
                }`}
                onClick={() => toggleCategory(cat.slug)}
              >
                {filters.categories.includes(cat.slug) && <Check size={10} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </span>
              <span className="text-xs text-gray-400 ml-auto">{cat.productCount.toLocaleString("en-US")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Price</p>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const active = filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() =>
                  onChange(
                    active
                      ? { minPrice: 0, maxPrice: Infinity }
                      : { minPrice: range.min, maxPrice: range.max }
                  )
                }
                className={`w-full text-left text-sm px-2 py-1 rounded-lg transition-colors ${
                  active
                    ? "bg-[var(--primary)]/20 text-[var(--accent)] font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Avg. Rating</p>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => onChange({ minRating: filters.minRating === r ? 0 : r })}
              className={`w-full flex items-center gap-2 text-sm px-2 py-1 rounded-lg transition-colors ${
                filters.minRating === r
                  ? "bg-[var(--primary)]/20 text-[var(--accent)] font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    className={s <= r ? "fill-[var(--primary)] text-[var(--primary)]" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        {[
          { key: "inStockOnly" as const, label: "In Stock Only" },
          { key: "onSaleOnly" as const, label: "On Sale" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <div
              className={`w-8 h-4 rounded-full transition-colors relative ${
                filters[key] ? "bg-[var(--accent)]" : "bg-gray-200"
              }`}
              onClick={() => onChange({ [key]: !filters[key] })}
            >
              <div
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                  filters[key] ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const t = useTranslations();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    categories: [],
    minPrice: 0,
    maxPrice: Infinity,
    minRating: 0,
    inStockOnly: false,
    onSaleOnly: false,
  });

  const handleFilterChange = useCallback((partial: Partial<ActiveFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters({
      categories: [],
      minPrice: 0,
      maxPrice: Infinity,
      minRating: 0,
      inStockOnly: false,
      onSaleOnly: false,
    });
    setSearchQuery("");
  }, []);

  const filtered = useMemo(() => {
    let list = [...(products ?? [])];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.categorySlug));
    }

    // Price
    list = list.filter(
      (p) => (p.price ?? 0) >= filters.minPrice && (p.price ?? 0) <= filters.maxPrice
    );

    // Rating
    if (filters.minRating > 0) {
      list = list.filter((p) => (p.rating ?? 0) >= filters.minRating);
    }

    // In stock
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // On sale
    if (filters.onSaleOnly) {
      list = list.filter((p) => !!p.discountPercent);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
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
  }, [filters, sortBy, searchQuery]);

  const activeFilterCount =
    filters.categories.length +
    (filters.minPrice > 0 || filters.maxPrice < Infinity ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Page Header */}
      <Reveal>
        <div className="bg-[var(--accent)] text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-xs text-white/60 mb-2 flex items-center gap-1">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Shop</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-balance">
              All Products
            </h1>
            <p className="text-white/70 mt-1 text-sm">
              Discover {(products ?? []).length.toLocaleString("en-US")}+ products across all categories
            </p>
          </div>
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Toolbar */}
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[var(--accent)] transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <div className="flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent outline-none text-gray-700 cursor-pointer pr-1"
                    aria-label="Sort products"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-[var(--accent)] text-white" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-[var(--accent)] text-white" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Active filter chips */}
        {(filters.categories.length > 0 || filters.minRating > 0 || filters.inStockOnly || filters.onSaleOnly || filters.minPrice > 0 || filters.maxPrice < Infinity) && (
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.categories.map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                return (
                  <span
                    key={slug}
                    className="flex items-center gap-1 text-xs bg-[var(--primary)]/20 text-[var(--accent)] px-2.5 py-1 rounded-full font-medium"
                  >
                    {cat?.name ?? slug}
                    <button onClick={() => handleFilterChange({ categories: filters.categories.filter((c) => c !== slug) })} aria-label={`Remove ${cat?.name} filter`}>
                      <X size={11} />
                    </button>
                  </span>
                );
              })}
              {(filters.minPrice > 0 || filters.maxPrice < Infinity) && (
                <span className="flex items-center gap-1 text-xs bg-[var(--primary)]/20 text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">
                  {filters.maxPrice === Infinity ? `$${filters.minPrice}+` : `$${filters.minPrice} – $${filters.maxPrice}`}
                  <button onClick={() => handleFilterChange({ minPrice: 0, maxPrice: Infinity })} aria-label="Remove price filter">
                    <X size={11} />
                  </button>
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="flex items-center gap-1 text-xs bg-[var(--primary)]/20 text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">
                  {filters.minRating}+ Stars
                  <button onClick={() => handleFilterChange({ minRating: 0 })} aria-label="Remove rating filter">
                    <X size={11} />
                  </button>
                </span>
              )}
              {filters.inStockOnly && (
                <span className="flex items-center gap-1 text-xs bg-[var(--primary)]/20 text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">
                  In Stock
                  <button onClick={() => handleFilterChange({ inStockOnly: false })} aria-label="Remove in stock filter">
                    <X size={11} />
                  </button>
                </span>
              )}
              {filters.onSaleOnly && (
                <span className="flex items-center gap-1 text-xs bg-[var(--primary)]/20 text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">
                  On Sale
                  <button onClick={() => handleFilterChange({ onSaleOnly: false })} aria-label="Remove on sale filter">
                    <X size={11} />
                  </button>
                </span>
              )}
              <button onClick={handleReset} className="text-xs text-gray-500 hover:text-red-500 transition-colors underline">
                Clear all
              </button>
            </div>
          </Reveal>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <Reveal>
              <div className="bg-white rounded-2xl border border-black/5 p-5 sticky top-24 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
                <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
              </div>
            </Reveal>
          </div>

          {/* Product Grid / List */}
          <div className="flex-1 min-w-0">
            <Reveal>
              <p className="text-sm text-gray-500 mb-4">
                Showing <span className="font-semibold text-gray-800">{filtered.length.toLocaleString("en-US")}</span> results
                {searchQuery && (
                  <> for <span className="font-semibold text-gray-800">"{searchQuery}"</span></>
                )}
              </p>
            </Reveal>

            {filtered.length === 0 ? (
              <Reveal>
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-[var(--primary)] text-[var(--foreground)] rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </Reveal>
            ) : viewMode === "grid" ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((product) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <ProductCardGrid product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {filtered.map((product) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <ProductCardList product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 overflow-y-auto p-5 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-gray-800">Filters</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  aria-label="Close filters"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="mt-6 w-full py-3 bg-[var(--accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Show {filtered.length.toLocaleString("en-US")} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}