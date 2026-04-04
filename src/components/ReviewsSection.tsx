import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviews = [
  {
    name: "Amara T.",
    product: "FOCUS",
    rating: 5,
    text: "I add it to my morning coffee and the difference in concentration is genuinely noticeable. No jitteriness, just clean mental clarity. I'm on my third bottle.",
    verified: true,
  },
  {
    name: "James K.",
    product: "CALM",
    rating: 5,
    text: "Finally something that takes the edge off without making me sleepy. I use it in herbal tea before bed and my sleep quality has completely changed.",
    verified: true,
  },
  {
    name: "Sophie R.",
    product: "GLOW",
    rating: 5,
    text: "My skin looks so much better after 6 weeks. I was sceptical about collagen supplements but the cherry almond flavour is amazing and the results speak for themselves.",
    verified: true,
  },
  {
    name: "Priya M.",
    product: "IMMUNITY",
    rating: 5,
    text: "I work in a school and used to catch every bug going. Since adding IMMUNITY to my daily coffee I haven't had a sick day. The hazelnut orange flavour is genuinely delicious.",
    verified: true,
  },
  {
    name: "Daniel F.",
    product: "FOCUS",
    rating: 5,
    text: "As a freelancer, cognitive performance is everything. FOCUS has become non-negotiable. The vanilla bean flavour in a flat white is perfection.",
    verified: true,
  },
];

const ReviewsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  // Show 3 reviews at a time on desktop
  const visible = [
    reviews[current % reviews.length],
    reviews[(current + 1) % reviews.length],
    reviews[(current + 2) % reviews.length],
  ];

  return (
    <section className="py-16 md:py-20 bg-pink">
      <div className="necta-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">What our customers say</h2>
            <div className="flex items-center gap-2 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
              <span className="text-sm font-semibold text-primary">4.8 · 460+ reviews</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary flex items-center justify-center text-primary transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary flex items-center justify-center text-primary transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {visible.map((review, i) => (
            <div key={`${review.name}-${i}`} className="bg-white rounded-xl p-6 flex flex-col gap-4">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              {/* Text */}
              <p className="text-sm text-primary/80 leading-relaxed flex-1">"{review.text}"</p>
              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">{review.name}</p>
                  <p className="text-xs text-primary/50">{review.product} · Verified buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-primary/20"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
