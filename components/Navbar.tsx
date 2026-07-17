"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, User, Zap, Tag, Phone } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_NAME, categories, navLinks } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart, isOpen, closeCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: "route" | "anchor"
  ) => {
    if (type === "anchor") {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
      // else: let Next.js navigate to /#section naturally
    }
    // For route links: do nothing special — Next.js <Link> handles it
  };

  const secondaryNavItems = [
    { label: "Deals", href: "/deals", icon: Tag },
    { label: "About", href: "/about", icon: null },
    { label: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* Top bar */}
        <div className="bg-[var(--accent)] text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1 mr-4"
              aria-label={t("nav.logoAlt")}
            >
              <span className="font-display font-bold text-xl text-[var(--primary)] tracking-tight">
                {t("nav.brand")}
              </span>
            </Link>

            {/* Search bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center max-w-2xl"
            >
              <div className="flex w-full rounded-[var(--radius)] overflow-hidden border-2 border-[var(--primary)]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  className="flex-1 px-4 py-2 text-[var(--foreground)] text-sm bg-white outline-none"
                  aria-label={t("nav.searchPlaceholder")}
                />
                <button
                  type="submit"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-4 py-2 transition-colors"
                  aria-label={t("nav.searchButton")}
                >
                  <Search size={18} className="text-[var(--foreground)]" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-4 ml-4 flex-shrink-0">
              <Link
                href="/wishlist"
                className="flex flex-col items-center text-white hover:text-[var(--primary)] transition-colors"
                aria-label={t("nav.wishlist")}
              >
                <Heart size={20} />
                <span className="text-[10px] mt-0.5 hidden sm:block">{t("nav.wishlist")}</span>
              </Link>

              <button
                onClick={openCart}
                className="flex flex-col items-center text-white hover:text-[var(--primary)] transition-colors relative"
                aria-label={t("nav.cart")}
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 hidden sm:block">{t("nav.cart")}</span>
              </button>

              <Link
                href="/"
                className="flex flex-col items-center text-white hover:text-[var(--primary)] transition-colors hidden md:flex"
                aria-label="Account"
              >
                <User size={20} />
                <span className="text-[10px] mt-0.5">Account</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden text-white hover:text-[var(--primary)] transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom nav bar */}
        <div className="bg-[var(--foreground)] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1">
              {/* All Categories mega menu trigger */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors rounded-sm"
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                >
                  <Menu size={16} />
                  All Categories
                  <ChevronDown size={14} className={`transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 w-56 bg-white text-[var(--foreground)] shadow-xl rounded-b-lg border border-black/10 z-50 py-2"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      <div className="border-t border-black/5 mt-1 pt-1">
                        <Link
                          href="/shop"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                        >
                          View All Products
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Primary nav links from data */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={
                      link.type === "anchor"
                        ? pathname === "/"
                          ? link.href
                          : `/${link.href}`
                        : link.href
                    }
                    onClick={(e) => handleNavLinkClick(e, link.href, link.type)}
                    className={`px-3 py-2.5 text-sm transition-colors rounded-sm whitespace-nowrap ${
                      isActive
                        ? "text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Secondary nav items */}
              <div className="ml-auto flex items-center gap-1">
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1 px-3 py-2.5 text-sm transition-colors rounded-sm whitespace-nowrap ${
                      pathname === item.href
                        ? "text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon && <item.icon size={14} />}
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/deals"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold bg-[var(--primary)] text-[var(--foreground)] rounded-sm hover:bg-[var(--primary-hover)] transition-colors ml-1"
                >
                  <Zap size={14} />
                  Today's Deals
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-[var(--foreground)] text-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {/* Primary nav links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={
                      link.type === "anchor"
                        ? pathname === "/"
                          ? link.href
                          : `/${link.href}`
                        : link.href
                    }
                    onClick={(e) => {
                      handleNavLinkClick(e, link.href, link.type);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                      pathname === link.href
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  <Link
                    href="/search"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                      pathname === "/search"
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Search
                  </Link>
                  <Link
                    href="/deals"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                      pathname === "/deals"
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Deals & Offers
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                      pathname === "/wishlist"
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                      pathname === "/about"
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    About BazaarX
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                      pathname === "/contact"
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] font-semibold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Contact & Support
                  </Link>
                </div>

                {/* Category links */}
                <div className="border-t border-white/10 pt-2 mt-2">
                  <p className="px-3 py-1 text-xs font-semibold text-white/40 uppercase tracking-wider">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
