"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useTranslations } from "next-intl";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/data";

export default function CartDrawer() {
  const t = useTranslations();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--surface)] z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--accent)] text-white">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} />
                <h2 className="font-display font-semibold text-base">
                  {t("cart.title")} ({totalItems})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                aria-label={t("cart.close")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingCart size={48} className="text-[var(--border)]" />
                  <p className="text-[var(--muted)] text-sm">{t("cart.empty")}</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="bg-[var(--primary)] text-[var(--foreground)] px-6 py-2.5 rounded-[var(--radius)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    {t("cart.startShopping")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 pb-4 border-b border-[var(--border)] last:border-0"
                    >
                      <div className="w-16 h-16 rounded-[var(--radius)] overflow-hidden flex-shrink-0 border border-[var(--border)]">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--foreground)] line-clamp-2 leading-tight">
                          {item.product.name}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-xs text-[var(--muted)] mt-0.5">
                            {item.selectedVariant}
                          </p>
                        )}
                        <p className="text-sm font-bold text-[var(--foreground)] mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="px-2 py-1 hover:bg-[var(--background)] transition-colors"
                              aria-label={t("cart.decreaseQty")}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 py-1 text-xs font-medium min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="px-2 py-1 hover:bg-[var(--background)] transition-colors"
                              aria-label={t("cart.increaseQty")}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 text-[var(--muted)] hover:text-red-500 transition-colors"
                            aria-label={t("cart.remove")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[var(--foreground)]">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--background)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-[var(--muted)]">{t("cart.subtotal")}</span>
                  <span className="font-bold text-[var(--foreground)] text-base">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mb-3">{t("cart.taxNote")}</p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full bg-[var(--primary)] text-[var(--foreground)] py-3 rounded-[var(--radius)] text-sm font-bold text-center hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    {t("cart.proceedToCheckout")}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full border border-[var(--border)] text-[var(--foreground)] py-2.5 rounded-[var(--radius)] text-sm font-medium text-center hover:bg-[var(--background)] transition-colors"
                  >
                    {t("cart.viewCart")}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}