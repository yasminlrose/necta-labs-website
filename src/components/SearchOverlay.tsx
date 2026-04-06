'use client';

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products, productSlugs } from "@/data/products";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const results = q
    ? productSlugs.filter((slug) => {
        const p = products[slug];
        return (
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.flavor.toLowerCase().includes(q) ||
          p.ingredients.some((i) => i.name.toLowerCase().includes(q))
        );
      })
    : productSlugs; // show all when no query

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full shadow-xl">
        {/* Search input */}
        <div className="necta-container">
          <div className="flex items-center gap-4 py-5">
            <Search className="h-5 w-5 text-primary/40 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, ingredients..."
              className="flex-1 text-lg text-primary placeholder:text-primary/30 bg-transparent outline-none"
            />
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              aria-label="Close search"
            >
              <X className="h-5 w-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-border">
          <div className="necta-container py-6">
            <p className="text-xs font-semibold text-primary/40 uppercase tracking-widest mb-4">
              {q ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "All products"}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.map((slug) => {
                  const p = products[slug];
                  return (
                    <Link
                      key={slug}
                      href={`/shop/${slug}`}
                      onClick={onClose}
                      className="group flex gap-3 items-center p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="relative w-14 h-14 rounded-md bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <Image
                          src={p.bottleImage}
                          alt={p.name}
                          fill
                          className="object-contain"
                          style={{ mixBlendMode: "multiply" }}
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-primary text-sm truncate">{p.name}</p>
                        <p className="text-xs text-primary/50 truncate">{p.flavor}</p>
                        <p className="text-xs font-semibold text-primary mt-1">from £{p.price250Sub}/mo</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-primary/40">No products found for "{query}"</p>
            )}

            {/* Quick links */}
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-2">
              {["Focus", "Immunity", "Calm", "Glow", "Sachets", "Subscribe & Save"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term.toLowerCase())}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:border-primary/30 text-primary/60 hover:text-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
