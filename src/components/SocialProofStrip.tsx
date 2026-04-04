const SocialProofStrip = () => {
  const reviews = [
    "★★★★★ Best functional infusion I've tried — Sarah M.",
    "★★★★★ Actually tastes good — Mike R.",
    "★★★★★ Feel the focus within 20 mins — Emma L.",
    "★★★★★ Game changer for my morning — James T.",
    "★★★★★ My skin is glowing — Lily W.",
  ];

  const repeated = [...reviews, ...reviews];

  return (
    <div className="bg-muted border-y border-border py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((review, i) => (
          <span key={i} className="mx-10 text-sm text-foreground/50">
            {review}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SocialProofStrip;