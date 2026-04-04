import { Star, Users, BadgeCheck, Leaf } from "lucide-react";

const stats = [
  { Icon: Users, value: "500+", label: "Daily Customers" },
  { Icon: Star, value: "4.8★", label: "Average Rating" },
  { Icon: BadgeCheck, value: "460+", label: "Verified Reviews" },
  { Icon: Leaf, value: "100%", label: "Natural Ingredients" },
];

const SocialProofSection = () => {
  return (
    <section
      className="py-12 md:py-14"
      style={{
        background: "linear-gradient(135deg, #D6EBEA 0%, #E0DAEF 33%, #F2DDD4 66%, #F0DEDA 100%)",
      }}
    >
      <div className="necta-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center mb-1">
                <Icon className="h-4.5 w-4.5 text-primary/70" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary">{value}</p>
              <p className="text-xs text-primary/60 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
