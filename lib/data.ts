export const APP_NAME = "BazaarX";
export const APP_TAGLINE = "Shop Everything You Love";
export const APP_DESCRIPTION =
  "Your one-stop marketplace for Electronics, Fashion, Home & Kitchen, Books, and Sports.";
export const CURRENCY = "USD";
export const CURRENCY_SYMBOL = "$";

export interface NavLink {
  label: string;
  href: string;
  type: "route" | "anchor";
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", type: "route" },
  { label: "Shop", href: "/shop", type: "route" },
  { label: "Electronics", href: "/category/electronics", type: "route" },
  { label: "Fashion", href: "/category/fashion", type: "route" },
  { label: "Home & Kitchen", href: "/category/home-kitchen", type: "route" },
  { label: "Books", href: "/category/books", type: "route" },
  { label: "Sports", href: "/category/sports", type: "route" },
  { label: "Deals", href: "/deals", type: "route" },
  { label: "About", href: "/about", type: "route" },
];

export const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Electronics", href: "/category/electronics" },
    { label: "Fashion", href: "/category/fashion" },
    { label: "Home & Kitchen", href: "/category/home-kitchen" },
    { label: "Books", href: "/category/books" },
    { label: "Sports", href: "/category/sports" },
  ],
  account: [
    { label: "My Account", href: "/account" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Sign In", href: "/auth/signin" },
    { label: "Sign Up", href: "/auth/signup" },
  ],
  help: [
    { label: "Search", href: "/search" },
    { label: "Checkout", href: "/checkout" },
    { label: "Contact & Support", href: "/contact" },
    { label: "Deals & Offers", href: "/deals" },
    { label: "About BazaarX", href: "/about" },
  ],
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Smartphones, laptops, audio, cameras, and more cutting-edge tech.",
    image: "/images/category-electronics.jpg",
    productCount: 248,
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, accessories, and the latest trends for everyone.",
    image: "/images/category-fashion.jpg",
    productCount: 512,
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Cookware, appliances, furniture, and everything for your home.",
    image: "/images/category-home-kitchen.jpg",
    productCount: 334,
  },
  {
    id: "books",
    name: "Books",
    slug: "books",
    description: "Bestsellers, textbooks, fiction, non-fiction, and digital titles.",
    image: "/images/category-books.jpg",
    productCount: 1024,
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    description: "Fitness gear, outdoor equipment, team sports, and activewear.",
    image: "/images/category-sports.jpg",
    productCount: 189,
  },
];

export type BadgeType = "new" | "sale" | "bestseller" | "out-of-stock" | "deal";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;
  value: string;
  available: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: BadgeType;
  description: string;
  features: string[];
  variants?: ProductVariant[];
  inStock: boolean;
  stockCount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  tags: string[];
  reviews: ProductReview[];
}

export const products: Product[] = [
  {
    id: "p001",
    slug: "sony-wh1000xm5-wireless-headphones",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    category: "Electronics",
    categorySlug: "electronics",
    price: 279.99,
    originalPrice: 399.99,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 14320,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    ],
    badge: "sale",
    description:
      "Industry-leading noise canceling with Auto NC Optimizer. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling.",
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Quick Charge (3 min = 3 hours)",
      "Multipoint connection",
      "Speak-to-Chat technology",
    ],
    variants: [
      { id: "v1", label: "Color", value: "Black", available: true },
      { id: "v2", label: "Color", value: "Silver", available: true },
    ],
    inStock: true,
    stockCount: 42,
    isBestseller: true,
    tags: ["headphones", "wireless", "noise-canceling", "sony", "audio"],
    reviews: [
      {
        id: "r1",
        author: "AudioPhile99",
        rating: 5,
        title: "Best headphones I've ever owned",
        body: "The noise cancellation is absolutely incredible. I use these on flights and can't hear anything around me.",
        date: "2024-11-15",
        verified: true,
      },
      {
        id: "r2",
        author: "TechReviewer",
        rating: 5,
        title: "Worth every penny",
        body: "Sound quality is phenomenal. Battery life is as advertised. Comfortable for long sessions.",
        date: "2024-10-22",
        verified: true,
      },
    ],
  },
  {
    id: "p002",
    slug: "nike-air-max-270-running-shoes",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    category: "Fashion",
    categorySlug: "fashion",
    price: 129.99,
    originalPrice: 159.99,
    discountPercent: 19,
    rating: 4.6,
    reviewCount: 8920,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
    ],
    badge: "bestseller",
    description:
      "The Nike Air Max 270 delivers unrivaled comfort with its large Air unit in the heel. Lightweight and breathable upper for all-day wear.",
    features: [
      "Largest Air unit in heel for max cushioning",
      "Lightweight mesh upper",
      "Foam midsole for lightweight cushioning",
      "Rubber outsole for traction",
    ],
    variants: [
      { id: "v1", label: "Size", value: "8", available: true },
      { id: "v2", label: "Size", value: "9", available: true },
      { id: "v3", label: "Size", value: "10", available: true },
      { id: "v4", label: "Size", value: "11", available: true },
      { id: "v5", label: "Size", value: "12", available: false },
    ],
    inStock: true,
    stockCount: 78,
    isBestseller: true,
    tags: ["shoes", "running", "nike", "air-max", "sneakers"],
    reviews: [
      {
        id: "r1",
        author: "RunnerMike",
        rating: 5,
        title: "Super comfortable!",
        body: "These are the most comfortable shoes I've ever worn. Great for long runs and casual wear.",
        date: "2024-12-01",
        verified: true,
      },
    ],
  },
  {
    id: "p003",
    slug: "instant-pot-duo-pressure-cooker",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brand: "Instant Pot",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    price: 89.95,
    originalPrice: 119.95,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 52100,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
    ],
    badge: "bestseller",
    description:
      "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.",
    features: [
      "7-in-1 functionality",
      "6-quart capacity",
      "14 one-touch programs",
      "Up to 70% faster cooking",
      "Dishwasher-safe parts",
    ],
    variants: [
      { id: "v1", label: "Size", value: "3 Quart", available: true },
      { id: "v2", label: "Size", value: "6 Quart", available: true },
      { id: "v3", label: "Size", value: "8 Quart", available: true },
    ],
    inStock: true,
    stockCount: 156,
    isBestseller: true,
    tags: ["kitchen", "pressure-cooker", "instant-pot", "appliance"],
    reviews: [
      {
        id: "r1",
        author: "ChefSarah",
        rating: 5,
        title: "Changed how I cook!",
        body: "I use this every single day. Makes meal prep so much easier and faster.",
        date: "2024-11-20",
        verified: true,
      },
    ],
  },
  {
    id: "p004",
    slug: "atomic-habits-james-clear",
    name: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    brand: "Penguin Random House",
    category: "Books",
    categorySlug: "books",
    price: 14.99,
    originalPrice: 27.0,
    discountPercent: 44,
    rating: 4.9,
    reviewCount: 98400,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    ],
    badge: "bestseller",
    description:
      "The #1 New York Times bestseller. James Clear's groundbreaking book on building good habits and breaking bad ones.",
    features: [
      "#1 NYT Bestseller",
      "Practical framework for habit formation",
      "Science-backed strategies",
      "Over 10 million copies sold",
    ],
    variants: [
      { id: "v1", label: "Format", value: "Paperback", available: true },
      { id: "v2", label: "Format", value: "Hardcover", available: true },
      { id: "v3", label: "Format", value: "Kindle", available: true },
    ],
    inStock: true,
    stockCount: 500,
    isBestseller: true,
    tags: ["books", "self-help", "habits", "productivity", "bestseller"],
    reviews: [
      {
        id: "r1",
        author: "BookLover42",
        rating: 5,
        title: "Life-changing book",
        body: "This book completely changed how I think about habits. Highly recommend to everyone.",
        date: "2024-09-10",
        verified: true,
      },
    ],
  },
  {
    id: "p005",
    slug: "peloton-resistance-bands-set",
    name: "Premium Resistance Bands Set (5-Pack)",
    brand: "FitPro",
    category: "Sports",
    categorySlug: "sports",
    price: 34.99,
    originalPrice: 49.99,
    discountPercent: 30,
    rating: 4.5,
    reviewCount: 6720,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    ],
    badge: "sale",
    description:
      "Set of 5 resistance bands with varying resistance levels. Perfect for home workouts, physical therapy, and strength training.",
    features: [
      "5 resistance levels (10-50 lbs)",
      "Natural latex material",
      "Includes carry bag",
      "Suitable for all fitness levels",
      "Stackable up to 150 lbs",
    ],
    inStock: true,
    stockCount: 234,
    tags: ["fitness", "resistance-bands", "workout", "home-gym", "sports"],
    reviews: [
      {
        id: "r1",
        author: "FitnessFreak",
        rating: 5,
        title: "Great quality bands!",
        body: "These bands are incredibly durable and the variety of resistance levels is perfect for progressive training.",
        date: "2024-10-05",
        verified: true,
      },
    ],
  },
  {
    id: "p006",
    slug: "apple-macbook-air-m2",
    name: "Apple MacBook Air 13-inch M2 Chip",
    brand: "Apple",
    category: "Electronics",
    categorySlug: "electronics",
    price: 1099.0,
    originalPrice: 1299.0,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 23400,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    ],
    badge: "new",
    description:
      "Supercharged by the next-generation M2 chip, MacBook Air can handle even the most demanding tasks with ease.",
    features: [
      "Apple M2 chip",
      "Up to 18 hours battery life",
      "13.6-inch Liquid Retina display",
      "8GB unified memory",
      "256GB SSD storage",
      "MagSafe charging",
    ],
    variants: [
      { id: "v1", label: "Color", value: "Midnight", available: true },
      { id: "v2", label: "Color", value: "Starlight", available: true },
      { id: "v3", label: "Color", value: "Space Gray", available: true },
      { id: "v4", label: "Color", value: "Silver", available: true },
    ],
    inStock: true,
    stockCount: 28,
    isNew: true,
    tags: ["laptop", "apple", "macbook", "m2", "computer"],
    reviews: [
      {
        id: "r1",
        author: "DevPro",
        rating: 5,
        title: "Incredible performance",
        body: "The M2 chip is a beast. Handles everything I throw at it without breaking a sweat.",
        date: "2024-12-10",
        verified: true,
      },
    ],
  },
  {
    id: "p007",
    slug: "levi-trucker-jacket",
    name: "Levi's Classic Trucker Jacket",
    brand: "Levi's",
    category: "Fashion",
    categorySlug: "fashion",
    price: 89.5,
    originalPrice: 120.0,
    discountPercent: 25,
    rating: 4.6,
    reviewCount: 3210,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    ],
    badge: "sale",
    description:
      "The iconic Levi's Trucker Jacket. A timeless piece crafted from durable denim with a classic fit.",
    features: [
      "100% cotton denim",
      "Classic trucker fit",
      "Button front closure",
      "Two chest pockets",
      "Machine washable",
    ],
    variants: [
      { id: "v1", label: "Size", value: "S", available: true },
      { id: "v2", label: "Size", value: "M", available: true },
      { id: "v3", label: "Size", value: "L", available: true },
      { id: "v4", label: "Size", value: "XL", available: true },
    ],
    inStock: true,
    stockCount: 67,
    tags: ["jacket", "denim", "levi's", "fashion", "outerwear"],
    reviews: [
      {
        id: "r1",
        author: "StyleIcon",
        rating: 5,
        title: "Perfect classic jacket",
        body: "Exactly what I expected. Great quality denim and fits perfectly.",
        date: "2024-11-05",
        verified: true,
      },
    ],
  },
  {
    id: "p008",
    slug: "kitchenaid-stand-mixer",
    name: "KitchenAid Artisan Series 5-Qt. Stand Mixer",
    brand: "KitchenAid",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    price: 349.99,
    originalPrice: 449.99,
    discountPercent: 22,
    rating: 4.8,
    reviewCount: 18900,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    ],
    badge: "bestseller",
    description:
      "The KitchenAid Artisan Stand Mixer with 5-quart stainless steel bowl. 10 speeds for nearly any task.",
    features: [
      "5-quart stainless steel bowl",
      "10 speed settings",
      "Tilt-head design",
      "59 touchpoints per revolution",
      "Includes flat beater, dough hook, wire whip",
    ],
    variants: [
      { id: "v1", label: "Color", value: "Empire Red", available: true },
      { id: "v2", label: "Color", value: "Ice Blue", available: true },
      { id: "v3", label: "Color", value: "Onyx Black", available: true },
      { id: "v4", label: "Color", value: "Silver", available: true },
    ],
    inStock: true,
    stockCount: 34,
    isBestseller: true,
    tags: ["kitchen", "mixer", "kitchenaid", "baking", "appliance"],
    reviews: [
      {
        id: "r1",
        author: "BakingQueen",
        rating: 5,
        title: "Worth every dollar!",
        body: "This mixer is a workhorse. I bake every weekend and it handles everything perfectly.",
        date: "2024-10-18",
        verified: true,
      },
    ],
  },
];

// ─── Derived collections ──────────────────────────────────────────────────────

export const bestsellers = products.filter((p) => p.isBestseller);
export const newArrivals = products.filter((p) => p.isNew);
export const dealOfTheDay = products.find((p) => p.badge === "sale") ?? products[0];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPrice(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
