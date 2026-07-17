"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, User } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_NAME, categories } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

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
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 hidden sm:block">{t("nav.cart")}</span>
              </button>

              <Link
                href="/cart"
                className="flex flex-col items-center text-white hover:text-[var(--primary)] transition-colors"
                aria-label={t("nav.account")}
              >
                <User size={20} />
                <span className="text-[10px] mt-0.5 hidden sm:block">{t("nav.account")}</span>
              </Link>

              <button
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={t("nav.menu")}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category nav bar */}
        <div className="bg-[var(--foreground)] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-1" aria-label={t("nav.categories")}>
              {/* All categories mega menu trigger */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium hover:bg-white/10 rounded transition-colors">
                  <Menu size={16} />
                  {t("nav.allCategories")}
                  <ChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 bg-[var(--surface)] text-[var(--foreground)] shadow-xl rounded-b-lg w-64 z-50 border border-[var(--border)] overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors border-b border-[var(--border)] last:border-0"
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs text-[var(--muted)]">
                            {cat.productCount.toLocaleString("en-US")}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct category links */}
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-2.5 text-sm font-medium hover:bg-white/10 rounded transition-colors whitespace-nowrap ${
                    pathname === `/category/${cat.slug}`
                      ? "text-[var(--primary)]"
                      : "text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                href="/shop"
                className={`px-3 py-2.5 text-sm font-medium hover:bg-white/10 rounded transition-colors ${
                  pathname === "/shop" ? "text-[var(--primary)]" : "text-white"
                }`}
              >
                {t("nav.allProducts")}
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[var(--accent)] text-white overflow-hidden"
            >
              <nav className="px-4 py-3 flex flex-col gap-1">
                <Link
                  href="/"
                  className="px-3 py-2 text-sm hover:bg-white/10 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  href="/shop"
                  className="px-3 py-2 text-sm hover:bg-white/10 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.shop")}
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="px-3 py-2 text-sm hover:bg-white/10 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/wishlist"
                  className="px-3 py-2 text-sm hover:bg-white/10 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.wishlist")}
                </Link>
                <Link
                  href="/cart"
                  className="px-3 py-2 text-sm hover:bg-white/10 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.cart")}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}