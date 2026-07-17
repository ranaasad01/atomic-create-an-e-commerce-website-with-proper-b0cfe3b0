"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Star, ShoppingCart, Heart, ChevronDown, Filter, ArrowUpDown, Package } from 'lucide-react';
import { products, categories, formatPrice, CURRENCY_SYMBOL, type Product } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

interface Filters {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
];

const RATING_OPTIONS = [
  { value: 4, label: "4★ & Up" },
  { value: 3, label: "3★ & Up" },
  { value: 2, label: "2★ & Up" },
];

const CATEGORY_NAMES = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"];

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

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="rounded-xl bg-white border border-[var(--border)] overflow-hidden flex flex-col h-full shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow duration-200 group">
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                `https://placehold.co/400x400/F3F3F3/131921?text=${encodeURIComponent(product.name.slice(0, 12))}`;
            }}
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge === "new" && (
            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={14}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wide mb-0.5">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug mb-1 line-clamp-2 hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base font-bold text-[var(--foreground)]">
              {CURRENCY_SYMBOL}{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)]"
            }`}
          >
            <ShoppingCart size={13} />
            {addedToCart ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}

function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-base text-[var(--foreground)]">Filters</h2>
        <button
          onClick={onClear}
          className="text-xs text-[var(--primary)] hover:underline font-semibold"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Category</h3>
        <div className="space-y-1.5">
          {CATEGORY_NAMES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
              />
              <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 mb-0.5 block">Min</label>
            <input
              type="number"
              min={0}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })}
              className="w-full border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <span className="text-gray-400 mt-4">–</span>
          <div className="flex-1">
            <label className="text-[10px] text-gray-500 mb-0.5 block">Max</label>
            <input
              type="number"
              min={filters.minPrice}
              max={9999}
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2">Customer Rating</h3>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === opt.value}
                onChange={() => onChange({ ...filters, minRating: opt.value })}
                className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
              />
              <span className="text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
          {filters.minRating > 0 && (
            <button
              onClick={() => onChange({ ...filters, minRating: 0 })}
              className="text-xs text-gray-400 hover:text-[var(--primary)] transition-colors"
            >
              Clear rating filter
            </button>
          )}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border)] accent-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm font-semibold text-[var(--foreground)]">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-6">
        <Package size={36} className="text-[var(--primary)]" />
      </div>
      <h2 className="font-display font-bold text-2xl text-[var(--foreground)] mb-2">
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-[var(--muted)] text-sm max-w-sm mb-6">
        Try different keywords, check your spelling, or browse one of our popular categories below.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"].map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
            className="px-4 py-2 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors bg-white"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.min(5, total);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
            p === page
              ? "bg-[var(--primary)] text-[var(--foreground)]"
              : "bg-white border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// ─── Inner Page (uses useSearchParams) ───────────────────────────────────────

const PAGE_SIZE = 12;

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync input when URL param changes
  useEffect(() => {
    setInputValue(initialQuery);
    setPage(1);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(inputValue.trim())}`;
    }
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  // Filter products
  const filtered = useMemo(() => {
    const q = initialQuery.toLowerCase().trim();
    let result = products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.description} ${p.category} ${p.brand} ${p.tags.join(" ")}`
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result = [...result].filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
        break;
      default:
        break;
    }

    return result;
  }, [initialQuery, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const activeFilterCount =
    filters.categories.length +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 2000 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Search Header */}
      <div className="bg-[var(--accent)] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="flex rounded-lg overflow-hidden border-2 border-[var(--primary)] shadow-lg">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="flex-1 px-4 py-3 text-[var(--foreground)] bg-white outline-none text-sm"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-5 py-3 transition-colors flex items-center gap-2"
                aria-label="Search"
              >
                <Search size={18} className="text-[var(--foreground)]" />
                <span className="text-sm font-semibold text-[var(--foreground)] hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          {initialQuery && (
            <div className="mt-4 text-center">
              <p className="text-white/80 text-sm">
                {filtered.length > 0 ? (
                  <>
                    <span className="text-white font-semibold">{filtered.length.toLocaleString("en-US")}</span>
                    {" results for "}
                    <span className="text-[var(--primary)] font-semibold">&ldquo;{initialQuery}&rdquo;</span>
                  </>
                ) : (
                  <>
                    No results for{" "}
                    <span className="text-[var(--primary)] font-semibold">&ldquo;{initialQuery}&rdquo;</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-white text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
            >
              <Filter size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-sm text-[var(--muted)] hidden sm:block">
              {filtered.length.toLocaleString("en-US")} products
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={15} className="text-[var(--muted)]" />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
              className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-[var(--border)] p-5 shadow-[var(--shadow-card)] sticky top-24">
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <EmptyState query={initialQuery || "your search"} />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paginated.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination page={page} total={totalPages} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="font-display font-bold text-lg text-[var(--foreground)]">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                onClear={handleClearFilters}
              />
            </div>
            <div className="p-4 border-t border-[var(--border)]">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold text-sm transition-colors"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page Export (wrapped in Suspense for useSearchParams) ────────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--muted)] text-sm">Loading search results…</p>
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
