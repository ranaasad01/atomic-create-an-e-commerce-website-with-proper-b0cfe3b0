"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, Globe as Facebook, MessageCircle as Twitter, Briefcase as Linkedin, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { APP_NAME, footerLinks } from "@/lib/data";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const renderLink = (href: string, label: string) => {
    if (href.startsWith("#")) {
      const handleClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      };
      return (
        <Link
          href={pathname === "/" ? href : `/${href}`}
          onClick={handleClick}
          className="text-sm text-white/70 hover:text-[var(--primary)] transition-colors"
        >
          {label}
        </Link>
      );
    }
    return (
      <Link
        href={href}
        className="text-sm text-white/70 hover:text-[var(--primary)] transition-colors"
      >
        {label}
      </Link>
    );
  };

  return (
    <footer className="bg-[var(--accent)] text-white">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: t("footer.freeShipping"), sub: t("footer.freeShippingSub") },
              { icon: Shield, label: t("footer.securePay"), sub: t("footer.securePaySub") },
              { icon: RotateCcw, label: t("footer.easyReturns"), sub: t("footer.easyReturnsSub") },
              { icon: CreditCard, label: t("footer.allCards"), sub: t("footer.allCardsSub") },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-white/60">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8"
        >
          {/* Brand column */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <span className="font-display font-bold text-2xl text-[var(--primary)]">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-xs">
              {t("footer.tagline")}
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold mb-2">{t("footer.newsletter")}</p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-[var(--radius)] text-white placeholder-white/40 outline-none focus:border-[var(--primary)] transition-colors"
                  aria-label={t("footer.emailPlaceholder")}
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] text-sm font-semibold rounded-[var(--radius)] transition-colors flex-shrink-0"
                >
                  <Mail size={16} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Shop column */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              {t("footer.shopTitle")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </motion.div>

          {/* Account column */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              {t("footer.accountTitle")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </motion.div>

          {/* Help column */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              {t("footer.helpTitle")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </motion.div>

          {/* Company column — new */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                { label: "About BazaarX", href: "/about" },
                { label: "Contact & Support", href: "/contact" },
                { label: "Deals & Offers", href: "/deals" },
              ].map((link) => (
                <li key={link.href}>{renderLink(link.href, link.label)}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} {APP_NAME}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-white/50 hover:text-[var(--primary)] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-xs text-white/50 hover:text-[var(--primary)] transition-colors">
              Contact
            </Link>
            <Link href="/deals" className="text-xs text-white/50 hover:text-[var(--primary)] transition-colors">
              Deals
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
