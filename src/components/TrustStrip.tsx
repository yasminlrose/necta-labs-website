const TrustStrip = () => {
  const items = [
    "Soil Association Certifiable",
    "Research-Backed Doses",
    "UK Made",
    "Zero Refined Sugar",
    "70%+ Organic",
  ];

  return (
    <div className="bg-muted border-y border-border py-5">
      <div className="necta-container">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map((item, i) => (
            <span key={i} className="text-sm text-foreground/40">
              {item}
              {i < items.length - 1 && <span className="ml-8 text-foreground/15">·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;