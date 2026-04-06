'use client';

import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, count, subtotal, isOpen, closeCart, removeItem, updateQty } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[80] bg-white flex flex-col shadow-2xl transition-transform duration-350 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-primary text-lg">Your Basket</h2>
            {count > 0 && (
              <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Close basket"
          >
            <X className="h-5 w-5 text-primary" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-primary/20" />
              <p className="text-primary/50 font-medium">Your basket is empty</p>
              <p className="text-sm text-primary/35">Add a infusion to get started.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                      style={{ mixBlendMode: "multiply" }}
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-primary/40 uppercase tracking-wider">NECTA Labs</p>
                        <p className="font-bold text-primary text-sm">{item.name}</p>
                        <p className="text-xs text-primary/50 mt-0.5">{item.size}</p>
                        {item.mode === "subscribe" && (
                          <span className="inline-block mt-1 text-[10px] font-semibold bg-pink text-primary px-2 py-0.5 rounded-full">
                            Subscribe
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-primary/25 hover:text-primary transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3 text-primary" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3 text-primary" />
                        </button>
                      </div>
                      <p className="font-bold text-primary text-sm">
                        £{(item.price * item.quantity).toFixed(2)}
                        {item.mode === "subscribe" && <span className="font-normal text-primary/40">/mo</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary/60">Subtotal</span>
              <span className="font-bold text-primary">£{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-primary/40">Free UK delivery on subscriptions. Shipping calculated at checkout.</p>
            <button
              className="w-full bg-primary text-white font-semibold py-4 rounded-md hover:bg-primary/90 transition-colors text-sm"
              onClick={async () => {
                const subItems = items.filter((i) => i.mode === "subscribe");
                if (subItems.length > 0) {
                  const nextDate = new Date();
                  nextDate.setDate(nextDate.getDate() + 28);
                  const nextDateStr = nextDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                  for (const item of subItems) {
                    const slugMatch = item.slug?.match(/^(focus|immunity|calm|glow)/) ?? [];
                    const productSlug = (slugMatch[1] ?? "focus") as "focus" | "immunity" | "calm" | "glow";
                    await fetch("/api/send-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "subscription",
                        to: "", // filled by checkout — replace with real customer email when checkout is wired
                        data: {
                          firstName: "there",
                          productName: `NECTA ${item.name.replace(" (Bundle)", "")}`,
                          productSlug,
                          size: item.size,
                          amount: `£${(item.price * item.quantity).toFixed(2)}`,
                          nextChargeDate: nextDateStr,
                        },
                      }),
                    }).catch(() => null); // non-blocking
                  }
                }
              }}
            >
              Checkout — £{subtotal.toFixed(2)}
            </button>
            <button
              onClick={closeCart}
              className="w-full text-sm text-primary/50 hover:text-primary transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
