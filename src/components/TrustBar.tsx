import { FlaskConical, Leaf, MapPin, Truck, Shield } from "lucide-react";

const trustItems = [
  { icon: FlaskConical, text: "Science-backed" },
  { icon: Leaf, text: "100% Natural" },
  { icon: MapPin, text: "Made in UK" },
  { icon: Truck, text: "Free UK delivery £30+" },
  { icon: Shield, text: "Pre-order guarantee" },
];

const TrustBar = () => {
  return (
    <div className="bg-secondary py-4 overflow-hidden border-y border-border">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...trustItems, ...trustItems].map((item, index) => (
          <div key={index} className="flex items-center gap-2 mx-8">
            <item.icon className="h-4 w-4 text-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground uppercase tracking-wide">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;