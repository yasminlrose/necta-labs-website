import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { ref, isVisible } = useScrollAnimation();

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
    <section ref={ref} id="waitlist" className="py-24 md:py-32 bg-background">
      <div className="necta-container">
        <div className={`max-w-xl mx-auto text-center scroll-fade-in ${isVisible ? "visible" : ""}`}>
          {submitted ? (
            <div className="py-8">
              <div className="w-16 h-16 bg-necta-focus/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-necta-focus-dark" />
              </div>
              <h3 className="text-2xl text-foreground mb-2">You're on the list</h3>
              <p className="text-foreground/50">We'll send you launch updates and early access.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
                Be first to try NECTA
              </h2>
              <p className="text-foreground/50 mb-10 text-lg leading-relaxed">
                Join the waitlist for early access and 20% off your first order.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-5 py-3 bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
              <p className="text-xs text-foreground/30 mt-6">
                No spam. Just launch updates.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;