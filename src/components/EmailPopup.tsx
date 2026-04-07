import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionStorage.getItem("necta-popup-dismissed")) return;

    const timer = setTimeout(() => setIsOpen(true), 10000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem("necta-popup-dismissed")) {
        setIsOpen(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("necta-popup-dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("email_signups")
        .insert({ email: email.trim(), source: "popup" });

      if (error && error.code !== "23505") throw error;

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          to: email.trim(),
          data: { firstName: "" },
        }),
      }).catch(() => null);

      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-foreground/40 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-background text-foreground rounded-2xl p-8 md:p-10 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-foreground/40 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-medium text-foreground mb-2">You're on the list</h3>
            <p className="text-foreground/50 text-sm">We'll be in touch soon.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-medium text-foreground mb-2">
              Stay in the loop
            </h3>
            <p className="text-foreground/50 text-sm mb-6">
              Get exclusive offers and new product launches direct to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full px-5 py-3 bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
            <p className="text-xs text-foreground/30 mt-4 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailPopup;