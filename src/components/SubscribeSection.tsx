import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("email_signups")
      .insert({ email: email.trim(), source: "subscribe_section" });

    setLoading(false);
    if (error && error.code !== "23505") {
      setError("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  };

  return (
    <section className="py-16 md:py-20 bg-primary">
      <div className="necta-container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          SIGN UP NOW
        </h2>
        <p className="text-white/60 text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Subscribe to get special offers, free giveaways, and NECTA Labs content.
        </p>

        {done ? (
          <div className="flex items-center justify-center gap-3 text-white">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <p className="font-semibold">You're in — welcome to the community.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/35 focus:outline-none focus:border-white/50 text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3.5 rounded-lg text-sm hover:bg-white/90 transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {loading ? "Joining…" : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}
        {error && <p className="text-xs text-red-300 mt-3">{error}</p>}
        <p className="text-xs text-white/25 mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default SubscribeSection;
