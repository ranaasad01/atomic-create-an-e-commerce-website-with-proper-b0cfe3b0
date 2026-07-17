"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Heart, ShoppingCart, Check, Filter, ArrowUpDown } from 'lucide-react';
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

interface Filters {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "discount";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "discount", label: "Biggest Discount" },
];

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: Filters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function BadgePill({ badge }: { badge: string }) {
  const map: Record<string, string> = {
    new: "bg-emerald-100 text-emerald-700",
    sale: "bg-red-100 text-red-600",
    bestseller: "bg-amber-100 text-amber-700",
    deal: "bg-[var(--primary)]/20 text-[var(--accent)]",
    "out-of-stock": "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    new: "New",
    sale: "Sale",
    bestseller: "Bestseller",
    deal: "Deal",
    "out-of-stock": "Out of Stock",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${map[badge] ?? "bg-gray-100 text-gray-500"}`}>
      {labels[badge] ?? badge}
    </span>
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

  return (
    <motion.div
      variants={staggerItem}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.div variants={cardHover} className="rounded-2xl bg-white border border-black/5 overflow-hidden flex flex-col h-full">
        <Link href={`/product/${product.slug}`} className="block relative group">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
              }}
            />
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.badge && <BadgePill badge={product.badge} />}
              {product.discountPercent && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <Heart
                size={15}
                className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
        </Link>

        <div className="p-3 flex flex-col flex-1 gap-1.5">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{product.brand}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
              {product.name}
            </h3>
          </Link>
          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="flex items-center gap-2 mt-auto pt-1">
            <span className="text-base font-bold text-[var(--accent)]">
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
            className={`mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--accent)]"
            }`}
          >
            {addedToCart ? (
              <>
                <Check size={14} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  allBrands: string[];
  maxProductPrice: number;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-2 hover:text-[var(--accent)] transition-colors"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSidebar({ filters, onChange, allBrands, maxProductPrice }: FilterSidebarProps) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  return (
    <aside className="w-full">
      <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Filter size={16} className="text-[var(--accent)]" />
            Filters
          </h2>
          <button
            onClick={() => onChange({ ...DEFAULT_FILTERS })}
            className="text-xs text-[var(--accent)] hover:underline font-medium"
          >
            Clear all
          </button>
        </div>

        {/* Categories */}
        <CollapsibleSection title="Category">
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.categories.includes(cat.slug)
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "border-gray-300 group-hover:border-[var(--accent)]"
                  }`}
                  onClick={() => toggleCategory(cat.slug)}
                >
                  {filters.categories.includes(cat.slug) && (
                    <Check size={10} className="text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400">{cat.productCount.toLocaleString("en-US")}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection title="Price Range">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5">
                  <span className="text-xs text-gray-400 mr-1">{CURRENCY_SYMBOL}</span>
                  <input
                    type="number"
                    min={0}
                    max={filters.maxPrice}
                    value={filters.minPrice}
                    onChange={(e) =>
                      onChange({ ...filters, minPrice: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full text-sm outline-none text-gray-800"
                  />
                </div>
              </div>
              <span className="text-gray-300 mt-4">—</span>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1.5">
                  <span className="text-xs text-gray-400 mr-1">{CURRENCY_SYMBOL}</span>
                  <input
                    type="number"
                    min={filters.minPrice}
                    max={maxProductPrice}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      onChange({ ...filters, maxPrice: Math.min(maxProductPrice, Number(e.target.value)) })
                    }
                    className="w-full text-sm outline-none text-gray-800"
                  />
                </div>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={maxProductPrice}
              step={10}
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[var(--accent)]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{CURRENCY_SYMBOL}0</span>
              <span>{CURRENCY_SYMBOL}{maxProductPrice.toLocaleString("en-US")}</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Star Rating */}
        <CollapsibleSection title="Minimum Rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    filters.minRating === r
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "border-gray-300 group-hover:border-[var(--accent)]"
                  }`}
                  onClick={() =>
                    onChange({ ...filters, minRating: filters.minRating === r ? 0 : r })
                  }
                >
                  {filters.minRating === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={11}
                      className={
                        s <= r
                          ? "fill-[var(--primary)] text-[var(--primary)]"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-0.5">& up</span>
                </div>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Brands */}
        <CollapsibleSection title="Brand" defaultOpen={false}>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {allBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    filters.brands.includes(brand)
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "border-gray-300 group-hover:border-[var(--accent)]"
                  }`}
                  onClick={() => toggleBrand(brand)}
                >
                  {filters.brands.includes(brand) && (
                    <Check size={10} className="text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* In Stock */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                filters.inStockOnly
                  ? "bg-[var(--accent)] border-[var(--accent)]"
                  : "border-gray-300 group-hover:border-[var(--accent)]"
              }`}
              onClick={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            >
              {filters.inStockOnly && <Check size={10} className="text-white" />}
            </div>
            <span className="text-sm font-medium text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>
    </aside>
  );
}

// ─── Sort Dropdown ─────────────────────────────────────────────────────────────

function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[var(--accent)] transition-colors shadow-sm"
      >
        <ArrowUpDown size={14} className="text-gray-400" />
        <span>Sort: {current?.label ?? "Featured"}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-100 rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14)] min-w-[200px] overflow-hidden"
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                  value === opt.value
                    ? "text-[var(--accent)] font-semibold bg-[var(--primary)]/10"
                    : "text-gray-700"
                }`}
              >
                {opt.value === value && <Check size={12} className="inline mr-2 text-[var(--accent)]" />}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Active Filter Chips ───────────────────────────────────────────────────────

function ActiveFilterChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const chips: { label: string; onRemove: () => void }[] = [];

  filters.categories.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    chips.push({
      label: cat?.name ?? slug,
      onRemove: () =>
        onChange({ ...filters, categories: filters.categories.filter((c) => c !== slug) }),
    });
  });

  filters.brands.forEach((brand) => {
    chips.push({
      label: brand,
      onRemove: () =>
        onChange({ ...filters, brands: filters.brands.filter((b) => b !== brand) }),
    });
  });

  if (filters.minPrice > 0 || filters.maxPrice < 2000) {
    chips.push({
      label: `${CURRENCY_SYMBOL}${filters.minPrice} – ${CURRENCY_SYMBOL}${filters.maxPrice}`,
      onRemove: () => onChange({ ...filters, minPrice: 0, maxPrice: 2000 }),
    });
  }

  if (filters.minRating > 0) {
    chips.push({
      label: `${filters.minRating}+ Stars`,
      onRemove: () => onChange({ ...filters, minRating: 0 }),
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      label: "In Stock",
      onRemove: () => onChange({ ...filters, inStockOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-gray-500 font-medium">Active:</span>
      {chips.map((chip) => (
        <motion.span
          key={chip.label}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary)]/20 text-[var(--accent)] text-xs font-semibold rounded-full border border-[var(--primary)]/30"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="hover:text-red-500 transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X size={11} />
          </button>
        </motion.span>
      ))}
      <button
        onClick={() => onChange({ ...DEFAULT_FILTERS })}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
      >
        Clear all
      </button>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Prev
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
              page === p
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "border border-gray-200 text-gray-600 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const t = useTranslations();

  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, []);

  const maxProductPrice = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100,
    []
  );

  const handleFiltersChange = useCallback((f: Filters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((s: SortKey) => {
    setSort(s);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.categorySlug));
    }
    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }
    list = list.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    switch (sort) {
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
        list.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case "discount":
        list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      default:
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return list;
  }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.minRating > 0 ||
    filters.inStockOnly;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Page Header */}
      <Reveal>
        <div className="bg-[var(--accent)] text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-xs text-white/60 mb-2 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Shop</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-balance">
              All Products
            </h1>
            <p className="text-white/70 mt-1 text-sm">
              Discover {products.length.toLocaleString("en-US")}+ products across all categories
            </p>
          </div>
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-[var(--accent)] transition-colors shadow-sm"
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
                    {
                      filters.categories.length +
                      filters.brands.length +
                      (filters.minRating > 0 ? 1 : 0) +
                      (filters.inStockOnly ? 1 : 0) +
                      (filters.minPrice > 0 || filters.maxPrice < 2000 ? 1 : 0)
                    }
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filtered.length.toLocaleString("en-US")}</span> results
                {filtered.length !== products.length && (
                  <span className="text-gray-400"> of {products.length.toLocaleString("en-US")}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-[var(--accent)] text-white" : "text-gray-500 hover:text-gray-800"}`}
                  aria-label="Grid view"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="0" width="6" height="6" rx="1" />
                    <rect x="8" y="0" width="6" height="6" rx="1" />
                    <rect x="0" y="8" width="6" height="6" rx="1" />
                    <rect x="8" y="8" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 transition-colors ${viewMode === "list" ? "bg-[var(--accent)] text-white" : "text-gray-500 hover:text-gray-800"}`}
                  aria-label="List view"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="0" y="0" width="14" height="3" rx="1" />
                    <rect x="0" y="5.5" width="14" height="3" rx="1" />
                    <rect x="0" y="11" width="14" height="3" rx="1" />
                  </svg>
                </button>
              </div>

              <SortDropdown value={sort} onChange={handleSortChange} />
            </div>
          </div>
        </Reveal>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <ActiveFilterChips filters={filters} onChange={handleFiltersChange} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onChange={handleFiltersChange}
                allBrands={allBrands}
                maxProductPrice={maxProductPrice}
              />
            </div>
          </div>

          {/* Mobile Sidebar Drawer */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-[var(--background)] z-50 overflow-y-auto p-4 shadow-2xl lg:hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-base">Filters</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <FilterSidebar
                    filters={filters}
                    onChange={(f) => {
                      handleFiltersChange(f);
                    }}
                    allBrands={allBrands}
                    maxProductPrice={maxProductPrice}
                  />
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="mt-4 w-full py-3 bg-[var(--accent)] text-white rounded-xl font-semibold text-sm"
                  >
                    Show {filtered.length.toLocaleString("en-US")} Results
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid / List */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Search size={48} className="text-gray-200 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No products found</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Try adjusting your filters or search for something else.
                  </p>
                  <button
                    onClick={() => handleFiltersChange({ ...DEFAULT_FILTERS })}
                    className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Clear Filters
                  </button>
                </div>
              </Reveal>
            ) : viewMode === "grid" ? (
              <motion.div
                key={`grid-${page}-${sort}-${JSON.stringify(filters)}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${page}-${sort}-${JSON.stringify(filters)}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {paginated.map((product) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <Link href={`/product/${product.slug}`}>
                      <div className="bg-white rounded-2xl border border-black/5 p-4 flex gap-4 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] transition-shadow group">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">{product.brand}</p>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <StarRating rating={product.rating} count={product.reviewCount} />
                            {product.badge && <BadgePill badge={product.badge} />}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between flex-shrink-0">
                          <div className="text-right">
                            <p className="text-base font-bold text-[var(--accent)]">
                              {CURRENCY_SYMBOL}{product.price.toFixed(2)}
                            </p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <span className={`text-xs font-medium ${product.inStock ? "text-emerald-600" : "text-red-400"}`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <Reveal>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </Reveal>

            {/* Results summary */}
            {filtered.length > 0 && (
              <Reveal delay={0.1}>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Showing {((page - 1) * PAGE_SIZE + 1).toLocaleString("en-US")}–{Math.min(page * PAGE_SIZE, filtered.length).toLocaleString("en-US")} of {filtered.length.toLocaleString("en-US")} products
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}