'use client';

import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

const SHIPPING_REGIONS = [
  { value: 'GB', label: '🇬🇧 United Kingdom', cost: 0,  display: 'Free' },
  { value: 'EU', label: '🇪🇺 Europe',          cost: 9,  display: '+£9' },
  { value: 'US', label: '🇺🇸 US / 🇨🇦 Canada', cost: 16, display: '+£16' },
  { value: 'AU', label: '🇦🇺 AU / 🇸🇬 Singapore', cost: 20, display: '+£20' },
];

const CartDrawer = () => {
  const { items, count, subtotal, isOpen, closeCart, removeItem, updateQty } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingRegion, setShippingRegion] = useState('');

  const shippingCost = SHIPPING_REGIONS.find(r => r.value === shippingRegion)?.cost ?? 0;
  const todayTotal = subtotal + shippingCost;

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/cart-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingRegion }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'No checkout URL');
      window.location.href = data.url;
    } catch (err) {
      console.error('[cart checkout]', err);
      alert('Checkout unavailable. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

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
                href="/pre-order"
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Pre-order now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <Image
                      src={typeof item.image === 'string' ? item.image : (item.image as unknown as { src: string }).src}
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
            {/* Shipping region selector — required */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block text-primary/40">
                {shippingRegion ? 'Shipping to' : '👇 Where are we shipping to?'}
              </label>
              <div className="relative">
                <select
                  value={shippingRegion}
                  onChange={e => setShippingRegion(e.target.value)}
                  className="w-full appearance-none rounded-lg border-2 px-3 py-2.5 text-sm font-medium pr-8 focus:outline-none transition-all"
                  style={{
                    borderColor: shippingRegion ? '#e5e7eb' : '#1E2D3D',
                    backgroundColor: shippingRegion ? '#f9fafb' : '#f3f4f6',
                    color: '#1E2D3D',
                  }}
                >
                  <option value="" disabled>Select your country / region…</option>
                  {SHIPPING_REGIONS.map(r => (
                    <option key={r.value} value={r.value}>
                      {r.label} — {r.display}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/40" />
              </div>
            </div>

            {/* Totals — only show after region selected */}
            {shippingRegion && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary/60">Deposits ({items.length} × £10)</span>
                  <span className="font-medium text-primary">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary/60">Shipping</span>
                  <span className="font-medium text-primary">{shippingCost === 0 ? 'Free' : `£${shippingCost}`}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-1 border-t border-border">
                  <span className="font-semibold text-primary">Today's total</span>
                  <span className="font-bold text-primary">£{todayTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <p className="text-[10px] text-primary/40">
              Product balance charged 1 Nov 2026 · Dispatches 17 Nov 2026
            </p>

            <button
              disabled={checkoutLoading || !shippingRegion}
              onClick={handleCheckout}
              className="w-full bg-primary text-white font-semibold py-4 rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'Redirecting…' : shippingRegion ? `Reserve all — £${todayTotal.toFixed(2)} today` : 'Select your region above →'}
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
