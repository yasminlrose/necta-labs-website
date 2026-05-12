'use client';

import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  product: string;
  onSubmitted: () => void;
}

export default function WriteReviewForm({ product, onSubmitted }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (text.trim().length < 20) { setError('Review must be at least 20 characters.'); return; }

    setLoading(true);
    setError('');

    // Check if logged-in user has a pre_order for this product (verified purchase)
    let verifiedPurchase = false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data } = await supabase
          .from('pre_orders')
          .select('id')
          .eq('email', user.email)
          .ilike('product_slug', product)
          .limit(1)
          .single();
        verifiedPurchase = !!data;
      }
    } catch { /* non-blocking */ }

    const { error: insertError } = await supabase.from('product_reviews').insert({
      product,
      reviewer_name: name.trim(),
      reviewer_initial: name.trim()[0].toUpperCase(),
      rating,
      review_text: text.trim(),
      verified_purchase: verifiedPurchase,
      helpful_count: 0,
    });

    setLoading(false);
    if (insertError) {
      setError('Something went wrong. Please try again.');
      return;
    }

    setOpen(false);
    setRating(0);
    setName('');
    setText('');
    onSubmitted();
  };

  if (!open) {
    return (
      <div className="text-center mt-8">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-border text-primary text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-muted transition-colors"
        >
          <Star className="h-4 w-4" /> Write a review
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white border border-border rounded-2xl p-6 max-w-lg mx-auto">
      <h3 className="font-bold text-primary text-base mb-4">Write a review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star picker */}
        <div>
          <p className="text-xs font-medium text-primary/60 mb-1.5">Your rating</p>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="p-0.5"
              >
                <Star
                  className="h-7 w-7 transition-colors"
                  fill={(hover || rating) >= s ? 'hsl(var(--primary))' : 'none'}
                  stroke="hsl(var(--primary))"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-medium text-primary/60 mb-1 block">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah M."
            required
            className="w-full px-3 py-2.5 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Review text */}
        <div>
          <label className="text-xs font-medium text-primary/60 mb-1 block">Your review</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell others about your experience..."
            rows={4}
            required
            className="w-full px-3 py-2.5 border border-border rounded-xl text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-colors resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary/60 hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? 'Submitting…' : 'Submit review'}
          </button>
        </div>
      </form>
    </div>
  );
}
