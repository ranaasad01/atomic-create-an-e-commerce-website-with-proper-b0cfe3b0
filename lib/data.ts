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
    reviewCount: 3241,
    image: "/images/sony-wh1000xm5-headphones.jpg",
    images: [
      "/images/sony-wh1000xm5-headphones.jpg",
      "/images/sony-headphones-side.jpg",
      "/images/sony-headphones-case.jpg",
    ],
    badge: "sale",
    description:
      "Industry-leading noise cancellation with the WH-1000XM5. Featuring 30-hour battery life, multipoint connection, and crystal-clear hands-free calling. The premium over-ear design delivers exceptional comfort for all-day wear.",
    features: [
      "Industry-leading noise cancellation",
      "30-hour battery life with quick charge",
      "Multipoint Bluetooth connection",
      "Crystal-clear hands-free calling",
      "Foldable design with carrying case",
    ],
    variants: [
      { id: "v1", label: "Color", value: "Black", available: true },
      { id: "v2", label: "Color", value: "Silver", available: true },
      { id: "v3", label: "Color", value: "Midnight Blue", available: false },
    ],
    inStock: true,
    stockCount: 47,
    isBestseller: true,
    tags: ["headphones", "wireless", "noise-canceling", "sony", "audio"],
    reviews: [
      {
        id: "r1",
        author: "Marcus T.",
        rating: 5,
        title: "Best headphones I've ever owned",
        body: "The noise cancellation is absolutely incredible. I use these on flights and in the office — total game changer. Sound quality is rich and detailed.",
        date: "2024-11-15",
        verified: true,
      },
      {
        id: "r2",
        author: "Sarah K.",
        rating: 5,
        title: "Worth every penny",
        body: "Comfortable for hours of wear, battery lasts all day, and the ANC is top-notch. Highly recommend to anyone who works in a noisy environment.",
        date: "2024-10-28",
        verified: true,
      },
      {
        id: "r3",
        author: "James R.",
        rating: 4,
        title: "Great but touch controls take getting used to",
        body: "Sound and ANC are phenomenal. The touch controls on the ear cup are sensitive and took a week to get used to. Overall still a 4-star product.",
        date: "2024-09-12",
        verified: true,
      },
    ],
  },
  {
    id: "p002",
    slug: "apple-ipad-pro-11",
    name: "Apple iPad Pro 11-inch (M4 Chip, 256GB)",
    brand: "Apple",
    category: "Electronics",
    categorySlug: "electronics",
    price: 999.00,
    originalPrice: 1099.00,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 1872,
    image: "/images/apple-ipad-pro-11.jpg",
    images: ["/images/apple-ipad-pro-11.jpg", "/images/ipad-pro-side.jpg"],
    badge: "new",
    description:
      "The most advanced iPad ever. Powered by the Apple M4 chip, the iPad Pro 11-inch delivers desktop-class performance in an impossibly thin design. The Ultra Retina XDR display with ProMotion technology makes everything look stunning.",
    features: [
      "Apple M4 chip for desktop-class performance",
      "Ultra Retina XDR display with ProMotion",
      "Thinnest Apple product ever at 5.1mm",
      "Apple Pencil Pro and Magic Keyboard support",
      "All-day battery life",
    ],
    variants: [
      { id: "v1", label: "Storage", value: "256GB", available: true },
      { id: "v2", label: "Storage", value: "512GB", available: true },
      { id: "v3", label: "Storage", value: "1TB", available: true },
    ],
    inStock: true,
    stockCount: 23,
    isNew: true,
    tags: ["ipad", "apple", "tablet", "m4", "pro"],
    reviews: [
      {
        id: "r1",
        author: "Priya M.",
        rating: 5,
        title: "Absolutely stunning device",
        body: "The M4 chip makes this thing fly. I use it for video editing and digital art — it handles everything effortlessly. The display is gorgeous.",
        date: "2024-12-01",
        verified: true,
      },
    ],
  },
  {
    id: "p003",
    slug: "nike-air-max-270",
    name: "Nike Air Max 270 Running Shoes",
    brand: "Nike",
    category: "Fashion",
    categorySlug: "fashion",
    price: 89.99,
    originalPrice: 150.00,
    discountPercent: 40,
    rating: 4.6,
    reviewCount: 5621,
    image: "/images/nike-air-max-270.jpg",
    images: ["/images/nike-air-max-270.jpg", "/images/nike-air-max-270-side.jpg"],
    badge: "sale",
    description:
      "The Nike Air Max 270 features Nike's biggest heel Air unit yet for an incredibly cushioned ride. The mesh upper provides breathability while the foam midsole delivers lightweight comfort all day long.",
    features: [
      "Largest heel Air unit for maximum cushioning",
      "Breathable mesh upper",
      "Foam midsole for lightweight comfort",
      "Rubber outsole for durable traction",
      "Available in multiple colorways",
    ],
    variants: [
      { id: "v1", label: "Size", value: "8", available: true },
      { id: "v2", label: "Size", value: "9", available: true },
      { id: "v3", label: "Size", value: "10", available: true },
      { id: "v4", label: "Size", value: "11", available: true },
      { id: "v5", label: "Size", value: "12", available: false },
    ],
    inStock: true,
    stockCount: 89,
    isBestseller: true,
    tags: ["nike", "shoes", "running", "air max", "sneakers"],
    reviews: [
      {
        id: "r1",
        author: "Derek L.",
        rating: 5,
        title: "Most comfortable shoes I own",
        body: "I wear these all day at work and my feet never hurt. The cushioning is incredible. Already on my second pair.",
        date: "2024-11-20",
        verified: true,
      },
      {
        id: "r2",
        author: "Aisha B.",
        rating: 4,
        title: "Great style and comfort",
        body: "Love the look and feel. Runs slightly large so I'd recommend going half a size down.",
        date: "2024-10-05",
        verified: true,
      },
    ],
  },
  {
    id: "p004",
    slug: "instant-pot-duo-7-in-1",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Qt)",
    brand: "Instant Pot",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    price: 59.99,
    originalPrice: 99.99,
    discountPercent: 40,
    rating: 4.7,
    reviewCount: 89432,
    image: "/images/instant-pot-duo-7-in-1.jpg",
    images: ["/images/instant-pot-duo-7-in-1.jpg", "/images/instant-pot-open.jpg"],
    badge: "bestseller",
    description:
      "The Instant Pot Duo is the #1 selling multi-cooker. Replace 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. Cook up to 70% faster than traditional methods.",
    features: [
      "7-in-1 functionality replaces multiple appliances",
      "Cook up to 70% faster",
      "14 one-touch smart programs",
      "Delay start and keep-warm functions",
      "Dishwasher-safe inner pot",
    ],
    inStock: true,
    stockCount: 156,
    isBestseller: true,
    tags: ["instant pot", "pressure cooker", "kitchen", "cooking", "appliance"],
    reviews: [
      {
        id: "r1",
        author: "Linda C.",
        rating: 5,
        title: "Changed how I cook",
        body: "I use this every single day. Soups, stews, rice, yogurt — it does everything perfectly. Best kitchen purchase I've ever made.",
        date: "2024-11-30",
        verified: true,
      },
    ],
  },
  {
    id: "p005",
    slug: "atomic-habits-james-clear",
    name: "Atomic Habits by James Clear (Hardcover)",
    brand: "Avery Publishing",
    category: "Books",
    categorySlug: "books",
    price: 14.99,
    originalPrice: 27.00,
    discountPercent: 44,
    rating: 4.9,
    reviewCount: 124567,
    image: "/images/atomic-habits-james-clear.jpg",
    images: ["/images/atomic-habits-james-clear.jpg"],
    badge: "bestseller",
    description:
      "The #1 New York Times bestseller. Tiny changes, remarkable results. No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    features: [
      "New York Times #1 Bestseller",
      "Over 15 million copies sold worldwide",
      "Practical, science-backed strategies",
      "Applicable to any goal or habit",
      "Hardcover, 320 pages",
    ],
    inStock: true,
    stockCount: 500,
    isBestseller: true,
    tags: ["self-help", "habits", "productivity", "bestseller", "james clear"],
    reviews: [
      {
        id: "r1",
        author: "Rachel W.",
        rating: 5,
        title: "Life-changing book",
        body: "I've read dozens of self-help books and this is the most practical and actionable one I've found. The 1% better every day concept is simple but profound.",
        date: "2024-12-10",
        verified: true,
      },
    ],
  },
  {
    id: "p006",
    slug: "peloton-resistance-bands",
    name: "Peloton Resistance Band Set (5 Levels)",
    brand: "Peloton",
    category: "Sports",
    categorySlug: "sports",
    price: 34.99,
    originalPrice: 49.99,
    discountPercent: 30,
    rating: 4.5,
    reviewCount: 2341,
    image: "/images/peloton-resistance-bands.jpg",
    images: ["/images/peloton-resistance-bands.jpg"],
    badge: "new",
    description:
      "Level up your home workouts with the Peloton Resistance Band Set. Five progressive resistance levels from light to extra-heavy let you customize every exercise. Made from premium natural latex for durability and comfort.",
    features: [
      "5 progressive resistance levels",
      "Premium natural latex construction",
      "Includes carrying bag",
      "Compatible with all Peloton workouts",
      "Suitable for all fitness levels",
    ],
    inStock: true,
    stockCount: 78,
    isNew: true,
    tags: ["peloton", "resistance bands", "fitness", "home gym", "workout"],
    reviews: [
      {
        id: "r1",
        author: "Tom H.",
        rating: 5,
        title: "Perfect for home workouts",
        body: "Great quality bands. The 5 levels give you plenty of progression. I use these daily with my Peloton app workouts.",
        date: "2024-11-08",
        verified: true,
      },
    ],
  },
  {
    id: "p007",
    slug: "samsung-65-qled-tv",
    name: "Samsung 65-inch QLED 4K Smart TV (QN65Q80C)",
    brand: "Samsung",
    category: "Electronics",
    categorySlug: "electronics",
    price: 897.99,
    originalPrice: 1299.99,
    discountPercent: 31,
    rating: 4.7,
    reviewCount: 4521,
    image: "/images/samsung-65-qled-tv.jpg",
    images: ["/images/samsung-65-qled-tv.jpg", "/images/samsung-tv-remote.jpg"],
    badge: "deal",
    description:
      "Experience stunning 4K QLED picture quality with Samsung's Quantum Dot technology. The Q80C delivers vibrant colors, deep blacks, and exceptional brightness. Smart TV features include built-in streaming apps and voice control.",
    features: [
      "Quantum Dot QLED 4K display",
      "Quantum HDR for exceptional brightness",
      "Object Tracking Sound for immersive audio",
      "Smart TV with built-in streaming apps",
      "Alexa and Google Assistant compatible",
    ],
    inStock: true,
    stockCount: 12,
    tags: ["samsung", "tv", "4k", "qled", "smart tv"],
    reviews: [
      {
        id: "r1",
        author: "Kevin P.",
        rating: 5,
        title: "Incredible picture quality",
        body: "The colors are absolutely stunning. HDR content looks amazing and the smart TV interface is fast and intuitive. Very happy with this purchase.",
        date: "2024-10-15",
        verified: true,
      },
    ],
  },
  {
    id: "p008",
    slug: "levi-501-original-jeans",
    name: "Levi's 501 Original Fit Jeans",
    brand: "Levi's",
    category: "Fashion",
    categorySlug: "fashion",
    price: 49.99,
    originalPrice: 79.50,
    discountPercent: 37,
    rating: 4.5,
    reviewCount: 18234,
    image: "/images/levis-501-original-jeans.jpg",
    images: ["/images/levis-501-original-jeans.jpg"],
    badge: "sale",
    description:
      "The original blue jean since 1873. The Levi's 501 Original Fit is the jean that started it all. Straight leg, button fly, and a relaxed fit through the seat and thigh. Made from 100% cotton denim.",
    features: [
      "Original straight leg fit",
      "Button fly closure",
      "100% cotton denim",
      "Relaxed fit through seat and thigh",
      "Available in multiple washes",
    ],
    variants: [
      { id: "v1", label: "Size", value: "30x30", available: true },
      { id: "v2", label: "Size", value: "32x30", available: true },
      { id: "v3", label: "Size", value: "32x32", available: true },
      { id: "v4", label: "Size", value: "34x32", available: true },
      { id: "v5", label: "Size", value: "36x32", available: false },
    ],
    inStock: true,
    stockCount: 234,
    isBestseller: true,
    tags: ["levi's", "jeans", "denim", "fashion", "501"],
    reviews: [],
  },
  {
    id: "p009",
    slug: "keurig-k-elite-coffee-maker",
    name: "Keurig K-Elite Single Serve Coffee Maker",
    brand: "Keurig",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    price: 129.99,
    originalPrice: 189.99,
    discountPercent: 32,
    rating: 4.6,
    reviewCount: 34521,
    image: "/images/keurig-k-elite-coffee-maker.jpg",
    images: ["/images/keurig-k-elite-coffee-maker.jpg"],
    badge: "sale",
    description:
      "Brew the perfect cup every time with the Keurig K-Elite. Features a strong brew setting for a bolder cup, iced coffee mode, and a large 75oz water reservoir. Compatible with all K-Cup pods.",
    features: [
      "Strong brew setting for bolder coffee",
      "Iced coffee mode",
      "75oz removable water reservoir",
      "Compatible with all K-Cup pods",
      "Programmable auto on/off",
    ],
    inStock: true,
    stockCount: 67,
    tags: ["keurig", "coffee", "coffee maker", "kitchen", "single serve"],
    reviews: [],
  },
  {
    id: "p010",
    slug: "the-psychology-of-money",
    name: "The Psychology of Money by Morgan Housel",
    brand: "Harriman House",
    category: "Books",
    categorySlug: "books",
    price: 12.99,
    originalPrice: 22.00,
    discountPercent: 41,
    rating: 4.8,
    reviewCount: 67890,
    image: "/images/psychology-of-money-book.jpg",
    images: ["/images/psychology-of-money-book.jpg"],
    badge: "bestseller",
    description:
      "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.",
    features: [
      "Wall Street Journal Bestseller",
      "Over 4 million copies sold",
      "19 short stories on money and investing",
      "Paperback, 256 pages",
      "Accessible to all readers",
    ],
    inStock: true,
    stockCount: 800,
    isBestseller: true,
    tags: ["finance", "money", "investing", "bestseller", "morgan housel"],
    reviews: [],
  },
  {
    id: "p011",
    slug: "yoga-mat-gaiam",
    name: "Gaiam Premium 6mm Yoga Mat with Carrying Strap",
    brand: "Gaiam",
    category: "Sports",
    categorySlug: "sports",
    price: 29.99,
    originalPrice: 44.99,
    discountPercent: 33,
    rating: 4.6,
    reviewCount: 12456,
    image: "/images/gaiam-yoga-mat.jpg",
    images: ["/images/gaiam-yoga-mat.jpg"],
    badge: "sale",
    description:
      "The Gaiam Premium Yoga Mat provides extra-thick 6mm cushioning for superior support and comfort. The textured, non-slip surface keeps you stable in every pose. Includes a free carrying strap.",
    features: [
      "6mm thick for superior cushioning",
      "Non-slip textured surface",
      "Free carrying strap included",
      "Lightweight at 2.2 lbs",
      "Available in multiple colors",
    ],
    inStock: true,
    stockCount: 145,
    tags: ["yoga", "mat", "fitness", "gaiam", "exercise"],
    reviews: [],
  },
  {
    id: "p012",
    slug: "airpods-pro-2nd-gen",
    name: "Apple AirPods Pro (2nd Generation) with MagSafe Case",
    brand: "Apple",
    category: "Electronics",
    categorySlug: "electronics",
    price: 189.99,
    originalPrice: 249.00,
    discountPercent: 24,
    rating: 4.8,
    reviewCount: 28934,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    images: ["https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg"],
    badge: "sale",
    description:
      "AirPods Pro deliver up to 2x more Active Noise Cancellation than the previous generation. Adaptive Transparency lets you hear the world around you while reducing loud environmental noise. Personalized Spatial Audio with dynamic head tracking places sound all around you.",
    features: [
      "2x more Active Noise Cancellation",
      "Adaptive Transparency mode",
      "Personalized Spatial Audio",
      "Up to 30 hours total listening time",
      "MagSafe Charging Case",
    ],
    inStock: true,
    stockCount: 89,
    isBestseller: true,
    tags: ["airpods", "apple", "earbuds", "wireless", "noise-canceling"],
    reviews: [],
  },
];

export const dealOfTheDay: Product = products[0];

export const bestsellers = products.filter((p) => p.isBestseller);

export const newArrivals = products.filter((p) => p.isNew);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}