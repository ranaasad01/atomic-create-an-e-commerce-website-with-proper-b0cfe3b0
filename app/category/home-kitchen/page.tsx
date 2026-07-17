"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Filter, ChevronDown, ChevronRight, Search, Grid, List, Check, Flame, Sparkles, ArrowRight, X } from 'lucide-react';
import { useTranslations } from "next-intl";
import { CURRENCY_SYMBOL, formatPrice } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, staggerItem, cardHover, fadeInUp } from "@/lib/motion";
import { useCart } from "@/components/CartProvider";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface HKProduct {
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

const hkProducts: HKProduct[] = [
  {
    id: "hk001",
    slug: "cuisinart-12-piece-cookware-set",
    name: "Cuisinart 12-Piece Stainless Steel Cookware Set",
    brand: "Cuisinart",
    price: 189.99,
    originalPrice: 299.99,
    discountPercent: 37,
    rating: 4.7,
    reviewCount: 2341,
    image: "/images/cuisinart-stainless-cookware-set.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Cookware",
    tags: ["cookware", "stainless steel", "set"],
    description: "Professional-grade stainless steel cookware with aluminum encapsulated base for even heat distribution.",
  },
  {
    id: "hk002",
    slug: "instant-pot-duo-7-in-1",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Qt",
    brand: "Instant Pot",
    price: 79.99,
    originalPrice: 99.99,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 18432,
    image: "/images/instant-pot-duo-pressure-cooker.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Appliances",
    tags: ["pressure cooker", "multi-cooker", "instant pot"],
    description: "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer.",
  },
  {
    id: "hk003",
    slug: "dyson-v15-detect-vacuum",
    name: "Dyson V15 Detect Cordless Vacuum Cleaner",
    brand: "Dyson",
    price: 649.99,
    originalPrice: 749.99,
    discountPercent: 13,
    rating: 4.6,
    reviewCount: 3210,
    image: "/images/dyson-v15-detect-cordless-vacuum.jpg",
    badge: "new",
    inStock: true,
    subcategory: "Cleaning",
    tags: ["vacuum", "cordless", "dyson"],
    description: "Laser detects microscopic dust. Automatically adapts suction and run time to the task.",
  },
  {
    id: "hk004",
    slug: "keurig-k-elite-coffee-maker",
    name: "Keurig K-Elite Single Serve Coffee Maker",
    brand: "Keurig",
    price: 129.99,
    originalPrice: 189.99,
    discountPercent: 32,
    rating: 4.5,
    reviewCount: 9871,
    image: "/images/keurig-k-elite-coffee-maker.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Appliances",
    tags: ["coffee", "keurig", "single serve"],
    description: "Brew hot or iced coffee with the touch of a button. Strong brew setting for a bolder cup.",
  },
  {
    id: "hk005",
    slug: "lodge-cast-iron-skillet-12",
    name: "Lodge 12-Inch Cast Iron Skillet Pre-Seasoned",
    brand: "Lodge",
    price: 34.99,
    rating: 4.9,
    reviewCount: 45231,
    image: "/images/lodge-cast-iron-skillet-12-inch.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Cookware",
    tags: ["cast iron", "skillet", "lodge"],
    description: "Pre-seasoned and ready to use. Unparalleled heat retention and even heating for perfect searing.",
  },
  {
    id: "hk006",
    slug: "kitchenaid-stand-mixer-artisan",
    name: "KitchenAid Artisan Series 5-Qt Stand Mixer",
    brand: "KitchenAid",
    price: 379.99,
    originalPrice: 449.99,
    discountPercent: 16,
    rating: 4.8,
    reviewCount: 12043,
    image: "/images/kitchenaid-artisan-stand-mixer.jpg",
    badge: "deal",
    inStock: true,
    subcategory: "Appliances",
    tags: ["mixer", "kitchenaid", "baking"],
    description: "10-speed stand mixer with 59 touchpoints around the bowl for thorough ingredient incorporation.",
  },
  {
    id: "hk007",
    slug: "ninja-air-fryer-xl",
    name: "Ninja AF161 Max XL Air Fryer 5.5 Qt",
    brand: "Ninja",
    price: 99.99,
    originalPrice: 129.99,
    discountPercent: 23,
    rating: 4.7,
    reviewCount: 7654,
    image: "/images/ninja-air-fryer-xl-5qt.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Appliances",
    tags: ["air fryer", "ninja", "healthy cooking"],
    description: "Up to 75% less fat than traditional frying. Max Crisp Technology at 450°F for crispier results.",
  },
  {
    id: "hk008",
    slug: "simplehuman-sensor-trash-can",
    name: "simplehuman 45L Rectangular Sensor Trash Can",
    brand: "simplehuman",
    price: 149.99,
    originalPrice: 179.99,
    discountPercent: 17,
    rating: 4.6,
    reviewCount: 3421,
    image: "/images/simplehuman-sensor-trash-can-45l.jpg",
    inStock: true,
    subcategory: "Organization",
    tags: ["trash can", "sensor", "kitchen"],
    description: "Hands-free sensor lid opens automatically. Fingerprint-proof brushed stainless steel finish.",
  },
  {
    id: "hk009",
    slug: "vitamix-5200-blender",
    name: "Vitamix 5200 Professional-Grade Blender",
    brand: "Vitamix",
    price: 449.99,
    originalPrice: 549.99,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 8932,
    image: "/images/vitamix-5200-professional-blender.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Appliances",
    tags: ["blender", "vitamix", "smoothie"],
    description: "Variable speed control lets you fine-tune texture. Self-cleaning in 30 to 60 seconds.",
  },
  {
    id: "hk010",
    slug: "oxo-good-grips-cutting-board",
    name: "OXO Good Grips 3-Piece Cutting Board Set",
    brand: "OXO",
    price: 39.99,
    originalPrice: 54.99,
    discountPercent: 27,
    rating: 4.7,
    reviewCount: 5621,
    image: "/images/oxo-good-grips-cutting-board-set.jpg",
    badge: "sale",
    inStock: true,
    subcategory: "Cookware",
    tags: ["cutting board", "oxo", "kitchen tools"],
    description: "Non-slip feet keep boards in place. Dishwasher safe. Juice groove catches liquids.",
  },
  {
    id: "hk011",
    slug: "roomba-i7-robot-vacuum",
    name: "iRobot Roomba i7+ Self-Emptying Robot Vacuum",
    brand: "iRobot",
    price: 599.99,
    originalPrice: 799.99,
    discountPercent: 25,
    rating: 4.5,
    reviewCount: 6234,
    image: "/images/irobot-roomba-i7-robot-vacuum.jpg",
    badge: "deal",
    inStock: true,
    subcategory: "Cleaning",
    tags: ["robot vacuum", "roomba", "smart home"],
    description: "Empties itself for up to 60 days. Learns your home and suggests cleaning schedules.",
  },
  {
    id: "hk012",
    slug: "le-creuset-dutch-oven-5qt",
    name: "Le Creuset Signature Enameled Cast Iron Dutch Oven 5.5 Qt",
    brand: "Le Creuset",
    price: 369.99,
    originalPrice: 420.00,
    discountPercent: 12,
    rating: 4.9,
    reviewCount: 4312,
    image: "/images/le-creuset-dutch-oven-5qt.jpg",
    badge: "bestseller",
    inStock: true,
    subcategory: "Cookware",
    tags: ["dutch oven", "le creuset", "cast iron"],
    description: "Colorful enameled cast iron retains heat and distributes it evenly. Oven safe to 500°F.",
  },
];

const subcategories = ["All", "Cookware", "Appliances", "Cleaning", "Organization"];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "discount", label: "Biggest Discount" },
];

const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $250", min: 100, max: 250 },
  { label: "$250 – $500", min: 250, max: 500 },
  { label: "Over $500", min: 500, max: Infinity },
];

const featuredCollections = [
  {
    title: "Kitchen Essentials",
    subtitle: "Everything you need to cook like a pro",
    image: "/images/kitchen-essentials-collection.jpg",
    href: "#",
    accent: "bg-amber-50",
  },
  {
    title: "Smart Appliances",
    subtitle: "Tech-forward tools for modern kitchens",
    image: "/images/smart-kitchen-appliances.jpg",
    href: "#",
    accent: "bg-blue-50",
  },
  {
    title: "Clean & Organize",
    subtitle: "Keep your home spotless and tidy",
    image: "/images/home-cleaning-organization.jpg",
    href: "#",
    accent: "bg-green-50",
  },
];

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
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

function BadgePill({ badge }: { badge: HKProduct["badge"] }) {
  if (!badge) return null;
  const map: Record<string, { label: string; className: string }> = {
    new: { label: "New", className: "bg-blue-100 text-blue-700" },
    sale: { label: "Sale", className: "bg-red-100 text-red-600" },
    bestseller: { label: "Bestseller", className: "bg-amber-100 text-amber-700" },
    deal: { label: "Deal", className: "bg-[var(--primary)]/20 text-[var(--accent)]" },
  };
  const config = map[badge];
  if (!config) return null;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}

interface ProductCardProps {
  product: HKProduct;
  view: "grid" | "list";
  onAddToCart: (product: HKProduct) => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
}

function ProductCard({ product, view, onAddToCart, wishlist, onToggleWishlist }: ProductCardProps) {
  const isWishlisted = wishlist.has(product.id);

  if (view === "list") {
    return (
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="bg-white rounded-2xl border border-black/5 overflow-hidden flex gap-4 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
      >
        <Link href={`/product/${product.slug}`} className="flex-shrink-0 w-36 h-36 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">{product.brand}</p>
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
            </div>
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-red-50 transition-colors"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>
          <StarRating rating={product.rating} count={product.reviewCount} />
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--foreground)]">
                {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs font-semibold text-green-600">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <BadgePill badge={product.badge} />
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                <ShoppingCart size={13} />
                Add to Cart
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
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        {product.badge && (
          <div className="absolute top-3 left-3">
            <BadgePill badge={product.badge} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 font-medium mb-0.5 uppercase tracking-wide">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug hover:text-[var(--accent)] transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[var(--foreground)]">
                {CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.discountPercent && (
              <span className="text-xs font-semibold text-green-600">Save {product.discountPercent}%</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="p-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-full transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} className="text-[var(--foreground)]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomeKitchenCategoryPage() {
  const t = useTranslations();
  const { addItem } = useCart();

  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAddToCart = (product: HKProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1800);
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    let list = [...hkProducts];

    if (selectedSubcategory !== "All") {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      if (range) {
        list = list.filter((p) => p.price >= range.min && p.price <= range.max);
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
      case "discount":
        list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [selectedSubcategory, sortBy, searchQuery, selectedPriceRange]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── Hero Banner ── */}
      <Reveal>
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white border-b border-black/5">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Link href="/" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">Home</Link>
                  <ChevronRight size={14} className="text-gray-400" />
                  <span className="text-sm text-[var(--accent)] font-medium">Home &amp; Kitchen</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--foreground)] tracking-tight text-balance mb-4">
                  Home &amp; Kitchen
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-xl mb-6">
                  Cookware, appliances, furniture, and everything to make your home shine. From everyday essentials to premium upgrades.
                </p>
                <div className="flex flex-wrap gap-3">
                  {subcategories.slice(1).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        selectedSubcategory === sub
                          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-72">
                {[
                  { icon: Flame, label: "334+ Products", sub: "In stock now" },
                  { icon: Sparkles, label: "Top Brands", sub: "Cuisinart, Dyson, KitchenAid" },
                  { icon: Check, label: "Free Returns", sub: "30-day policy" },
                  { icon: Star, label: "4.7 Avg Rating", sub: "From 80k+ reviews" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-black/5 shadow-sm">
                    <Icon size={18} className="text-[var(--accent)] mb-1" />
                    <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Featured Collections ── */}
      <Reveal>
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-5">Shop by Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCollections.map((col, i) => (
              <motion.div
                key={col.title}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${col.accent} border border-black/5 group cursor-pointer`}
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--foreground)] text-base mb-1">{col.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{col.subtitle}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] group-hover:gap-2 transition-all">
                      Shop now <ArrowRight size={12} />
                    </span>
                  </div>
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <img src={col.image} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Products Section ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {/* Toolbar */}
        <Reveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {selectedSubcategory === "All" ? "All Products" : selectedSubcategory}
                <span className="ml-2 text-sm font-normal text-gray-400">({filteredProducts.length} items)</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-48 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-full outline-none focus:border-[var(--accent)] transition-colors bg-white"
                />
              </div>
              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-full bg-white hover:border-[var(--accent)] transition-colors"
              >
                <Filter size={14} />
                Filters
              </button>
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-full bg-white outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {/* View toggle */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 transition-colors ${view === "grid" ? "bg-[var(--accent)] text-white" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="Grid view"
                >
                  <Grid size={14} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 transition-colors ${view === "list" ? "bg-[var(--accent)] text-white" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="List view"
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex gap-6">
          {/* ── Sidebar Filters ── */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 240 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-60 bg-white rounded-2xl border border-black/5 p-5 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-[var(--foreground)]">Filters</h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Subcategory filter */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                    <div className="space-y-1">
                      {subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubcategory(sub)}
                          className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                            selectedSubcategory === sub
                              ? "bg-[var(--primary)]/20 text-[var(--accent)] font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {sub}
                          {selectedSubcategory === sub && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price range filter */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
                    <div className="space-y-1">
                      {priceRanges.map((range, idx) => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                          className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                            selectedPriceRange === idx
                              ? "bg-[var(--primary)]/20 text-[var(--accent)] font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {range.label}
                          {selectedPriceRange === idx && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear filters */}
                  {(selectedSubcategory !== "All" || selectedPriceRange !== null || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedSubcategory("All");
                        setSelectedPriceRange(null);
                        setSearchQuery("");
                      }}
                      className="w-full text-xs text-red-500 hover:text-red-600 font-medium py-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <Reveal>
                <div className="text-center py-20">
                  <Search size={40} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">No products found</h3>
                  <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or search query.</p>
                  <button
                    onClick={() => {
                      setSelectedSubcategory("All");
                      setSelectedPriceRange(null);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-semibold rounded-full transition-colors"
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
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product, i) => (
                  <motion.div key={product.id} variants={staggerItem}>
                    <ProductCard
                      product={product}
                      view={view}
                      onAddToCart={handleAddToCart}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Added to Cart Toast ── */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--accent)] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold"
          >
            <Check size={15} />
            Added to cart!
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}