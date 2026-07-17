"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Star, Heart, ShoppingCart, SlidersHorizontal, X, Check, ArrowUpDown, Tag, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { staggerContainer, staggerItem, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

interface FashionProduct {
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
  badge?: "new" | "sale" | "bestseller" | "limited";
  colors: string[];
  sizes: string[];
  subCategory: string;
  gender: "men" | "women" | "unisex" | "kids";
  inStock: boolean;
  tags: string[];
}

const fashionProducts: FashionProduct[] = [
  {
    id: "f001",
    slug: "classic-white-linen-shirt",
    name: "Classic White Linen Shirt",
    brand: "Everlane",
    price: 68,
    originalPrice: 95,
    discountPercent: 28,
    rating: 4.7,
    reviewCount: 312,
    image: "/images/classic-white-linen-shirt.jpg",
    badge: "sale",
    colors: ["White", "Beige", "Sky Blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
    subCategory: "Tops",
    gender: "women",
    inStock: true,
    tags: ["linen", "casual", "summer"],
  },
  {
    id: "f002",
    slug: "slim-fit-chino-pants",
    name: "Slim Fit Chino Pants",
    brand: "Bonobos",
    price: 89,
    originalPrice: 120,
    discountPercent: 26,
    rating: 4.5,
    reviewCount: 198,
    image: "/images/slim-fit-chino-pants-men.jpg",
    badge: "sale",
    colors: ["Khaki", "Navy", "Olive"],
    sizes: ["28", "30", "32", "34", "36"],
    subCategory: "Bottoms",
    gender: "men",
    inStock: true,
    tags: ["chino", "office", "casual"],
  },
  {
    id: "f003",
    slug: "floral-wrap-midi-dress",
    name: "Floral Wrap Midi Dress",
    brand: "Reformation",
    price: 148,
    rating: 4.8,
    reviewCount: 427,
    image: "/images/floral-wrap-midi-dress.jpg",
    badge: "bestseller",
    colors: ["Floral Pink", "Floral Blue"],
    sizes: ["XS", "S", "M", "L"],
    subCategory: "Dresses",
    gender: "women",
    inStock: true,
    tags: ["dress", "floral", "summer", "midi"],
  },
  {
    id: "f004",
    slug: "leather-chelsea-boots",
    name: "Leather Chelsea Boots",
    brand: "Thursday Boot Co.",
    price: 199,
    originalPrice: 249,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 654,
    image: "/images/leather-chelsea-boots-brown.jpg",
    badge: "bestseller",
    colors: ["Brown", "Black"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    subCategory: "Shoes",
    gender: "men",
    inStock: true,
    tags: ["boots", "leather", "chelsea"],
  },
  {
    id: "f005",
    slug: "oversized-graphic-tee",
    name: "Oversized Graphic Tee",
    brand: "Urban Outfitters",
    price: 38,
    rating: 4.3,
    reviewCount: 89,
    image: "/images/oversized-graphic-tee-streetwear.jpg",
    badge: "new",
    colors: ["Black", "White", "Washed Grey"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    subCategory: "Tops",
    gender: "unisex",
    inStock: true,
    tags: ["graphic", "streetwear", "casual"],
  },
  {
    id: "f006",
    slug: "high-waist-yoga-leggings",
    name: "High-Waist Yoga Leggings",
    brand: "Lululemon",
    price: 118,
    rating: 4.9,
    reviewCount: 1203,
    image: "/images/high-waist-yoga-leggings-black.jpg",
    badge: "bestseller",
    colors: ["Black", "Midnight Navy", "Heather Grey"],
    sizes: ["XS", "S", "M", "L", "XL"],
    subCategory: "Activewear",
    gender: "women",
    inStock: true,
    tags: ["yoga", "activewear", "leggings"],
  },
  {
    id: "f007",
    slug: "wool-blend-overcoat",
    name: "Wool Blend Overcoat",
    brand: "COS",
    price: 295,
    originalPrice: 395,
    discountPercent: 25,
    rating: 4.6,
    reviewCount: 143,
    image: "/images/wool-blend-overcoat-camel.jpg",
    badge: "sale",
    colors: ["Camel", "Charcoal", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    subCategory: "Outerwear",
    gender: "women",
    inStock: true,
    tags: ["coat", "wool", "winter", "outerwear"],
  },
  {
    id: "f008",
    slug: "canvas-sneakers-low-top",
    name: "Canvas Low-Top Sneakers",
    brand: "Converse",
    price: 65,
    rating: 4.7,
    reviewCount: 2341,
    image: "/images/canvas-low-top-sneakers-white.jpg",
    badge: "bestseller",
    colors: ["White", "Black", "Red"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    subCategory: "Shoes",
    gender: "unisex",
    inStock: true,
    tags: ["sneakers", "canvas", "casual"],
  },
  {
    id: "f009",
    slug: "kids-denim-jacket",
    name: "Kids Classic Denim Jacket",
    brand: "Gap Kids",
    price: 49,
    originalPrice: 69,
    discountPercent: 29,
    rating: 4.4,
    reviewCount: 76,
    image: "/images/kids-classic-denim-jacket-blue.jpg",
    badge: "sale",
    colors: ["Light Blue", "Dark Blue"],
    sizes: ["4T", "5T", "6", "7", "8", "10"],
    subCategory: "Kids",
    gender: "kids",
    inStock: true,
    tags: ["kids", "denim", "jacket"],
  },
  {
    id: "f010",
    slug: "silk-slip-dress",
    name: "Silk Slip Dress",
    brand: "Vince",
    price: 225,
    rating: 4.8,
    reviewCount: 188,
    image: "/images/silk-slip-dress-champagne.jpg",
    badge: "new",
    colors: ["Champagne", "Black", "Dusty Rose"],
    sizes: ["XS", "S", "M", "L"],
    subCategory: "Dresses",
    gender: "women",
    inStock: true,
    tags: ["silk", "dress", "evening", "luxury"],
  },
  {
    id: "f011",
    slug: "mens-bomber-jacket",
    name: "Satin Bomber Jacket",
    brand: "Alpha Industries",
    price: 155,
    originalPrice: 195,
    discountPercent: 21,
    rating: 4.6,
    reviewCount: 234,
    image: "/images/satin-bomber-jacket-black-men.jpg",
    badge: "sale",
    colors: ["Black", "Olive", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    subCategory: "Outerwear",
    gender: "men",
    inStock: true,
    tags: ["bomber", "jacket", "streetwear"],
  },
  {
    id: "f012",
    slug: "crossbody-leather-bag",
    name: "Mini Crossbody Leather Bag",
    brand: "Coach",
    price: 178,
    originalPrice: 248,
    discountPercent: 28,
    rating: 4.7,
    reviewCount: 391,
    image: "/images/mini-crossbody-leather-bag-tan.jpg",
    badge: "sale",
    colors: ["Tan", "Black", "Burgundy"],
    sizes: ["One Size"],
    subCategory: "Accessories",
    gender: "women",
    inStock: true,
    tags: ["bag", "leather", "crossbody", "accessories"],
  },
];

const subCategories = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Outerwear", "Activewear", "Accessories", "Kids"];
const genderFilters = ["All", "Women", "Men", "Unisex", "Kids"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Biggest Discount" },
];

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "$200+", min: 200, max: Infinity },
];

const trendingTags = ["Summer Essentials", "Office Ready", "Streetwear", "Luxury Picks", "Activewear", "Date Night"];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function BadgePill({ badge }: { badge: FashionProduct["badge"] }) {
  if (!badge) return null;
  const map: Record<string, { label: string; cls: string }> = {
    new: { label: "New", cls: "bg-blue-100 text-blue-700" },
    sale: { label: "Sale", cls: "bg-red-100 text-red-600" },
    bestseller: { label: "Bestseller", cls: "bg-[var(--primary)]/20 text-amber-700" },
    limited: { label: "Limited", cls: "bg-purple-100 text-purple-700" },
  };
  const config = map[badge];
  if (!config) return null;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.cls}`}>
      {config.label}
    </span>
  );
}

function ProductCard({ product }: { product: FashionProduct }) {
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
      <motion.div
        variants={cardHover}
        className="group bg-white rounded-2xl overflow-hidden border border-black/5 flex flex-col h-full"
      >
        <Link href={`/product/${product.slug}`} className="block relative">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              aria-label="Add to wishlist"
            >
              <Heart
                size={15}
                className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
              />
            </button>
            {product.discountPercent && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{product.discountPercent}%
              </div>
            )}
            {/* Quick add */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 bg-[var(--accent)] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--accent)]/90 transition-colors"
              >
                {addedToCart ? (
                  <>
                    <Check size={15} />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    Quick Add
                  </>
                )}
              </button>
            </div>
          </div>
        </Link>

        <div className="p-3 flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{product.brand}</span>
            <BadgePill badge={product.badge} />
          </div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
              {product.name}
            </h3>
          </Link>
          <StarRating rating={product.rating} count={product.reviewCount} />
          {/* Color swatches */}
          <div className="flex items-center gap-1 mt-0.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                title={color}
                className="w-3.5 h-3.5 rounded-full border border-black/10 bg-gray-300"
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-auto pt-1">
            <span className="text-base font-bold text-gray-900">
              {CURRENCY_SYMBOL}{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function colorToHex(color: string): string {
  const map: Record<string, string> = {
    White: "#f9f9f9",
    Black: "#1a1a1a",
    Beige: "#f5f0e8",
    "Sky Blue": "#87ceeb",
    Khaki: "#c3b091",
    Navy: "#1b2a4a",
    Olive: "#6b7c3e",
    "Floral Pink": "#f4a7b9",
    "Floral Blue": "#a7c4f4",
    Brown: "#7b4f2e",
    "Washed Grey": "#b0b0b0",
    "Midnight Navy": "#1b2a4a",
    "Heather Grey": "#9e9e9e",
    Camel: "#c19a6b",
    Charcoal: "#4a4a4a",
    Red: "#e53e3e",
    "Light Blue": "#add8e6",
    "Dark Blue": "#00008b",
    Champagne: "#f7e7ce",
    "Dusty Rose": "#dcb4b4",
    Burgundy: "#800020",
    Tan: "#d2b48c",
    "4T": "#ccc",
    "5T": "#ccc",
  };
  return map[color] ?? "#cccccc";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FashionCategoryPage() {
  const t = useTranslations();

  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = [...fashionProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedSubCategory !== "All") {
      result = result.filter((p) => p.subCategory === selectedSubCategory);
    }

    if (selectedGender !== "All") {
      result = result.filter(
        (p) => p.gender === selectedGender.toLowerCase()
      );
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      if (range) {
        result = result.filter(
          (p) => p.price >= range.min && p.price < range.max
        );
      }
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result = result.filter((p) => p.badge === "new").concat(result.filter((p) => p.badge !== "new"));
        break;
      case "discount":
        result.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [selectedSubCategory, selectedGender, selectedPriceRange, sortBy, searchQuery]);

  const activeFilterCount =
    (selectedSubCategory !== "All" ? 1 : 0) +
    (selectedGender !== "All" ? 1 : 0) +
    (selectedPriceRange !== null ? 1 : 0);

  const clearFilters = () => {
    setSelectedSubCategory("All");
    setSelectedGender("All");
    setSelectedPriceRange(null);
    setSortBy("featured");
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Hero Banner ── */}
      <Reveal>
        <section className="relative overflow-hidden bg-[var(--accent)] text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--primary)] blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--primary)] blur-2xl -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Sparkles size={12} />
                New Season Arrivals
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-4">
                Fashion for Every Story
              </h1>
              <p className="text-white/70 text-lg max-w-md leading-relaxed mb-6">
                Discover curated styles from top brands. From everyday essentials to statement pieces, find your look.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[var(--primary)] text-[var(--foreground)] font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  Shop All Fashion
                </Link>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-sm flex items-center gap-2"
                >
                  <Filter size={15} />
                  Browse by Filter
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full max-w-xs md:max-w-sm">
              {fashionProducts.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-white/10"
                >
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Trending Tags ── */}
      <Reveal>
        <section className="border-b border-black/5 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <TrendingUp size={13} />
              Trending
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag.split(" ")[0] ?? "")}
                className="flex-shrink-0 px-4 py-1.5 rounded-full border border-black/10 text-sm text-gray-700 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search within category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">
                  Search Fashion
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. linen shirt..."
                  className="w-full px-3 py-2 text-sm border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors bg-white"
                />
              </div>

              {/* Sub-category */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Category</p>
                <ul className="space-y-1">
                  {subCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedSubCategory(cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedSubCategory === cat
                            ? "bg-[var(--accent)] text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gender */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Gender</p>
                <ul className="space-y-1">
                  {genderFilters.map((g) => (
                    <li key={g}>
                      <button
                        onClick={() => setSelectedGender(g)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedGender === g
                            ? "bg-[var(--accent)] text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {g}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Price Range</p>
                <ul className="space-y-1">
                  {priceRanges.map((range, idx) => (
                    <li key={range.label}>
                      <button
                        onClick={() =>
                          setSelectedPriceRange(selectedPriceRange === idx ? null : idx)
                        }
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          selectedPriceRange === idx
                            ? "bg-[var(--accent)] text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {range.label}
                        {selectedPriceRange === idx && <Check size={13} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 px-3 py-1.5"
                >
                  <X size={13} />
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-sm font-medium hover:border-[var(--accent)] transition-colors"
                  >
                    <SlidersHorizontal size={15} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                  </p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                      <X size={11} /> Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-black/10 rounded-xl px-3 py-2 outline-none focus:border-[var(--accent)] bg-white transition-colors"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Reveal>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <Reveal>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSubCategory !== "All" && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold rounded-full">
                      <Tag size={11} />
                      {selectedSubCategory}
                      <button onClick={() => setSelectedSubCategory("All")} className="hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedGender !== "All" && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold rounded-full">
                      {selectedGender}
                      <button onClick={() => setSelectedGender("All")} className="hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange !== null && priceRanges[selectedPriceRange] && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold rounded-full">
                      {priceRanges[selectedPriceRange]?.label}
                      <button onClick={() => setSelectedPriceRange(null)} className="hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                </div>
              </Reveal>
            )}

            {filteredProducts.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Filter size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">No products found</h3>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
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
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Style Inspiration Banner ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="rounded-2xl overflow-hidden relative bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-48 h-48 rounded-full bg-[var(--primary)] blur-2xl" />
            </div>
            <div className="relative flex-1 text-center md:text-left">
              <p className="text-[var(--primary)] text-xs font-bold uppercase tracking-widest mb-2">Style Guide</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Not sure what to wear?
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                Browse our curated lookbooks and seasonal style guides. Get outfit ideas from real people wearing BazaarX fashion.
              </p>
            </div>
            <div className="relative flex gap-3 flex-shrink-0">
              <Link
                href="/shop"
                className="px-6 py-3 bg-[var(--primary)] text-[var(--foreground)] font-semibold rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Explore Lookbook
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-black/5">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-6">
                {/* Search */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2 block">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. linen shirt..."
                    className="w-full px-3 py-2 text-sm border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
                {/* Sub-category */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {subCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedSubCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          selectedSubCategory === cat
                            ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                            : "border-black/10 text-gray-700 hover:border-[var(--accent)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Gender */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Gender</p>
                  <div className="flex flex-wrap gap-2">
                    {genderFilters.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          selectedGender === g
                            ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                            : "border-black/10 text-gray-700 hover:border-[var(--accent)]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Price Range</p>
                  <div className="space-y-1">
                    {priceRanges.map((range, idx) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          selectedPriceRange === idx
                            ? "bg-[var(--accent)] text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {range.label}
                        {selectedPriceRange === idx && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Sort By</p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full text-sm border border-black/10 rounded-xl px-3 py-2 outline-none focus:border-[var(--accent)] bg-white"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { clearFilters(); setIsSidebarOpen(false); }}
                      className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex-1 py-2.5 bg-[var(--accent)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Show {filteredProducts.length} Results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}