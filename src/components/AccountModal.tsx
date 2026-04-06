'use client';

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, LogOut, LayoutDashboard, Package, CreditCard, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "login" | "register" | "forgot";

const AccountModal = ({ isOpen, onClose }: AccountModalProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess("");
      setEmail("");
      setPassword("");
      setName("");
    }
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    onClose();
    router.push("/account");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Account created! Check your email to confirm.");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Password reset email sent. Check your inbox.");
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const goToDashboard = (tabId?: string) => {
    onClose();
    router.push(tabId ? `/account?tab=${tabId}` : "/account");
  };

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-primary" />
          </button>

          {user ? (
            /* ── Logged-in state ── */
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 mx-auto">
                <span className="text-lg font-bold text-white">
                  {((user.user_metadata?.full_name as string)?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-primary text-center mb-1">
                {(user.user_metadata?.full_name as string) || "My Account"}
              </h2>
              <p className="text-sm text-primary/50 text-center mb-6 truncate">{user.email}</p>

              <div className="space-y-2 mb-6">
                {[
                  { label: "My Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, tab: undefined },
                  { label: "My Subscriptions", icon: <Package className="h-4 w-4" />, tab: "subscriptions" },
                  { label: "Billing & Payment", icon: <CreditCard className="h-4 w-4" />, tab: "billing" },
                  { label: "Account Settings", icon: <Settings className="h-4 w-4" />, tab: "settings" },
                ].map(({ label, icon, tab: tabId }) => (
                  <button
                    key={label}
                    onClick={() => goToDashboard(tabId)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <span className="text-primary/40 group-hover:text-primary transition-colors">{icon}</span>
                    <span className="text-sm font-medium text-primary flex-1 text-left">{label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm font-medium text-primary/60 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          ) : (
            /* ── Auth forms ── */
            <div className="p-8">
              <h2 className="text-xl font-bold text-primary text-center mb-6">
                {tab === "login" ? "Welcome back" : tab === "register" ? "Create account" : "Reset password"}
              </h2>

              {tab !== "forgot" && (
                <div className="flex bg-muted rounded-lg p-1 mb-6">
                  {(["login", "register"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        tab === t ? "bg-white text-primary shadow-sm" : "text-primary/50"
                      }`}
                    >
                      {t === "login" ? "Sign in" : "Register"}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={
                  tab === "login" ? handleLogin
                  : tab === "register" ? handleRegister
                  : handleForgotPassword
                }
                className="space-y-4"
              >
                {tab === "register" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
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
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                  </div>
                )}

                {error && <p className="text-xs text-red-500">{error}</p>}
                {success && <p className="text-xs text-green-600">{success}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {loading
                    ? "Please wait…"
                    : tab === "login"
                    ? "Sign in"
                    : tab === "register"
                    ? "Create account"
                    : "Send reset email"}
                </button>
              </form>

              {tab === "login" && (
                <p className="text-center text-xs text-primary/40 mt-4">
                  <button
                    onClick={() => setTab("forgot")}
                    className="hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </p>
              )}

              {tab === "forgot" && (
                <p className="text-center text-xs text-primary/40 mt-4">
                  <button onClick={() => setTab("login")} className="hover:text-primary transition-colors">
                    Back to sign in
                  </button>
                </p>
              )}

              {tab !== "forgot" && (
                <p className="text-center text-xs text-primary/40 mt-4">
                  {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setTab(tab === "login" ? "register" : "login")}
                    className="text-primary font-medium hover:underline"
                  >
                    {tab === "login" ? "Register" : "Sign in"}
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountModal;
