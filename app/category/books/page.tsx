"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Heart, ShoppingCart, Filter, ChevronDown, BookOpen, Award, TrendingUp, Tag, X, Check, ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { staggerContainer, staggerItem, fadeInUp, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: "bestseller" | "new" | "sale" | "award";
  description: string;
  pages: number;
  publisher: string;
  year: number;
  inStock: boolean;
  tags: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  {
    id: "b001",
    slug: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    price: 14.99,
    originalPrice: 27.0,
    discountPercent: 44,
    rating: 4.9,
    reviewCount: 48320,
    image: "/images/book-atomic-habits.jpg",
    badge: "bestseller",
    description: "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.",
    pages: 320,
    publisher: "Avery",
    year: 2018,
    inStock: true,
    tags: ["habits", "productivity", "self-improvement"],
  },
  {
    id: "b002",
    slug: "the-lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    genre: "Business",
    price: 16.99,
    originalPrice: 28.0,
    discountPercent: 39,
    rating: 4.7,
    reviewCount: 22140,
    image: "/images/book-lean-startup.jpg",
    badge: "bestseller",
    description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    pages: 336,
    publisher: "Crown Business",
    year: 2011,
    inStock: true,
    tags: ["startup", "business", "entrepreneurship"],
  },
  {
    id: "b003",
    slug: "dune",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    price: 12.99,
    originalPrice: 19.99,
    discountPercent: 35,
    rating: 4.8,
    reviewCount: 61200,
    image: "/images/book-dune-novel.jpg",
    badge: "award",
    description: "Set in the distant future, Dune tells the story of young Paul Atreides on the desert planet Arrakis.",
    pages: 688,
    publisher: "Ace Books",
    year: 1965,
    inStock: true,
    tags: ["sci-fi", "classic", "epic"],
  },
  {
    id: "b004",
    slug: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "History",
    price: 17.99,
    originalPrice: 29.99,
    discountPercent: 40,
    rating: 4.8,
    reviewCount: 39870,
    image: "/images/book-sapiens-history.jpg",
    badge: "bestseller",
    description: "A groundbreaking narrative of humanity's creation and evolution that explores who we are and how we got here.",
    pages: 464,
    publisher: "Harper",
    year: 2015,
    inStock: true,
    tags: ["history", "anthropology", "nonfiction"],
  },
  {
    id: "b005",
    slug: "the-midnight-library",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    price: 13.99,
    originalPrice: 22.0,
    discountPercent: 36,
    rating: 4.6,
    reviewCount: 18540,
    image: "/images/book-midnight-library.jpg",
    badge: "new",
    description: "Between life and death there is a library. Its shelves go on forever. Every book provides a chance to try another life.",
    pages: 304,
    publisher: "Viking",
    year: 2020,
    inStock: true,
    tags: ["fiction", "fantasy", "inspirational"],
  },
  {
    id: "b006",
    slug: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Self-Help",
    price: 15.99,
    originalPrice: 26.0,
    discountPercent: 38,
    rating: 4.7,
    reviewCount: 14230,
    image: "/images/book-deep-work.jpg",
    badge: "bestseller",
    description: "Rules for focused success in a distracted world. The ability to perform deep work is becoming increasingly rare.",
    pages: 296,
    publisher: "Grand Central",
    year: 2016,
    inStock: true,
    tags: ["productivity", "focus", "career"],
  },
  {
    id: "b007",
    slug: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    price: 9.99,
    originalPrice: 15.0,
    discountPercent: 33,
    rating: 4.5,
    reviewCount: 52100,
    image: "/images/book-great-gatsby.jpg",
    description: "A portrait of the Jazz Age in all of its decadence and excess, capturing the spirit of the American Dream.",
    pages: 180,
    publisher: "Scribner",
    year: 1925,
    inStock: true,
    tags: ["classic", "american-literature", "fiction"],
  },
  {
    id: "b008",
    slug: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Psychology",
    price: 16.49,
    originalPrice: 30.0,
    discountPercent: 45,
    rating: 4.7,
    reviewCount: 28900,
    image: "/images/book-thinking-fast-slow.jpg",
    badge: "award",
    description: "A groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    pages: 499,
    publisher: "Farrar, Straus and Giroux",
    year: 2011,
    inStock: true,
    tags: ["psychology", "behavioral-economics", "nonfiction"],
  },
  {
    id: "b009",
    slug: "project-hail-mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Science Fiction",
    price: 14.49,
    originalPrice: 28.99,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 31450,
    image: "/images/book-project-hail-mary.jpg",
    badge: "new",
    description: "A lone astronaut must save the earth from disaster in this propulsive, gripping, and wildly entertaining novel.",
    pages: 476,
    publisher: "Ballantine Books",
    year: 2021,
    inStock: true,
    tags: ["sci-fi", "adventure", "space"],
  },
  {
    id: "b010",
    slug: "the-psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    price: 13.49,
    originalPrice: 24.0,
    discountPercent: 44,
    rating: 4.8,
    reviewCount: 19870,
    image: "/images/book-psychology-money.jpg",
    badge: "bestseller",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know.",
    pages: 256,
    publisher: "Harriman House",
    year: 2020,
    inStock: true,
    tags: ["finance", "investing", "personal-finance"],
  },
  {
    id: "b011",
    slug: "1984",
    title: "1984",
    author: "George Orwell",
    genre: "Classic",
    price: 10.99,
    originalPrice: 17.0,
    discountPercent: 35,
    rating: 4.8,
    reviewCount: 74300,
    image: "/images/book-1984-orwell.jpg",
    badge: "award",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    pages: 328,
    publisher: "Secker & Warburg",
    year: 1949,
    inStock: true,
    tags: ["classic", "dystopia", "political"],
  },
  {
    id: "b012",
    slug: "educated",
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir",
    price: 15.49,
    originalPrice: 28.0,
    discountPercent: 45,
    rating: 4.8,
    reviewCount: 23600,
    image: "/images/book-educated-memoir.jpg",
    badge: "award",
    description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.",
    pages: 352,
    publisher: "Random House",
    year: 2018,
    inStock: true,
    tags: ["memoir", "education", "nonfiction"],
  },
];

const GENRES = ["All", "Self-Help", "Business", "Science Fiction", "History", "Fiction", "Classic", "Psychology", "Finance", "Memoir"];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest First" },
];

const FEATURED_COLLECTIONS = [
  { label: "Bestsellers", icon: TrendingUp, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Award Winners", icon: Award, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "New Arrivals", icon: BookOpen, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "On Sale", icon: Tag, color: "bg-rose-50 text-rose-700 border-rose-200" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)} ({(count ?? 0).toLocaleString("en-US")})
      </span>
    </div>
  );
}

function BadgePill({ badge }: { badge: Book["badge"] }) {
  if (!badge) return null;
  const map: Record<NonNullable<Book["badge"]>, string> = {
    bestseller: "bg-amber-100 text-amber-800",
    new: "bg-emerald-100 text-emerald-800",
    sale: "bg-rose-100 text-rose-800",
    award: "bg-purple-100 text-purple-800",
  };
  const labels: Record<NonNullable<Book["badge"]>, string> = {
    bestseller: "Bestseller",
    new: "New",
    sale: "Sale",
    award: "Award Winner",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[badge]}`}>
      {labels[badge]}
    </span>
  );
}

function BookCard({ book, wishlist, onWishlist }: { book: Book; wishlist: Set<string>; onWishlist: (id: string) => void }) {
  const isWishlisted = wishlist.has(book.id);
  const discount = book.discountPercent ?? 0;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.14)] transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
        <motion.img
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/book-placeholder.jpg";
          }}
        />
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <button
          onClick={() => onWishlist(book.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={15}
            className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-500"}
          />
        </button>
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--accent)]/70 font-medium mb-0.5">{book.genre}</p>
            <Link href={`/product/${book.slug}`}>
              <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--accent)] transition-colors">
                {book.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">by {book.author}</p>
          </div>
          {book.badge && (
            <div className="flex-shrink-0">
              <BadgePill badge={book.badge} />
            </div>
          )}
        </div>

        <StarRating rating={book.rating} count={book.reviewCount} />

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{book.description}</p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              {CURRENCY_SYMBOL}{(book.price ?? 0).toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {CURRENCY_SYMBOL}{book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            aria-label={`Add ${book.title} to cart`}
          >
            <ShoppingCart size={13} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BooksPage() {
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredBooks = useMemo(() => {
    let result = [...BOOKS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q) ||
          b.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedGenre !== "All") {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (onlyInStock) {
      result = result.filter((b) => b.inStock);
    }

    if (onlyOnSale) {
      result = result.filter((b) => (b.discountPercent ?? 0) > 0);
    }

    result = result.filter(
      (b) => b.price >= priceRange[0] && b.price <= priceRange[1]
    );

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
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
        result.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedGenre, sortBy, priceRange, onlyInStock, onlyOnSale]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
    setSortBy("featured");
    setPriceRange([0, 50]);
    setOnlyInStock(false);
    setOnlyOnSale(false);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedGenre !== "All" ||
    sortBy !== "featured" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 50 ||
    onlyInStock ||
    onlyOnSale;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <Reveal>
        <section className="relative bg-[var(--accent)] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[var(--primary)] blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[var(--primary)] blur-3xl translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
                >
                  <BookOpen size={14} />
                  Books Collection
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="text-3xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight text-balance mb-4"
                >
                  Discover Your Next
                  <span className="text-[var(--primary)]"> Great Read</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2 }}
                  className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg mb-6"
                >
                  Over 1,024 titles across fiction, non-fiction, science, history, and more. Free shipping on orders over $35.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.3 }}
                  className="flex flex-wrap gap-3 justify-center md:justify-start"
                >
                  {FEATURED_COLLECTIONS.map(({ label, icon: Icon, color }) => (
                    <button
                      key={label}
                      onClick={() => {
                        if (label === "Bestsellers") {
                          setSelectedGenre("All");
                          setSortBy("reviews");
                        } else if (label === "New Arrivals") {
                          setSortBy("newest");
                        } else if (label === "On Sale") {
                          setOnlyOnSale(true);
                        }
                      }}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${color} transition-transform hover:scale-105`}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:grid grid-cols-3 gap-3 flex-shrink-0"
              >
                {BOOKS.slice(0, 6).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="w-20 h-28 rounded-lg overflow-hidden shadow-lg"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/book-placeholder.jpg";
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <Reveal>
        <div className="bg-white border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Total Titles", value: "1,024+" },
                  { label: "Genres", value: "40+" },
                  { label: "Avg. Discount", value: "38%" },
                  { label: "Free Shipping", value: "Over $35" },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
              >
                Browse all categories <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar Filters ─────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <Reveal>
              <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900">Filters</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                    >
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>

                {/* Genre */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Genre</p>
                  <div className="flex flex-col gap-1">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                          selectedGenre === genre
                            ? "bg-[var(--accent)] text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {genre}
                        {selectedGenre === genre && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Max Price: {CURRENCY_SYMBOL}{priceRange[1]}
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[var(--accent)]"
                    aria-label="Maximum price filter"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{CURRENCY_SYMBOL}0</span>
                    <span>{CURRENCY_SYMBOL}50</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-2">
                  {[
                    { label: "In Stock Only", value: onlyInStock, setter: setOnlyInStock },
                    { label: "On Sale", value: onlyOnSale, setter: setOnlyOnSale },
                  ].map(({ label, value, setter }) => (
                    <button
                      key={label}
                      onClick={() => setter(!value)}
                      className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg border transition-colors ${
                        value
                          ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)] font-semibold"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {label}
                      <div
                        className={`w-8 h-4 rounded-full transition-colors ${
                          value ? "bg-[var(--accent)]" : "bg-gray-200"
                        } relative`}
                      >
                        <div
                          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                            value ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </aside>

          {/* ── Product Grid ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books, authors, genres..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                    aria-label="Search books"
                  />
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium px-4 py-2.5 bg-white border border-black/10 rounded-xl shadow-sm hover:border-[var(--accent)] transition-colors"
                >
                  <Filter size={15} />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-black/10 rounded-xl outline-none focus:border-[var(--accent)] transition-colors shadow-sm cursor-pointer"
                    aria-label="Sort books"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <p className="text-sm text-gray-500 ml-auto">
                  <span className="font-semibold text-gray-900">{filteredBooks.length}</span> books
                </p>
              </div>
            </Reveal>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden overflow-hidden mb-4"
                >
                  <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {GENRES.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => setSelectedGenre(genre)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            selectedGenre === genre
                              ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                              : "border-gray-200 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setOnlyInStock(!onlyInStock)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          onlyInStock
                            ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        In Stock
                      </button>
                      <button
                        onClick={() => setOnlyOnSale(!onlyOnSale)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          onlyOnSale
                            ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        On Sale
                      </button>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs px-3 py-1.5 rounded-full border border-rose-200 text-rose-600"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Genre Pills (quick filter) */}
            <Reveal>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`flex-shrink-0 text-xs font-medium px-4 py-1.5 rounded-full border transition-colors ${
                      selectedGenre === genre
                        ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <BookOpen size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No books found</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    Clear all filters
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
                {filteredBooks.map((book, i) => (
                  <motion.div key={book.id} variants={staggerItem}>
                    <BookCard
                      book={book}
                      wishlist={wishlist}
                      onWishlist={toggleWishlist}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Editorial Picks ─────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-white border-t border-black/5 py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-widest mb-1">Staff Picks</p>
                <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
                  Curated Reading Lists
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-sm font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Mind-Expanding Non-Fiction",
                  description: "Books that challenge your worldview and expand your understanding of the universe.",
                  books: BOOKS.filter((b) => ["History", "Psychology", "Finance"].includes(b.genre)).slice(0, 3),
                  color: "from-blue-50 to-indigo-50",
                  accent: "text-indigo-700",
                },
                {
                  title: "Productivity Powerhouse",
                  description: "Proven frameworks and strategies to help you work smarter and achieve more.",
                  books: BOOKS.filter((b) => b.genre === "Self-Help" || b.genre === "Business").slice(0, 3),
                  color: "from-amber-50 to-orange-50",
                  accent: "text-amber-700",
                },
                {
                  title: "Worlds Beyond Imagination",
                  description: "Escape into extraordinary universes crafted by the greatest storytellers of our time.",
                  books: BOOKS.filter((b) => ["Science Fiction", "Fiction", "Classic"].includes(b.genre)).slice(0, 3),
                  color: "from-emerald-50 to-teal-50",
                  accent: "text-emerald-700",
                },
              ].map((list, idx) => (
                <Reveal key={list.title} delay={idx * 0.1}>
                  <div className={`rounded-2xl bg-gradient-to-br ${list.color} border border-black/5 p-5 h-full`}>
                    <h3 className={`text-base font-bold mb-1 ${list.accent}`}>{list.title}</h3>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{list.description}</p>
                    <div className="flex flex-col gap-3">
                      {list.books.map((book) => (
                        <Link
                          key={book.id}
                          href={`/product/${book.slug}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/images/book-placeholder.jpg";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                              {book.title}
                            </p>
                            <p className="text-[11px] text-gray-500">{book.author}</p>
                            <p className="text-xs font-bold text-gray-900 mt-0.5">
                              {CURRENCY_SYMBOL}{(book.price ?? 0).toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Newsletter CTA ──────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-[var(--accent)] py-14">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <BookOpen size={36} className="text-[var(--primary)] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mb-3">
              Get Book Recommendations
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Join 50,000+ readers who get weekly curated picks, exclusive deals, and author spotlights delivered to their inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[var(--primary)] transition-colors"
                aria-label="Email for newsletter"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-6 py-3 bg-[var(--primary)] text-[var(--foreground)] text-sm font-bold rounded-xl hover:bg-[var(--primary-hover)] transition-colors flex-shrink-0"
              >
                Subscribe Free
              </motion.button>
            </form>
            <p className="text-white/40 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}