'use client';

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, Store, ArrowRight } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const BUSINESS_TYPES = [
  "Independent health food store",
  "Gym / fitness studio",
  "Yoga / pilates studio",
  "Spa / wellness centre",
  "Café / coffee shop",
  "Hotel / hospitality",
  "Pharmacy / chemist",
  "Online retailer",
  "Corporate wellness",
  "Other",
];

const StockistApplyPage = () => {
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    website: "",
    instagram: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    city: "",
    postcode: "",
    vatNumber: "",
    monthlyUnits: "",
    whyNecta: "",
    heardAbout: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/stockist-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Submission failed");
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please email hello@nectalabs.com");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <>
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
          <div className="max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-3">Application received</h1>
            <p className="text-primary/60 mb-2">
              Thank you for your interest in stocking NECTA Labs. We review every application personally.
            </p>
            <p className="text-sm text-primary/40 mb-8">
              You'll hear from us within 3–5 business days. In the meantime, feel free to reach out at{" "}
              <a href="mailto:hello@nectalabs.com" className="underline">hello@nectalabs.com</a>.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Back to NECTA Labs
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero */}
        <div className="bg-primary text-primary-foreground py-14 px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-foreground/80 mb-5">
            <Store className="h-3.5 w-3.5" />
            Wholesale & Stockist Programme
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Stock NECTA Labs</h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto text-base">
            We partner with independent wellness spaces, gyms, cafés, spas, and health retailers who share our values.
            Each application is reviewed personally — we only work with stockists we believe in.
          </p>
        </div>

        {/* What you get */}
        <div className="necta-container py-10">
          <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            {[
              { title: "Wholesale pricing", desc: "Competitive margins with tiered pricing as you scale" },
              { title: "Marketing support", desc: "Ready-made assets, product info, and co-marketing opportunities" },
              { title: "Founder access", desc: "Direct line to the founding team. We support our stockists." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-border rounded-2xl p-5 text-center">
                <p className="font-semibold text-primary text-sm mb-1">{item.title}</p>
                <p className="text-xs text-primary/50">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-primary mb-1">Apply to become a stockist</h2>
              <p className="text-sm text-primary/50 mb-6">
                We'll review your application and be in touch within 3–5 business days.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Business info */}
                <fieldset className="space-y-3">
                  <legend className="text-xs font-semibold text-primary/40 uppercase tracking-widest mb-2">Business details</legend>

                  <input
                    required
                    type="text"
                    placeholder="Business name *"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />

                  <select
                    required
                    value={form.businessType}
                    onChange={(e) => set("businessType", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary focus:outline-none focus:border-primary/40 transition-colors bg-white"
                  >
                    <option value="">Business type *</option>
                    {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="url"
                      placeholder="Website URL"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Instagram handle"
                      value={form.instagram}
                      onChange={(e) => set("instagram", e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      placeholder="City *"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Postcode *"
                      value={form.postcode}
                      onChange={(e) => set("postcode", e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="VAT number (if applicable)"
                    value={form.vatNumber}
                    onChange={(e) => set("vatNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </fieldset>

                {/* Contact info */}
                <fieldset className="space-y-3">
                  <legend className="text-xs font-semibold text-primary/40 uppercase tracking-widest mb-2">Contact details</legend>

                  <input
                    required
                    type="text"
                    placeholder="Your full name *"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address *"
                    value={form.contactEmail}
                    onChange={(e) => set("contactEmail", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={form.contactPhone}
                    onChange={(e) => set("contactPhone", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </fieldset>

                {/* Fit questions */}
                <fieldset className="space-y-3">
                  <legend className="text-xs font-semibold text-primary/40 uppercase tracking-widest mb-2">A bit more about you</legend>

                  <select
                    value={form.monthlyUnits}
                    onChange={(e) => set("monthlyUnits", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary focus:outline-none focus:border-primary/40 transition-colors bg-white"
                  >
                    <option value="">Estimated monthly units (optional)</option>
                    <option value="1-24">1–24 units</option>
                    <option value="25-99">25–99 units</option>
                    <option value="100-249">100–249 units</option>
                    <option value="250+">250+ units</option>
                  </select>

                  <textarea
                    required
                    placeholder="Why do you want to stock NECTA? Tell us about your customers and space. *"
                    value={form.whyNecta}
                    onChange={(e) => set("whyNecta", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  />

                  <input
                    type="text"
                    placeholder="How did you hear about NECTA Labs?"
                    value={form.heardAbout}
                    onChange={(e) => set("heardAbout", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </fieldset>

                {status === "error" && (
                  <p className="text-sm text-red-500">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm"
                >
                  {status === "loading" ? "Submitting…" : <>Submit application <ArrowRight className="h-4 w-4" /></>}
                </button>

                <p className="text-xs text-center text-primary/35">
                  By submitting you agree to us contacting you about your application.
                  We never share your details with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StockistApplyPage;
