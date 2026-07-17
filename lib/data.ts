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
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Order Confirmation", href: "/order-confirmation" },
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
    slug: "sony-wh1000xm5-headphones",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    brand: "Sony",
    category: "Electronics",
    categorySlug: "electronics",
    price: 279.99,
    originalPrice: 399.99,
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 2847,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    ],
    badge: "sale",
    description: "Industry-leading noise canceling with Auto NC Optimizer. Up to 30-hour battery life with quick charging. Crystal clear hands-free calling.",
    features: [
      "Industry-leading noise canceling",
      "30-hour battery life",
      "Quick charging (3 min = 3 hours)",
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
        author: "Marcus T.",
        rating: 5,
        title: "Best headphones I've ever owned",
        body: "The noise canceling is absolutely incredible. I use these on flights and in the office — total game changer.",
        date: "2024-11-15",
        verified: true,
      },
      {
        id: "r2",
        author: "Priya S.",
        rating: 5,
        title: "Worth every penny",
        body: "Sound quality is phenomenal. Battery lasts forever. Comfortable for long sessions.",
        date: "2024-10-28",
        verified: true,
      },
    ],
  },
  {
    id: "p002",
    slug: "nike-air-max-270",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    category: "Sports",
    categorySlug: "sports",
    price: 129.99,
    originalPrice: 159.99,
    discountPercent: 19,
    rating: 4.6,
    reviewCount: 1523,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    ],
    badge: "bestseller",
    description: "The Nike Air Max 270 delivers unrivaled comfort with its large Air unit in the heel. Lightweight mesh upper keeps you cool.",
    features: [
      "Largest Air unit in heel",
      "Lightweight mesh upper",
      "Foam midsole for cushioning",
      "Rubber outsole for traction",
    ],
    variants: [
      { id: "v1", label: "Size", value: "8", available: true },
      { id: "v2", label: "Size", value: "9", available: true },
      { id: "v3", label: "Size", value: "10", available: true },
      { id: "v4", label: "Size", value: "11", available: true },
    ],
    inStock: true,
    stockCount: 28,
    isBestseller: true,
    tags: ["shoes", "running", "nike", "air-max", "sports"],
    reviews: [
      {
        id: "r1",
        author: "Jordan L.",
        rating: 5,
        title: "Super comfortable",
        body: "Wore these for a 10K and my feet felt great the whole time. Highly recommend.",
        date: "2024-12-01",
        verified: true,
      },
    ],
  },
  {
    id: "p003",
    slug: "instant-pot-duo-7-in-1",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    brand: "Instant Pot",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    price: 89.95,
    originalPrice: 119.95,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 4201,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
    ],
    badge: "deal",
    description: "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.",
    features: [
      "7-in-1 functionality",
      "6-quart capacity",
      "14 smart programs",
      "Delay start up to 24 hours",
      "Dishwasher-safe parts",
    ],
    variants: [
      { id: "v1", label: "Size", value: "3 Quart", available: true },
      { id: "v2", label: "Size", value: "6 Quart", available: true },
      { id: "v3", label: "Size", value: "8 Quart", available: true },
    ],
    inStock: true,
    stockCount: 67,
    isBestseller: true,
    tags: ["instant-pot", "pressure-cooker", "kitchen", "appliance"],
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        rating: 5,
        title: "Changed how I cook",
        body: "I use this every single day. Soups, stews, rice — everything comes out perfect.",
        date: "2024-11-20",
        verified: true,
      },
    ],
  },
  {
    id: "p004",
    slug: "atomic-habits-book",
    name: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    brand: "Penguin Random House",
    category: "Books",
    categorySlug: "books",
    price: 14.99,
    originalPrice: 27.00,
    discountPercent: 44,
    rating: 4.9,
    reviewCount: 8932,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
    ],
    badge: "bestseller",
    description: "The #1 New York Times bestseller. James Clear's framework for building good habits and breaking bad ones.",
    features: [
      "#1 NYT Bestseller",
      "Practical habit-building framework",
      "Science-backed strategies",
      "Available in paperback & hardcover",
    ],
    variants: [
      { id: "v1", label: "Format", value: "Paperback", available: true },
      { id: "v2", label: "Format", value: "Hardcover", available: true },
      { id: "v3", label: "Format", value: "Kindle", available: true },
    ],
    inStock: true,
    stockCount: 200,
    isBestseller: true,
    tags: ["books", "self-help", "habits", "productivity", "bestseller"],
    reviews: [
      {
        id: "r1",
        author: "Alex K.",
        rating: 5,
        title: "Life-changing read",
        body: "This book fundamentally changed how I approach goals. A must-read for everyone.",
        date: "2024-09-10",
        verified: true,
      },
    ],
  },
  {
    id: "p005",
    slug: "apple-macbook-air-m2",
    name: "Apple MacBook Air 13-inch M2 Chip",
    brand: "Apple",
    category: "Electronics",
    categorySlug: "electronics",
    price: 1099.00,
    originalPrice: 1299.00,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 3412,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    ],
    badge: "new",
    description: "Supercharged by the next-generation M2 chip, MacBook Air is impossibly thin and the world's most popular laptop.",
    features: [
      "Apple M2 chip",
      "Up to 18 hours battery",
      "13.6-inch Liquid Retina display",
      "8GB unified memory",
      "256GB SSD storage",
    ],
    variants: [
      { id: "v1", label: "Color", value: "Midnight", available: true },
      { id: "v2", label: "Color", value: "Starlight", available: true },
      { id: "v3", label: "Color", value: "Space Gray", available: true },
    ],
    inStock: true,
    stockCount: 15,
    isNew: true,
    tags: ["apple", "macbook", "laptop", "m2", "electronics"],
    reviews: [
      {
        id: "r1",
        author: "David R.",
        rating: 5,
        title: "Perfect laptop",
        body: "The M2 chip is blazing fast. Battery life is incredible. Best laptop I've ever used.",
        date: "2024-12-05",
        verified: true,
      },
    ],
  },
  {
    id: "p006",
    slug: "levi-trucker-jacket",
    name: "Levi's Men's Trucker Jacket",
    brand: "Levi's",
    category: "Fashion",
    categorySlug: "fashion",
    price: 59.99,
    originalPrice: 98.00,
    discountPercent: 39,
    rating: 4.5,
    reviewCount: 987,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    ],
    badge: "sale",
    description: "The iconic Levi's Trucker Jacket. Classic denim style that never goes out of fashion.",
    features: [
      "100% cotton denim",
      "Classic trucker fit",
      "Button front closure",
      "Two chest pockets",
    ],
    variants: [
      { id: "v1", label: "Size", value: "S", available: true },
      { id: "v2", label: "Size", value: "M", available: true },
      { id: "v3", label: "Size", value: "L", available: true },
      { id: "v4", label: "Size", value: "XL", available: true },
    ],
    inStock: true,
    stockCount: 34,
    tags: ["jacket", "denim", "levis", "fashion", "men"],
    reviews: [
      {
        id: "r1",
        author: "Jordan L.",
        rating: 5,
        title: "Classic and timeless",
        body: "Found this at 40% off and it's exactly what I was looking for. Great quality.",
        date: "2024-10-15",
        verified: true,
      },
    ],
  },
  {
    id: "p007",
    slug: "samsung-65-qled-tv",
    name: "Samsung 65\" QLED 4K Smart TV",
    brand: "Samsung",
    category: "Electronics",
    categorySlug: "electronics",
    price: 897.99,
    originalPrice: 1299.99,
    discountPercent: 31,
    rating: 4.7,
    reviewCount: 2156,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80",
    ],
    badge: "deal",
    description: "Quantum Dot technology delivers over a billion shades of brilliant color. 4K resolution with HDR support.",
    features: [
      "QLED Quantum Dot display",
      "4K UHD resolution",
      "120Hz refresh rate",
      "Smart TV with Tizen OS",
      "4 HDMI ports",
    ],
    inStock: true,
    stockCount: 8,
    tags: ["tv", "samsung", "qled", "4k", "smart-tv"],
    reviews: [
      {
        id: "r1",
        author: "Mike B.",
        rating: 5,
        title: "Stunning picture quality",
        body: "Colors are vibrant and the picture is crystal clear. Great smart TV features too.",
        date: "2024-11-30",
        verified: true,
      },
    ],
  },
  {
    id: "p008",
    slug: "yoga-mat-premium",
    name: "Manduka PRO Yoga Mat — Premium 6mm",
    brand: "Manduka",
    category: "Sports",
    categorySlug: "sports",
    price: 88.00,
    originalPrice: 120.00,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 1876,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80",
    ],
    badge: "bestseller",
    description: "The gold standard in yoga mats. Dense cushioning for unparalleled support, closed-cell surface prevents moisture absorption.",
    features: [
      "6mm dense cushioning",
      "Closed-cell surface",
      "Lifetime guarantee",
      "Eco-friendly materials",
    ],
    variants: [
      { id: "v1", label: "Color", value: "Black", available: true },
      { id: "v2", label: "Color", value: "Purple", available: true },
      { id: "v3", label: "Color", value: "Teal", available: true },
    ],
    inStock: true,
    stockCount: 52,
    isBestseller: true,
    tags: ["yoga", "mat", "fitness", "sports", "manduka"],
    reviews: [
      {
        id: "r1",
        author: "Lisa W.",
        rating: 5,
        title: "Best yoga mat ever",
        body: "I've tried many mats and this is by far the best. The grip is incredible and it's so comfortable.",
        date: "2024-10-05",
        verified: true,
      },
    ],
  },
];

export const dealOfTheDay: Product = products[0];
export const bestsellers: Product[] = products.filter((p) => p.isBestseller);
export const newArrivals: Product[] = products.filter((p) => p.isNew || p.badge === "new");

export function formatPrice(price: number): string {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
