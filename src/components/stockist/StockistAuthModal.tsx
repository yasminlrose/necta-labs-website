'use client';

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Building2, Coffee } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

interface StockistAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "login" | "register" | "forgot";

const VENUE_TYPES = [
  "Cafe / Coffee Shop",
  "Gym / Fitness Studio",
  "Hotel / Spa",
  "Bar / Restaurant",
  "Wellness Retailer",
  "Office / Workplace",
  "Other",
];

const StockistAuthModal = ({ isOpen, onClose }: StockistAuthModalProps) => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactName, setContactName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [venueType, setVenueType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) { setError(""); setSuccess(""); }
  }, [isOpen, tab]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    if (!data.user?.user_metadata?.is_stockist) {
      setError("This portal is for approved stockists only. Please apply to become a stockist first.");
      await supabase.auth.signOut();
      return;
    }
    onClose();
    router.push("/stockist-portal");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueType) { setError("Please select a venue type."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: contactName,
          business_name: businessName,
          venue_type: venueType,
          is_stockist: true,
          stockist_status: "pending", // Requires approval
        },
      },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Account created! Please check your email to confirm, then our team will activate your portal access within 24 hours.");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/stockist-portal`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Reset link sent. Check your inbox.");
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors z-10">
            <X className="h-4 w-4 text-primary" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary leading-tight">
                  {tab === "login" ? "Stockist Login" : tab === "register" ? "Apply for Stockist Access" : "Reset Password"}
                </h2>
                <p className="text-xs text-primary/40">NECTA Wholesale Portal</p>
              </div>
            </div>

            {tab !== "forgot" && (
              <div className="flex bg-muted rounded-lg p-1 mb-6">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === t ? "bg-white text-primary shadow-sm" : "text-primary/50"}`}
                  >
                    {t === "login" ? "Sign in" : "Register"}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={tab === "login" ? handleLogin : tab === "register" ? handleRegister : handleForgotPassword}
              className="space-y-4"
            >
              {tab === "register" && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Business name"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Coffee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <select
                      value={venueType}
                      onChange={(e) => setVenueType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary focus:outline-none focus:border-primary/40 transition-colors appearance-none bg-white"
                    >
                      <option value="">Venue type</option>
                      {VENUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Business email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>

              {tab !== "forgot" && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              )}

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              {success && <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg leading-relaxed">{success}</p>}

              {!success && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {loading ? "Please wait…" : tab === "login" ? "Sign in to portal" : tab === "register" ? "Apply for access" : "Send reset email"}
                </button>
              )}
            </form>

            {tab === "login" && (
              <p className="text-center text-xs text-primary/40 mt-4">
                <button onClick={() => setTab("forgot")} className="hover:text-primary transition-colors">Forgot password?</button>
              </p>
            )}
            {tab === "forgot" && (
              <p className="text-center text-xs text-primary/40 mt-4">
                <button onClick={() => setTab("login")} className="hover:text-primary transition-colors">Back to sign in</button>
              </p>
            )}
            {tab !== "forgot" && (
              <p className="text-center text-xs text-primary/40 mt-3">
                {tab === "login" ? "Not yet a stockist? " : "Already approved? "}
                <button onClick={() => setTab(tab === "login" ? "register" : "login")} className="text-primary font-medium hover:underline">
                  {tab === "login" ? "Apply now" : "Sign in"}
                </button>
              </p>
            )}

            {tab === "register" && (
              <p className="text-xs text-primary/40 text-center mt-4 border-t border-border pt-4">
                Applications reviewed within 24 hours. You'll receive portal access once approved.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StockistAuthModal;
