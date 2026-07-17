"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MessageCircle, MapPin, Clock, ChevronDown, ChevronUp, Send, CheckCircle, Shield, Truck, RotateCcw, HelpCircle, Headphones } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  orderNumber: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Order Issue",
  "Return/Refund",
  "Product Question",
  "Technical Support",
  "Other",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number on our Order Tracking page or directly on the carrier's website (UPS, FedEx, or USPS) to get real-time updates on your delivery status.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy on most items. Products must be in their original condition and packaging. To initiate a return, visit your order history, select the item, and click 'Return Item'. We'll provide a prepaid shipping label at no cost to you.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3–5 business days. We offer free 2-day shipping on all orders over $49. Expedited (1-day) and same-day delivery options are available in select zip codes at checkout. Orders placed before 2 PM EST on business days ship the same day.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "You can modify or cancel your order within 1 hour of placing it by visiting your account's Order History page. After that window, the order enters our fulfillment pipeline and changes may not be possible. If the order has already shipped, you can initiate a return once it arrives.",
  },
  {
    question: "Do you offer price matching?",
    answer:
      "Yes! If you find the same product at a lower price on a major US retailer's website within 7 days of your purchase, we'll match it. Contact our support team with a link to the competitor's listing and your order number, and we'll process a price adjustment credit.",
  },
  {
    question: "How do I apply a promo code?",
    answer:
      "Promo codes can be entered at checkout in the 'Promo Code' field on the Order Summary panel. Click 'Apply' to see the discount reflected in your total before completing payment. Only one promo code can be used per order. Codes are case-insensitive.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. BazaarX uses industry-standard TLS 1.3 encryption for all data in transit. We are PCI DSS Level 1 compliant — the highest level of payment security certification. We never store your full card number on our servers; all payment processing is handled by Stripe.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us via live chat (average 2-minute response), email at support@bazaarx.com (within 24 hours), or by phone at 1-800-BAZAARX Monday through Friday, 8 AM to 8 PM EST. For urgent order issues, live chat is the fastest option.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuickContactCard({
  icon: Icon,
  title,
  detail,
  sub,
  href,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  sub: string;
  href?: string;
}) {
  const content = (
    <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-6 flex flex-col items-center text-center gap-3 cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
        <Icon size={22} className="text-[var(--accent)]" />
      </div>
      <div>
        <p className="font-semibold text-white text-base">{title}</p>
        <p className="text-[var(--primary)] font-medium text-sm mt-0.5">{detail}</p>
        <p className="text-white/60 text-xs mt-1">{sub}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]"
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--background)] transition-colors"
            aria-expanded={openIndex === idx}
          >
            <span className="font-semibold text-[var(--foreground)] text-sm md:text-base pr-4">
              {item.question}
            </span>
            {openIndex === idx ? (
              <ChevronUp size={18} className="text-[var(--primary)] flex-shrink-0" />
            ) : (
              <ChevronDown size={18} className="text-[var(--muted)] flex-shrink-0" />
            )}
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-5">
              <p className="text-[var(--muted)] text-sm leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.subject) newErrors.subject = "Please select a subject.";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClass =
    "border border-[var(--border)] rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white text-[var(--foreground)] text-sm transition-shadow";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section className="bg-[var(--accent)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[var(--primary)]/20 text-[var(--primary)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <Headphones size={15} />
                Customer Support
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                We&apos;re Here to Help
              </h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Our support team is available 24/7 to assist you with any questions, orders, or concerns.
              </p>
            </div>
          </Reveal>

          {/* Quick contact cards */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <QuickContactCard
                icon={MessageCircle}
                title="Live Chat"
                detail="Chat with us now"
                sub="Avg. response: 2 min"
              />
              <QuickContactCard
                icon={Mail}
                title="Email Support"
                detail="support@bazaarx.com"
                sub="Response within 24 hours"
                href="mailto:support@bazaarx.com"
              />
              <QuickContactCard
                icon={Phone}
                title="Phone Support"
                detail="1-800-BAZAARX"
                sub="Mon–Fri 8am–8pm EST"
                href="tel:18002292279"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Contact Form + Info ───────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)] mb-2 text-center">
              Send Us a Message
            </h2>
            <p className="text-[var(--muted)] text-center mb-10">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                        Message Sent!
                      </h3>
                      <p className="text-[var(--muted)] max-w-sm">
                        Thank you for reaching out, <strong>{formData.name}</strong>. Our team will respond to{" "}
                        <strong>{formData.email}</strong> within 24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", orderNumber: "", subject: "", message: "" });
                        }}
                        className="mt-2 px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--accent)] font-semibold rounded-lg transition-colors text-sm"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Jane Smith"
                            className={inputClass}
                          />
                          {errors.name && <p className={errorClass}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="jane@example.com"
                            className={inputClass}
                          />
                          {errors.email && <p className={errorClass}>{errors.email}</p>}
                        </div>
                      </div>

                      {/* Order Number */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                          Order Number{" "}
                          <span className="text-[var(--muted)] font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.orderNumber}
                          onChange={(e) => handleChange("orderNumber", e.target.value)}
                          placeholder="BZX-123456"
                          className={inputClass}
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Select a subject…</option>
                          {SUBJECT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {errors.subject && <p className={errorClass}>{errors.subject}</p>}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={5}
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Describe your issue or question in detail…"
                          className={`${inputClass} resize-none`}
                        />
                        {errors.message && <p className={errorClass}>{errors.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-[var(--accent)] font-bold py-3.5 rounded-lg transition-colors text-sm"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Right: Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <Reveal delay={0.1}>
                <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-6">
                  <h3 className="font-display font-bold text-[var(--foreground)] text-lg mb-4">
                    Contact Information
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={16} className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">Headquarters</p>
                        <p className="text-sm text-[var(--muted)]">410 Commerce Blvd, Suite 800<br />New York, NY 10001, USA</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail size={16} className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">Email</p>
                        <a href="mailto:support@bazaarx.com" className="text-sm text-[var(--primary)] hover:underline">
                          support@bazaarx.com
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone size={16} className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">Phone</p>
                        <a href="tel:18002292279" className="text-sm text-[var(--primary)] hover:underline">
                          1-800-BAZAARX
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock size={16} className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">Support Hours</p>
                        <p className="text-sm text-[var(--muted)]">
                          Mon–Fri: 8:00 AM – 8:00 PM EST<br />
                          Sat–Sun: 10:00 AM – 6:00 PM EST
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-6">
                  <h3 className="font-display font-bold text-[var(--foreground)] text-lg mb-4">
                    Response Times
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { channel: "Live Chat", time: "~2 minutes", color: "bg-green-500" },
                      { channel: "Phone", time: "~5 minutes", color: "bg-blue-500" },
                      { channel: "Email", time: "Within 24 hours", color: "bg-[var(--primary)]" },
                    ].map((item) => (
                      <li key={item.channel} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-sm text-[var(--foreground)]">{item.channel}</span>
                        </div>
                        <span className="text-sm font-semibold text-[var(--muted)]">{item.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-[var(--accent)] rounded-2xl p-6 text-white">
                  <HelpCircle size={24} className="text-[var(--primary)] mb-3" />
                  <h3 className="font-display font-bold text-lg mb-1">Need Immediate Help?</h3>
                  <p className="text-white/70 text-sm mb-4">
                    For urgent order issues, our live chat team is standing by 24/7.
                  </p>
                  <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--accent)] font-bold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    Start Live Chat
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FAQ Accordion ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[var(--primary)]/15 text-[var(--primary)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <HelpCircle size={15} />
                FAQ
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-[var(--muted)] max-w-xl mx-auto">
                Find quick answers to the most common questions about shopping at BazaarX.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <FaqAccordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      {/* ── 4. Store Policies ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-[var(--foreground)] mb-3">
                Our Store Policies
              </h2>
              <p className="text-[var(--muted)] max-w-xl mx-auto">
                Transparent, customer-first policies designed to give you complete peace of mind.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: RotateCcw,
                title: "Return Policy",
                description:
                  "30-day hassle-free returns on most items. No questions asked. We'll even cover the return shipping label.",
                cta: "Learn More",
                href: "/shop",
              },
              {
                icon: Truck,
                title: "Shipping Policy",
                description:
                  "Free 2-day shipping on orders over $49. Same-day dispatch on orders placed before 2 PM EST on business days.",
                cta: "View Details",
                href: "/shop",
              },
              {
                icon: Shield,
                title: "Privacy Policy",
                description:
                  "Your personal data is always protected. We use bank-grade encryption and never sell your information to third parties.",
                cta: "Read Policy",
                href: "/shop",
              },
            ].map((policy, idx) => (
              <Reveal key={policy.title} delay={idx * 0.1}>
                <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 flex flex-col items-start h-full">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 flex items-center justify-center mb-5">
                    <policy.icon size={22} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="font-display font-bold text-[var(--foreground)] text-xl mb-3">
                    {policy.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed flex-1 mb-5">
                    {policy.description}
                  </p>
                  <Link
                    href={policy.href}
                    className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors inline-flex items-center gap-1"
                  >
                    {policy.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Live Chat CTA ─────────────────────────────────────────────── */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <Headphones size={40} className="text-[var(--accent)] mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--accent)] mb-3">
              Still Need Help?
            </h2>
            <p className="text-[var(--accent)]/80 text-lg mb-8">
              Start a live chat with our support team — we&apos;re online 24/7 and ready to assist you right now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--foreground)] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm">
                <MessageCircle size={18} />
                Start Live Chat
              </button>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-[var(--accent)] font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
              >
                Browse Products
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
