'use client';

import { useState } from "react";
import { Instagram, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import NectaLogo from "@/components/NectaLogo";
import { supabase } from "@/integrations/supabase/client";

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setAlreadyExists(false);

    // Check if email already exists
    const { data: existing } = await supabase
      .from("email_signups")
      .select("id")
      .eq("email", email.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      setLoading(false);
      setAlreadyExists(true);
      setDone(true);
      return;
    }

    const { error } = await supabase
      .from("email_signups")
      .insert({ email: email.trim(), source: "footer" });
    setLoading(false);
    if (error && error.code !== "23505") {
      setError("Something went wrong. Please try again.");
      return;
    }

    // Send newsletter welcome email
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "newsletter",
        to: email.trim(),
        data: { firstName: "" },
      }),
    }).catch(() => null); // non-blocking

    setDone(true);
  };

  return (
    <div className="border-b border-primary-foreground/10 py-14 md:py-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Text */}
        <div className="md:max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/40 mb-3">
            Sign up now
          </p>
          <p className="text-2xl md:text-3xl font-bold text-primary-foreground leading-tight">
            Subscribe for offers, giveaways &amp; NECTA content.
          </p>
        </div>

        {/* Form */}
        <div className="md:w-[420px] flex-shrink-0">
          {done ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground">{alreadyExists ? "You're already on the list!" : "You're in!"}</p>
                <p className="text-xs text-primary-foreground/50">{alreadyExists ? "We'll keep you posted." : "Welcome to the NECTA community."}</p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 min-w-0 px-4 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 text-sm text-primary-foreground placeholder:text-primary-foreground/35 focus:outline-none focus:border-primary-foreground/35 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 flex items-center gap-2 bg-primary-foreground text-primary font-bold px-5 py-3 rounded-full text-sm hover:bg-primary-foreground/90 transition-colors disabled:opacity-60"
                >
                  {loading ? "…" : <><span>Subscribe</span><ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
              </form>
              {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
              <p className="text-xs text-primary-foreground/25 mt-3">
                No spam. Unsubscribe any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="necta-container py-16">
        <EmailSignup />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14 pt-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5">
              <NectaLogo light />
            </div>
            <p className="text-sm text-primary-foreground/50 leading-relaxed max-w-xs">
              Organic functional infusions with clinically-dosed botanicals for your daily ritual.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com/necta_syrups"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com/@nectalabs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.84 4.84 0 01-1.01-.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop/focus", label: "FOCUS" },
                { href: "/shop/immunity", label: "IMMUNITY" },
                { href: "/shop/calm", label: "CALM" },
                { href: "/shop/glow", label: "GLOW" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Learn</h4>
            <ul className="space-y-3">
              {[
                { href: "/how-it-works", label: "How It Works" },
                { href: "/science", label: "The Science" },
                { href: "/about", label: "Our Story" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/stockist", label: "Become a Stockist" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@nectalabs.com"
                  className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/25">
            © 2026 NECTA GROUP LTD — Registered in England & Wales
          </p>
          <p className="text-xs text-primary-foreground/25">
            Organic functional infusions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
