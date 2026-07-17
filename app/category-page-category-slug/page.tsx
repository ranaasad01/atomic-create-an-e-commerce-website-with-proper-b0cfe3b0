"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X, Star, Heart, ShoppingCart, Grid, List, ChevronRight, Search, ArrowUpDown } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  categories,
  products,
  formatPrice,
  type Product,
  type Category,
} from "@/lib/data";
import { staggerContainer, staggerItem, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";
type ViewMode = "grid" | "list";

interface FilterState {
  priceMin: string;
  priceMax: string;
  rating: number;
  inStock: boolean;
  brands: string[];
  badges: string[];
}

// ─── Static slug → category map ──────────────────────────────────────────────

const SLUG_MAP: Record<string, string> = {
  electronics: "electronics",
  fashion: "fashion",
  "home-kitchen": "home-kitchen",
  books: "books",
  sports: "sports",
};

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
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
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

// ─── Product Card (Grid) ──────────────────────────────────────────────────────

function ProductCardGrid({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="group bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span
              className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                product.badge === "sale"
                  ? "bg-red-500 text-white"
                  : product.badge === "new"
                  ? "bg-emerald-500 text-white"
                  : product.badge === "bestseller"
                  ? "bg-[var(--primary)] text-[var(--foreground)]"
                  : product.badge === "deal"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((w) => !w);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]/60 mb-0.5">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discountPercent && (
              <span className="text-xs font-semibold text-red-500 ml-1">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              addedToCart
                ? "bg-emerald-500 text-white scale-110"
                : product.inStock
                ? "bg-[var(--primary)] text-[var(--foreground)] hover:scale-110"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Add to cart"
          >
            {addedToCart ? <Star size={14} className="fill-white" /> : <ShoppingCart size={14} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Product Card (List) ──────────────────────────────────────────────────────

function ProductCardList({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="group bg-white rounded-2xl border border-black/5 overflow-hidden flex gap-4 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
    >
      <Link href={`/product/${product.slug}`} className="relative flex-shrink-0">
        <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {product.badge && (
          <span
            className={`absolute top-1 left-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
              product.badge === "sale"
                ? "bg-red-500 text-white"
                : product.badge === "new"
                ? "bg-emerald-500 text-white"
                : "bg-[var(--primary)] text-[var(--foreground)]"
            }`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]/60 mb-0.5">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug hover:text-[var(--accent)] transition-colors mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-auto pt-2 flex items-center gap-3">
          <div>
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discountPercent && (
              <span className="text-xs font-semibold text-red-500 ml-1">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setWishlisted((w) => !w)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                size={14}
                className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
            <button
              onClick={() => {
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 1800);
              }}
              disabled={!product.inStock}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                addedToCart
                  ? "bg-emerald-500 text-white"
                  : product.inStock
                  ? "bg-[var(--primary)] text-[var(--foreground)] hover:opacity-90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {addedToCart ? "Added!" : product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
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
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  brands: string[];
  onClose?: () => void;
}) {
  const toggleBrand = (brand: string) => {
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand)
        ? f.brands.filter((b) => b !== brand)
        : [...f.brands, brand],
    }));
  };

  const toggleBadge = (badge: string) => {
    setFilters((f) => ({
      ...f,
      badges: f.badges.includes(badge)
        ? f.badges.filter((b) => b !== badge)
        : [...f.badges, badge],
    }));
  };

  const clearAll = () => {
    setFilters({ priceMin: "", priceMax: "", rating: 0, inStock: false, brands: [], badges: [] });
  };

  const hasActive =
    filters.priceMin ||
    filters.priceMax ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.brands.length > 0 ||
    filters.badges.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-sm">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActive && (
            <button
              onClick={clearAll}
              className="text-xs text-[var(--accent)] hover:underline font-medium"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 lg:hidden">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Price Range
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Minimum Rating
        </p>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, rating: f.rating === r ? 0 : r }))}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                filters.rating === r
                  ? "bg-[var(--primary)]/20 text-[var(--foreground)]"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={
                      s <= r
                        ? "fill-[var(--primary)] text-[var(--primary)]"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-xs">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked }))}
            className="w-4 h-4 accent-[var(--accent)] rounded"
          />
          <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Brand
          </p>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 accent-[var(--accent)] rounded"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Deals & Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {["sale", "new", "bestseller", "deal"].map((badge) => (
            <button
              key={badge}
              onClick={() => toggleBadge(badge)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                filters.badges.includes(badge)
                  ? "bg-[var(--accent)] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const t = useTranslations();

  // Derive slug from pathname safely (no window during render)
  // We'll show all categories as a browsable page; the slug is embedded in the URL
  // but since this is a static route file, we show a full category browser.
  // For the actual dynamic route, this component receives no params here,
  // so we default to showing all products with category filtering.

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>({
    priceMin: "",
    priceMax: "",
    rating: 0,
    inStock: false,
    brands: [],
    badges: [],
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const currentCategory: Category | undefined = categories.find(
    (c) => c.slug === selectedCategory
  );

  // Unique brands from products
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (selectedCategory === "all" || p.categorySlug === selectedCategory) {
        set.add(p.brand);
      }
    });
    return Array.from(set).sort();
  }, [selectedCategory]);

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.priceMin !== "") {
      const min = parseFloat(filters.priceMin);
      if (!isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (filters.priceMax !== "") {
      const max = parseFloat(filters.priceMax);
      if (!isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (filters.rating > 0) {
      list = list.filter((p) => p.rating >= filters.rating);
    }
    if (filters.inStock) {
      list = list.filter((p) => p.inStock);
    }
    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.badges.length > 0) {
      list = list.filter((p) => p.badge && filters.badges.includes(p.badge));
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  }, [selectedCategory, searchQuery, filters, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    setFilters({ priceMin: "", priceMax: "", rating: 0, inStock: false, brands: [], badges: [] });
  };

  const handleSortChange = (val: SortOption) => {
    setSortBy(val);
    setPage(1);
  };

  const activeFilterCount =
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    filters.brands.length +
    filters.badges.length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ── Category Hero Banner ── */}
      <Reveal>
        <section className="bg-[var(--accent)] text-white">
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-white font-medium">
                {currentCategory ? currentCategory.name : "All Categories"}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-2">
                  {currentCategory ? currentCategory.name : "Shop All Categories"}
                </h1>
                <p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed">
                  {currentCategory
                    ? currentCategory.description
                    : "Browse our full catalog across Electronics, Fashion, Home & Kitchen, Books, and Sports."}
                </p>
                <p className="text-[var(--primary)] font-semibold text-sm mt-2">
                  {filteredProducts.length.toLocaleString("en-US")} products found
                </p>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === "all"
                      ? "bg-[var(--primary)] text-[var(--foreground)]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-[var(--primary)] text-[var(--foreground)]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Category Cards (when "all" selected) ── */}
      {selectedCategory === "all" && (
        <Reveal>
          <section className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_-4px_rgba(0,0,0,0.10)] border border-black/5"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-sm leading-tight">{cat.name}</p>
                    <p className="text-white/70 text-[10px]">
                      {cat.productCount.toLocaleString("en-US")} items
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                setFilters={(val) => {
                  setFilters(val);
                  setPage(1);
                }}
                brands={allBrands}
              />
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[var(--accent)] transition-colors bg-white"
                  />
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[var(--accent)] transition-colors bg-white text-gray-700 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                {/* View toggle */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-[var(--accent)] text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-[var(--accent)] text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    aria-label="List view"
                  >
                    <List size={14} />
                  </button>
                </div>

                <p className="text-xs text-gray-500 ml-auto hidden sm:block">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {Math.min((page - 1) * PER_PAGE + 1, filteredProducts.length)}–
                    {Math.min(page * PER_PAGE, filteredProducts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {filteredProducts.length.toLocaleString("en-US")}
                  </span>
                </p>
              </div>
            </Reveal>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <Reveal>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.priceMin && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/20 text-[var(--foreground)] text-xs rounded-full font-medium">
                      Min ${filters.priceMin}
                      <button
                        onClick={() => setFilters((f) => ({ ...f, priceMin: "" }))}
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filters.priceMax && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/20 text-[var(--foreground)] text-xs rounded-full font-medium">
                      Max ${filters.priceMax}
                      <button
                        onClick={() => setFilters((f) => ({ ...f, priceMax: "" }))}
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filters.rating > 0 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/20 text-[var(--foreground)] text-xs rounded-full font-medium">
                      {filters.rating}+ Stars
                      <button
                        onClick={() => setFilters((f) => ({ ...f, rating: 0 }))}
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/20 text-[var(--foreground)] text-xs rounded-full font-medium">
                      In Stock
                      <button
                        onClick={() => setFilters((f) => ({ ...f, inStock: false }))}
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {filters.brands.map((b) => (
                    <span
                      key={b}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/20 text-[var(--foreground)] text-xs rounded-full font-medium"
                    >
                      {b}
                      <button
                        onClick={() =>
                          setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) }))
                        }
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {filters.badges.map((b) => (
                    <span
                      key={b}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/20 text-[var(--foreground)] text-xs rounded-full font-medium capitalize"
                    >
                      {b}
                      <button
                        onClick={() =>
                          setFilters((f) => ({ ...f, badges: f.badges.filter((x) => x !== b) }))
                        }
                        className="hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Products */}
            {paginatedProducts.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Try adjusting your filters or search query to find what you are looking for.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        priceMin: "",
                        priceMax: "",
                        rating: 0,
                        inStock: false,
                        brands: [],
                        badges: [],
                      });
                      setSearchQuery("");
                    }}
                    className="mt-4 px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Clear Filters
                  </button>
                </div>
              </Reveal>
            ) : (
              <motion.div
                key={`${selectedCategory}-${sortBy}-${page}-${viewMode}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "flex flex-col gap-3"
                }
              >
                {paginatedProducts.map((product) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    {viewMode === "grid" ? (
                      <ProductCardGrid product={product} />
                    ) : (
                      <ProductCardList product={product} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Reveal>
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (page <= 4) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                            page === pageNum
                              ? "bg-[var(--accent)] text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
                  >
                    Next
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 overflow-y-auto bg-[var(--background)] p-4 lg:hidden shadow-2xl"
            >
              <FilterSidebar
                filters={filters}
                setFilters={(val) => {
                  setFilters(val);
                  setPage(1);
                }}
                brands={allBrands}
                onClose={() => setFilterOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}