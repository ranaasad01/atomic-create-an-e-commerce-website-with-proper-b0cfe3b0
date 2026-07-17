import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import { CartProvider } from "@/components/CartProvider";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "BazaarX — Shop Electronics, Fashion, Home & More",
  description:
    "BazaarX is your one-stop marketplace for Electronics, Fashion, Home & Kitchen, Books, and Sports. Discover thousands of products at unbeatable prices with fast US shipping.",
  keywords: "BazaarX, online shopping, electronics, fashion, home kitchen, books, sports, marketplace",
  openGraph: {
    title: "BazaarX — Shop Everything You Love",
    description: "Discover great deals on Electronics, Fashion, Home & Kitchen, Books, and Sports at BazaarX.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <LanguageToggle />
            </ToastProvider>
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}