"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Package, Star, Award, Heart, Truck, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2.4M+", label: "Happy Customers", icon: Users },
  { value: "50K+", label: "Products", icon: Package },
  { value: "5", label: "Categories", icon: Award },
  { value: "99.2%", label: "Satisfaction Rate", icon: Star },
];

const VALUES = [
  {
    icon: Heart,
    title: "Customer First",
    body:
      "Every decision we make starts with our customers. From our return policy to our product curation, we put your experience above everything else. Your satisfaction is our north star.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    body:
      "We rigorously vet every product before it reaches our shelves. Authentic brands, accurate descriptions, and honest reviews — no counterfeits, no surprises, just quality you can trust.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable",
    body:
      "We know you don't want to wait. That's why we've built a logistics network that delivers most orders in two business days or less, with real-time tracking every step of the way.",
  },
];

const TEAM = [
  {
    initials: "SC",
    name: "Sarah Chen",
    role: "CEO & Founder",
    color: "bg-[var(--primary)]",
    bio: "Former Amazon product lead with 12 years in e-commerce. Sarah founded BazaarX to bring big-marketplace quality to an independent, customer-obsessed platform.",
  },
  {
    initials: "MJ",
    name: "Marcus Johnson",
    role: "Head of Operations",
    color: "bg-[var(--accent)]",
    bio: "Supply-chain veteran who previously scaled fulfillment at two Fortune 500 retailers. Marcus ensures every order ships on time, every time.",
  },
  {
    initials: "PP",
    name: "Priya Patel",
    role: "Chief Technology Officer",
    color: "bg-emerald-600",
    bio: "Full-stack engineer and former Google SWE. Priya leads the team building the fast, reliable, and secure platform that powers BazaarX.",
  },
  {
    initials: "DK",
    name: "David Kim",
    role: "Head of Customer Experience",
    color: "bg-violet-600",
    bio: "Customer-experience specialist with a passion for turning support interactions into loyalty moments. David's team is available 24/7 to help you.",
  },
];

const TRUST_FEATURES = [
  "Free 2-day shipping on orders over $49",
  "30-day hassle-free returns",
  "Secure, encrypted checkout",
  "24/7 customer support",
  "Price match guarantee",
  "100% authentic products only",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[var(--accent)] overflow-hidden">
        {/* Decorative shapes */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-[var(--primary)]/8 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--primary)]/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-[var(--primary)] font-semibold uppercase tracking-widest text-sm mb-4"
          >
            Our Story
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Building the Future of
            <br />
            <span className="text-[var(--primary)]">American Commerce</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            BazaarX was born from a simple belief: shopping online should be
            fast, fair, and trustworthy. We're on a mission to deliver quality
            products to every American doorstep — at prices that make sense.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-[var(--primary)] text-white hover:text-[var(--primary)] font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Mission Statement ─────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <span
              aria-hidden
              className="block font-display text-8xl text-[var(--primary)] leading-none mb-2 select-none"
            >
              &ldquo;
            </span>
            <p className="font-display text-2xl md:text-3xl font-semibold text-[var(--foreground)] leading-snug mb-6">
              We believe everyone deserves access to quality products at fair
              prices, delivered with care.
            </p>
            <span
              aria-hidden
              className="block font-display text-8xl text-[var(--primary)] leading-none mt-2 select-none rotate-180"
            >
              &ldquo;
            </span>
            <p className="mt-4 text-[var(--muted)] font-medium tracking-wide">
              — The BazaarX Team
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 3. Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--accent)] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
              BazaarX by the Numbers
            </h2>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[var(--primary)]" />
                </div>
                <p className="font-display text-4xl font-bold text-[var(--primary)] mb-1">
                  {value}
                </p>
                <p className="text-white/70 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Our Values ────────────────────────────────────────────────── */}
      <section className="bg-[var(--background)] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[var(--primary)] font-semibold uppercase tracking-widest text-sm mb-2">
                What We Stand For
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                Our Values
              </h2>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {VALUES.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                className="bg-white rounded-xl p-8 shadow-[var(--shadow-card)] flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="text-[var(--muted)] leading-relaxed text-sm">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. Team ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[var(--primary)] font-semibold uppercase tracking-widest text-sm mb-2">
                The People Behind BazaarX
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                Meet the Team
              </h2>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {TEAM.map(({ initials, name, role, color, bio }) => (
              <motion.div
                key={name}
                variants={staggerItem}
                className="flex flex-col items-center text-center gap-4 bg-[var(--background)] rounded-xl p-6 shadow-[var(--shadow-card)]"
              >
                <div
                  className={`w-20 h-20 rounded-full ${color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="font-display text-2xl font-bold text-white">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-[var(--foreground)] text-lg">
                    {name}
                  </p>
                  <p className="text-[var(--primary)] text-sm font-semibold mb-2">
                    {role}
                  </p>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 6. Trust Section ─────────────────────────────────────────────── */}
      <section className="bg-[var(--background)] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[var(--primary)] font-semibold uppercase tracking-widest text-sm mb-2">
                Why BazaarX
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                Why Customers Choose BazaarX
              </h2>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {TRUST_FEATURES.map((feature) => (
              <motion.div
                key={feature}
                variants={staggerItem}
                className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-[var(--shadow-card)]"
              >
                <CheckCircle
                  size={20}
                  className="text-[var(--primary)] flex-shrink-0"
                />
                <span className="text-[var(--foreground)] font-medium text-sm">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-[var(--primary)] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Reveal>
            <Zap
              size={40}
              className="text-[var(--foreground)] mx-auto mb-4 opacity-80"
            />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-[var(--foreground)]/70 text-lg mb-8 max-w-xl mx-auto">
              Join 2.4 million happy customers and discover thousands of
              products at unbeatable prices.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--accent)] text-white font-bold px-10 py-4 rounded-lg transition-colors text-lg"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
