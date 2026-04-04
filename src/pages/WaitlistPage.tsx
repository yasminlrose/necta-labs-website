import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLiveCounters } from "@/hooks/use-live-counters";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { waitlistCount } = useLiveCounters();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("email_signups")
        .insert({ email: email.trim(), source: "waitlist" });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already on the list", description: "We'll be in touch soon." });
          setSubmitted(true);
          return;
        }
        throw error;
      }
      setSubmitted(true);
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="max-w-lg mx-auto px-6 text-center">
          {submitted ? (
            <div className="py-12">
              <div className="w-16 h-16 bg-necta-focus/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-necta-focus-dark" />
              </div>
              <h1 className="text-3xl md:text-4xl text-foreground mb-4">You're on the list</h1>
              <p className="text-foreground/50 text-lg leading-relaxed">
                We'll send you launch updates and early access details.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl text-foreground mb-4">
                Be first to try NECTA
              </h1>
              <p className="text-lg text-foreground/50 leading-relaxed mb-10">
                We're launching Summer 2026. Join the waitlist for early access, 20% off your first order, and exclusive updates.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-5 py-3 bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground"
                />
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>

              <p className="text-sm text-foreground/40 mb-10">
                Join {waitlistCount.toLocaleString()} others on the waitlist
              </p>

              <p className="text-xs text-foreground/30">
                No spam · Unsubscribe anytime · UK delivery only at launch
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WaitlistPage;