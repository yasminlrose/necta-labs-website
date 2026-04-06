import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ReserveOrderModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productSlug: string;
  format: string;
  size: string;
  price: string;
}

const ReserveOrderModal = ({ open, onClose, productName, productSlug, format, size, price }: ReserveOrderModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Store pre-order
      const { error: preOrderError } = await supabase.from("pre_orders").insert({
        email: email.trim(),
        product_slug: productSlug,
        format,
        size,
        quantity: 1,
        status: "reserved",
      });
      if (preOrderError) throw preOrderError;

      // Also add to email signups
      await supabase.from("email_signups").insert({
        email: email.trim(),
        source: `reserve-${productSlug}-${format}`,
      });

      // Send pre-order confirmation email (Email 1)
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "preorder",
          to: email.trim(),
          data: {
            firstName: firstName.trim() || "there",
            productName: `NECTA ${productName}`,
            size,
            amount: price,
            dispatchDate: "Summer 2026",
          },
        }),
      });

      setDone(true);
      toast.success("Order reserved! Check your email for confirmation.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-background rounded-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground/40 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-4">✓</div>
            <h3 className="text-xl text-foreground mb-2">You're in!</h3>
            <p className="text-foreground/50 text-sm">
              We've reserved your {productName} {format}. We'll email you at launch with a link to complete your order.
            </p>
            <Button onClick={onClose} className="mt-6">Done</Button>
          </div>
        ) : (
          <>
            <h3 className="text-xl text-foreground mb-1">Reserve your order</h3>
            <p className="text-sm text-foreground/45 mb-6">
              No payment required now. We'll email you when {productName} is ready to ship.
            </p>

            <div className="bg-muted rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">{productName} — {size}</p>
                  <p className="text-xs text-foreground/45">{format === "subscription" ? "Monthly subscription" : "One-time purchase"}</p>
                </div>
                <span className="text-sm font-medium text-foreground">{price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-foreground/60 mb-1.5 block">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="text-sm text-foreground/60 mb-1.5 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Reserving…" : "Reserve your order"}
              </Button>

              <p className="text-xs text-foreground/35 text-center">
                Ships Summer 2026 · No charge until dispatch · Cancel anytime
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReserveOrderModal;
