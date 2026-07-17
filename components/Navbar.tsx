"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, User, Zap, Tag, Phone, LogOut, Package, Settings } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_NAME, categories, navLinks } from "@/lib/data";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart, isOpen, closeCart } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserDropdownOpen]);

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
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    router.push("/");
  };

  const getUserInitial = () => {
    if (!user) return "";
    return (user.name || user.email || "U").charAt(0).toUpperCase();
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
              aria-label="BazaarX Home"
            >
              <span className="font-display font-bold text-xl text-[var(--primary)] tracking-tight">
                {APP_NAME}
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
                  placeholder="Search products, brands, categories..."
                  className="flex-1 px-4 py-2 text-[var(--foreground)] text-sm bg-white outline-none"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-4 py-2 transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} className="text-[var(--foreground)]" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Auth UI */}
              {user ? (
                /* Logged-in: avatar + dropdown */
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 focus:outline-none"
                    aria-label="User menu"
                    aria-expanded={isUserDropdownOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center font-bold text-[var(--foreground)] text-sm select-none">
                      {getUserInitial()}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-white/70 transition-transform duration-200 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-[var(--radius)] shadow-lg border border-[var(--border)] overflow-hidden z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
                          <p className="text-xs text-[var(--muted)] truncate">Signed in as</p>
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                            {user.name || user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                          >
                            <Settings size={15} className="text-[var(--muted)]" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                          >
                            <Package size={15} className="text-[var(--muted)]" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                          >
                            <Heart size={15} className="text-[var(--muted)]" />
                            Wishlist
                          </Link>
                        </div>

                        {/* Divider + Sign Out */}
                        <div className="border-t border-[var(--border)] py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Not logged in: Sign In + Sign Up */
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/auth/signin"
                    className="text-xs font-medium text-white border border-white/50 hover:border-white px-3 py-1.5 rounded-[var(--radius)] transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-xs font-bold text-[var(--foreground)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-3 py-1.5 rounded-[var(--radius)] transition-colors whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:flex items-center gap-1 text-white/80 hover:text-white transition-colors p-1.5"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1 text-white/80 hover:text-white transition-colors p-1.5"
                aria-label={`Cart, ${totalItems} items`}
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-1.5 text-white/80 hover:text-white transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary nav (categories bar) */}
        <div className="bg-[var(--foreground)] text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1">
              {/* All Categories mega menu trigger */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors rounded-sm">
                  <Menu size={16} />
                  All Categories
                  <ChevronDown size={14} className={`transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isMegaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full w-56 bg-white shadow-xl border border-[var(--border)] rounded-b-[var(--radius)] z-50 py-2"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] hover:text-[var(--primary)] transition-colors"
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs text-[var(--muted)]">{cat.productCount}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category quick links */}
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors rounded-sm whitespace-nowrap ${
                    pathname === `/category/${cat.slug}` ? "text-[var(--primary)]" : "text-white/90"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="flex-1" />

              {/* Secondary items */}
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors rounded-sm ${
                    pathname === item.href ? "text-[var(--primary)]" : "text-white/80"
                  }`}
                >
                  {item.icon && <item.icon size={14} />}
                  {item.label}
                </Link>
              ))}
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
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {/* Mobile search */}
                <form onSubmit={handleSearchSubmit} className="mb-3">
                  <div className="flex rounded-[var(--radius)] overflow-hidden border-2 border-[var(--primary)]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 px-3 py-2 text-[var(--foreground)] text-sm bg-white outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[var(--primary)] px-3 py-2"
                    >
                      <Search size={16} className="text-[var(--foreground)]" />
                    </button>
                  </div>
                </form>

                {/* Auth links in mobile menu */}
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-1 bg-white/5 rounded-[var(--radius)]">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center font-bold text-[var(--foreground)] text-sm">
                        {getUserInitial()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.name || "My Account"}</p>
                        <p className="text-xs text-white/60 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/90 hover:text-[var(--primary)] hover:bg-white/5 rounded-[var(--radius)] transition-colors"
                    >
                      <Settings size={15} /> My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/90 hover:text-[var(--primary)] hover:bg-white/5 rounded-[var(--radius)] transition-colors"
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded-[var(--radius)] transition-colors w-full text-left"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <Link
                      href="/auth/signin"
                      className="flex-1 text-center text-sm font-medium text-white border border-white/40 hover:border-white px-3 py-2 rounded-[var(--radius)] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="flex-1 text-center text-sm font-bold text-[var(--foreground)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-3 py-2 rounded-[var(--radius)] transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-white/10 my-2" />

                {/* Category links */}
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-1">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`px-3 py-2.5 text-sm rounded-[var(--radius)] transition-colors ${
                      pathname === `/category/${cat.slug}`
                        ? "text-[var(--primary)] bg-white/5"
                        : "text-white/90 hover:text-[var(--primary)] hover:bg-white/5"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}

                {/* Divider */}
                <div className="border-t border-white/10 my-2" />

                {/* Other nav links */}
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:text-[var(--primary)] hover:bg-white/5 rounded-[var(--radius)] transition-colors"
                  >
                    {item.icon && <item.icon size={14} />}
                    {item.label}
                  </Link>
                ))}

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/80 hover:text-[var(--primary)] hover:bg-white/5 rounded-[var(--radius)] transition-colors"
                >
                  <Heart size={14} /> Wishlist
                </Link>
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
