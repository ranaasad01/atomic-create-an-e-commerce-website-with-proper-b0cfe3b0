"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Filter, ChevronDown, X, Check, Search, SlidersHorizontal, Zap, Shield, Truck, ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, staggerItem, cardHover } from "@/lib/motion";

// ─── Inline mock data ────────────────────────────────────────────────────────

interface ElectronicsProduct {
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
  features: string[];
}

const electronicsProducts: ElectronicsProduct[] = [
  {
    id: "e001",
    slug: "sony-wh1000xm5-headphones",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    price: 279.99,
    originalPrice: 399.99,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 3241,
    image: "/images/sony-wh1000xm5-headphones.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Audio",
    tags: ["wireless", "noise-canceling", "headphones"],
    features: ["30hr battery", "Multipoint connect", "LDAC"],
  },
  {
    id: "e002",
    slug: "apple-macbook-pro-14",
    name: "Apple MacBook Pro 14-inch M3 Pro Chip",
    brand: "Apple",
    price: 1999.0,
    originalPrice: 2199.0,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 1872,
    image: "/images/apple-macbook-pro-14-laptop.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Laptops",
    tags: ["laptop", "apple", "m3"],
    features: ["M3 Pro chip", "18GB RAM", "512GB SSD"],
  },
  {
    id: "e003",
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    price: 1199.99,
    originalPrice: 1299.99,
    discountPercent: 8,
    rating: 4.7,
    reviewCount: 2105,
    image: "/images/samsung-galaxy-s24-ultra-smartphone.jpg",
    badge: "new",
    inStock: true,
    subcategory: "Smartphones",
    tags: ["smartphone", "android", "samsung"],
    features: ["200MP camera", "S Pen", "5000mAh"],
  },
  {
    id: "e004",
    slug: "lg-oled-c3-55-tv",
    name: "LG OLED C3 55-inch 4K Smart TV",
    brand: "LG",
    price: 1296.99,
    originalPrice: 1799.99,
    discountPercent: 28,
    rating: 4.8,
    reviewCount: 987,
    image: "/images/lg-oled-c3-55-smart-tv.jpg",
    badge: "deal",
    inStock: true,
    subcategory: "TVs",
    tags: ["tv", "oled", "4k", "smart-tv"],
    features: ["OLED evo", "120Hz", "Dolby Vision"],
  },
  {
    id: "e005",
    slug: "ipad-pro-12-m4",
    name: "Apple iPad Pro 12.9-inch M4 Wi-Fi 256GB",
    brand: "Apple",
    price: 1099.0,
    originalPrice: 1299.0,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 654,
    image: "/images/apple-ipad-pro-12-tablet.jpg",
    badge: "new",
    inStock: true,
    subcategory: "Tablets",
    tags: ["tablet", "apple", "ipad"],
    features: ["M4 chip", "Ultra Retina XDR", "Apple Pencil Pro"],
  },
  {
    id: "e006",
    slug: "bose-quietcomfort-45",
    name: "Bose QuietComfort 45 Bluetooth Headphones",
    brand: "Bose",
    price: 229.0,
    originalPrice: 329.0,
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 2890,
    image: "https://m.media-amazon.com/images/I/51HHABMPoVL._AC_UF894,1000_QL80_.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Audio",
    tags: ["headphones", "bluetooth", "bose"],
    features: ["24hr battery", "Aware mode", "USB-C"],
  },
  {
    id: "e007",
    slug: "dell-xps-15-laptop",
    name: "Dell XPS 15 OLED Intel Core i9 Laptop",
    brand: "Dell",
    price: 1849.99,
    originalPrice: 2199.99,
    discountPercent: 16,
    rating: 4.6,
    reviewCount: 743,
    image: "/images/dell-xps-15-oled-laptop.jpg",
    inStock: true,
    subcategory: "Laptops",
    tags: ["laptop", "dell", "oled"],
    features: ["Core i9", "32GB RAM", "OLED display"],
  },
  {
    id: "e008",
    slug: "sony-a7-iv-camera",
    name: "Sony Alpha A7 IV Full-Frame Mirrorless Camera",
    brand: "Sony",
    price: 2498.0,
    originalPrice: 2799.0,
    discountPercent: 11,
    rating: 4.9,
    reviewCount: 412,
    image: "/images/sony-alpha-a7-iv-mirrorless-camera.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Cameras",
    tags: ["camera", "mirrorless", "sony"],
    features: ["33MP sensor", "4K 60fps", "Real-time AF"],
  },
  {
    id: "e009",
    slug: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro 128GB Unlocked",
    brand: "Google",
    price: 799.0,
    originalPrice: 999.0,
    discountPercent: 20,
    rating: 4.7,
    reviewCount: 1543,
    image: "/images/google-pixel-8-pro-smartphone.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Smartphones",
    tags: ["smartphone", "google", "android"],
    features: ["Tensor G3", "50MP camera", "7yr updates"],
  },
  {
    id: "e010",
    slug: "amazon-echo-show-10",
    name: "Amazon Echo Show 10 Smart Display",
    brand: "Amazon",
    price: 199.99,
    originalPrice: 249.99,
    discountPercent: 20,
    rating: 4.5,
    reviewCount: 3102,
    image: "/images/amazon-echo-show-10-smart-display.jpg",
    inStock: true,
    subcategory: "Smart Home",
    tags: ["smart-home", "alexa", "display"],
    features: ["10.1\" HD display", "Motion tracking", "Alexa"],
  },
  {
    id: "e011",
    slug: "nintendo-switch-oled",
    name: "Nintendo Switch OLED Model White",
    brand: "Nintendo",
    price: 349.99,
    rating: 4.8,
    reviewCount: 5621,
    image: "/images/nintendo-switch-oled-gaming-console.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Gaming",
    tags: ["gaming", "nintendo", "console"],
    features: ["7\" OLED screen", "64GB storage", "LAN port"],
  },
  {
    id: "e012",
    slug: "anker-powerbank-26800",
    name: "Anker PowerCore 26800mAh Portable Charger",
    brand: "Anker",
    price: 59.99,
    originalPrice: 79.99,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 8934,
    image: "/images/anker-powercore-26800-portable-charger.jpg",
    inStock: true,
    subcategory: "Accessories",
    tags: ["charger", "portable", "anker"],
    features: ["26800mAh", "Dual USB-C", "Fast charge"],
  },
];

const subcategories = [
  "All",
  "Smartphones",
  "Laptops",
  "Audio",
  "TVs",
  "Tablets",
  "Cameras",
  "Gaming",
  "Smart Home",
  "Accessories",
];

const brands = ["All Brands", "Apple", "Sony", "Samsung", "LG", "Dell", "Bose", "Google", "Amazon", "Nintendo", "Anker"];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "discount", label: "Biggest Discount" },
];

const priceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $500", min: 100, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "$1,000 – $2,000", min: 1000, max: 2000 },
  { label: "Over $2,000", min: 2000, max: Infinity },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function BadgePill({ badge }: { badge?: string }) {
  if (!badge) return null;
  const styles: Record<string, string> = {
    new: "bg-blue-500 text-white",
    sale: "bg-red-500 text-white",
    bestseller: "bg-amber-500 text-white",
    deal: "bg-green-600 text-white",
  };
  const labels: Record<string, string> = {
    new: "New",
    sale: "Sale",
    bestseller: "Bestseller",
    deal: "Deal",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[badge] ?? "bg-gray-400 text-white"}`}>
      {labels[badge] ?? badge}
    </span>
  );
}

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

interface ProductCardProps {
  product: ElectronicsProduct;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: ElectronicsProduct) => void;
}

function ProductCard({ product, wishlist, onToggleWishlist, onAddToCart }: ProductCardProps) {
  const isWishlisted = wishlist.has(product.id);
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col group cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <BadgePill badge={product.badge} />
          </div>
        )}
        {/* Discount */}
        {product.discountPercent && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discountPercent}%
          </div>
        )}
        {/* Wishlist */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-xs text-[var(--accent)]/60 font-medium uppercase tracking-wide">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Features */}
        <div className="flex flex-wrap gap-1 mt-1">
          {(product.features ?? []).slice(0, 2).map((f) => (
            <span key={f} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900">
            {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onAddToCart(product)}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ElectronicsPage() {
  const t = useTranslations();

  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cartNotification, setCartNotification] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (product: ElectronicsProduct) => {
    setCartNotification(product.name);
    setTimeout(() => setCartNotification(null), 2500);
  };

  const filteredProducts = useMemo(() => {
    let list = [...electronicsProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          (p.tags ?? []).some((tag) => tag.includes(q))
      );
    }

    if (selectedSubcategory !== "All") {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (selectedBrand !== "All Brands") {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      if (range) {
        list = list.filter((p) => p.price >= range.min && p.price < range.max);
      }
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
      case "reviews":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "discount":
        list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [searchQuery, selectedSubcategory, selectedBrand, selectedPriceRange, sortBy]);

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.label ?? "Featured";

  const clearFilters = () => {
    setSelectedSubcategory("All");
    setSelectedBrand("All Brands");
    setSelectedPriceRange(null);
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedSubcategory !== "All" ||
    selectedBrand !== "All Brands" ||
    selectedPriceRange !== null ||
    searchQuery.trim() !== "";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <Reveal>
        <section className="relative bg-[var(--accent)] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--primary)] blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--primary)] blur-2xl -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-[var(--primary)]" />
                <span className="text-[var(--primary)] text-sm font-semibold uppercase tracking-widest">
                  Electronics
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight tracking-tight text-balance mb-4">
                Next-Gen Tech,<br />
                <span className="text-[var(--primary)]">Unbeatable Prices</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg mb-6">
                Explore 248+ products across smartphones, laptops, audio, cameras, gaming, and smart home. Top brands, real savings.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Truck, text: "Free shipping over $49" },
                  { icon: Shield, text: "2-year warranty" },
                  { icon: Check, text: "Genuine products" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-white/80">
                    <Icon size={14} className="text-[var(--primary)]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { label: "Products", value: "248+" },
                { label: "Brands", value: "50+" },
                { label: "Avg. Savings", value: "22%" },
                { label: "Reviews", value: "40K+" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[var(--primary)]">{value}</p>
                  <p className="text-xs text-white/70 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Subcategory Pills ── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100 sticky top-[64px] z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
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
        </div>
      </Reveal>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar Filters (desktop) ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-5 sticky top-32">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[var(--accent)] hover:underline font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search within category */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search electronics..."
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Brand
                </label>
                <div className="space-y-1.5">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedBrand === brand
                          ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {brand}
                      {selectedBrand === brand && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Price Range
                </label>
                <div className="space-y-1.5">
                  {priceRanges.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setSelectedPriceRange(selectedPriceRange === idx ? null : idx)
                      }
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedPriceRange === idx
                          ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {range.label}
                      {selectedPriceRange === idx && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  results
                  {selectedSubcategory !== "All" && (
                    <span className="text-[var(--accent)]"> in {selectedSubcategory}</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter size={15} />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  )}
                </button>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sort: {activeSortLabel}
                    <ChevronDown size={14} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-black/5 shadow-lg z-20 overflow-hidden"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                              sortBy === opt.value
                                ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                            {sortBy === opt.value && <Check size={13} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSubcategory !== "All" && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                    {selectedSubcategory}
                    <button onClick={() => setSelectedSubcategory("All")} aria-label="Remove subcategory filter">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedBrand !== "All Brands" && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand("All Brands")} aria-label="Remove brand filter">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedPriceRange !== null && priceRanges[selectedPriceRange] && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                    {priceRanges[selectedPriceRange]?.label}
                    <button onClick={() => setSelectedPriceRange(null)} aria-label="Remove price filter">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} aria-label="Remove search filter">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search query.</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--accent)]/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filteredProducts.map((product, i) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <ProductCard
                      product={product}
                      wishlist={wishlist}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load more CTA */}
            {filteredProducts.length > 0 && (
              <Reveal delay={0.1}>
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-500">
                    Showing {filteredProducts.length} of 248 products
                  </p>
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 px-6 py-3 border-2 border-[var(--accent)] text-[var(--accent)] font-semibold rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
                  >
                    View All Electronics
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search electronics..."
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                </div>

                {/* Subcategory */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Category
                  </label>
                  <div className="space-y-1">
                    {subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedSubcategory === sub
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {sub}
                        {selectedSubcategory === sub && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Brand
                  </label>
                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedBrand === brand
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {brand}
                        {selectedBrand === brand && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Price Range
                  </label>
                  <div className="space-y-1">
                    {priceRanges.map((range, idx) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          setSelectedPriceRange(selectedPriceRange === idx ? null : idx)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPriceRange === idx
                            ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {range.label}
                        {selectedPriceRange === idx && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--accent)]/90 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Cart notification toast ── */}
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm text-sm"
          >
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Check size={13} />
            </div>
            <span className="line-clamp-1">
              <span className="font-semibold">Added to cart:</span> {cartNotification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}