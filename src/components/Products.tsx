import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, ChevronDown, ChevronUp } from "lucide-react";
import PumpBottle from "./PumpBottle";
import Sachet from "./Sachet";
type ProductVariant = "focus" | "immunity" | "calm" | "beauty";
type SachetDuration = 7 | 14 | 30 | 90;

interface ProductInfo {
  name: string;
  tagline: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  pump250: number;
  pump500: number;
  sachets: Record<SachetDuration, { subscription: number; oneTime: number }>;
}

const products: Record<ProductVariant, ProductInfo> = {
  focus: {
    name: "Focus",
    tagline: "Mental clarity & concentration",
    colorClass: "text-necta-focus",
    bgClass: "bg-necta-focus",
    borderClass: "border-necta-focus",
    pump250: 36,
    pump500: 50,
    sachets: {
      7: { subscription: 5, oneTime: 12 },
      14: { subscription: 10, oneTime: 25 },
      30: { subscription: 20, oneTime: 50 },
      90: { subscription: 60, oneTime: 150 },
    },
  },
  immunity: {
    name: "Immunity",
    tagline: "Immune support & vitality",
    colorClass: "text-necta-immunity",
    bgClass: "bg-necta-immunity",
    borderClass: "border-necta-immunity",
    pump250: 39,
    pump500: 54,
    sachets: {
      7: { subscription: 5.50, oneTime: 13 },
      14: { subscription: 11, oneTime: 27 },
      30: { subscription: 22, oneTime: 55 },
      90: { subscription: 66, oneTime: 165 },
    },
  },
  calm: {
    name: "Calm",
    tagline: "Relaxation & stress relief",
    colorClass: "text-necta-calm",
    bgClass: "bg-necta-calm",
    borderClass: "border-necta-calm",
    pump250: 33,
    pump500: 45,
    sachets: {
      7: { subscription: 4.50, oneTime: 11 },
      14: { subscription: 9, oneTime: 22 },
      30: { subscription: 18, oneTime: 45 },
      90: { subscription: 54, oneTime: 135 },
    },
  },
  beauty: {
    name: "Beauty",
    tagline: "Skin, hair & longevity",
    colorClass: "text-necta-beauty",
    bgClass: "bg-necta-beauty",
    borderClass: "border-necta-beauty",
    pump250: 43,
    pump500: 58,
    sachets: {
      7: { subscription: 6, oneTime: 14 },
      14: { subscription: 12, oneTime: 29 },
      30: { subscription: 24, oneTime: 60 },
      90: { subscription: 72, oneTime: 180 },
    },
  },
};

const sachetDurations: SachetDuration[] = [7, 14, 30, 90];

interface PreOrderModalProps {
  product: ProductInfo;
  onClose: () => void;
}

const PreOrderModal = ({ product, onClose }: PreOrderModalProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
            <p className="text-muted-foreground">We'll notify you when {product.name} is ready to ship.</p>
            <Button className="mt-6 rounded-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
            <p className="text-muted-foreground mb-6">Be the first to know when {product.name} is available.</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                required
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-full">Cancel</Button>
                <Button type="submit" className="flex-1 rounded-full">Notify Me</Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ variant }: { variant: ProductVariant }) => {
  const product = products[variant];
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState<"250ml" | "500ml">("500ml");
  const [selectedDuration, setSelectedDuration] = useState<SachetDuration>(30);
  const [isSubscription, setIsSubscription] = useState(true);
  const [productFormat, setProductFormat] = useState<"pump" | "sachet">("pump");
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const pumpPrice = selectedSize === "250ml" ? product.pump250 : product.pump500;

  const sachetPrice = isSubscription 
    ? product.sachets[selectedDuration].subscription 
    : product.sachets[selectedDuration].oneTime;

  const savings = product.sachets[selectedDuration].oneTime - product.sachets[selectedDuration].subscription;
  const savingsPercent = Math.round((savings / product.sachets[selectedDuration].oneTime) * 100);

  return (
    <>
      <div className={`bg-card rounded-2xl overflow-hidden border-2 ${showDetails ? product.borderClass : 'border-transparent'} transition-all product-card-hover shadow-sm`}>
        {/* Product Visual */}
        <div className={`${product.bgClass} aspect-[4/3] relative flex items-center justify-center p-6`}>
          {productFormat === "pump" ? (
            <PumpBottle variant={variant} size="lg" />
          ) : (
            <div className="flex gap-2 items-end">
              <Sachet variant={variant} size="md" className="transform -rotate-6" />
              <Sachet variant={variant} size="lg" />
              <Sachet variant={variant} size="md" className="transform rotate-6" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-foreground text-xs font-medium">Pre-Order</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>

          {/* Format Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setProductFormat("pump")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-full transition-colors ${
                productFormat === "pump" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Pump Bottle
            </button>
            <button
              onClick={() => setProductFormat("sachet")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-full transition-colors ${
                productFormat === "sachet" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Sachets
            </button>
          </div>

          {productFormat === "pump" ? (
            <>
              {/* Size Selection */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedSize("250ml")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-colors ${
                    selectedSize === "250ml" 
                      ? `${product.borderClass} bg-card` 
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <span className="block text-sm font-medium">250ml</span>
                  <span className="block text-xs text-muted-foreground">~50 servings</span>
                </button>
                <button
                  onClick={() => setSelectedSize("500ml")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-colors ${
                    selectedSize === "500ml" 
                      ? `${product.borderClass} bg-card` 
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <span className="block text-sm font-medium">500ml</span>
                  <span className="block text-xs text-muted-foreground">~100 servings</span>
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">£{pumpPrice.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <>
              {/* Subscription Toggle */}
              <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-xl">
                <div>
                  <span className="text-sm font-medium">Subscribe & Save</span>
                  {isSubscription && (
                    <span className="ml-2 text-xs bg-necta-focus text-foreground px-2 py-0.5 rounded-full">
                      Save {savingsPercent}%
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsSubscription(!isSubscription)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isSubscription ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isSubscription ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>

              {/* Duration Selection */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {sachetDurations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`py-2 px-1 rounded-xl border-2 transition-colors text-center ${
                      selectedDuration === duration 
                        ? `${product.borderClass} bg-card` 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <span className="block text-sm font-medium">{duration}</span>
                    <span className="block text-[10px] text-muted-foreground">days</span>
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold">£{sachetPrice.toFixed(2)}</span>
                  {isSubscription && (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      £{product.sachets[selectedDuration].oneTime.toFixed(2)}
                    </span>
                  )}
                  <span className="block text-xs text-muted-foreground">
                    {selectedDuration} sachets • £{(sachetPrice / selectedDuration).toFixed(2)}/day
                  </span>
                </div>
              </div>
            </>
          )}

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-full">
              Pre-Order Now
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-full"
              onClick={() => setShowNotifyModal(true)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify When Available
            </Button>
          </div>

          {/* Expand Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? "Hide Details" : "View Details"}
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Check className={`h-4 w-4 mt-0.5 ${product.colorClass}`} />
                <span>Arrives in 3-6 months</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className={`h-4 w-4 mt-0.5 ${product.colorClass}`} />
                <span>Free UK delivery on orders £30+</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className={`h-4 w-4 mt-0.5 ${product.colorClass}`} />
                <span>Cancel pre-order anytime</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className={`h-4 w-4 mt-0.5 ${product.colorClass}`} />
                <span>Science-backed formulation</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNotifyModal && (
        <PreOrderModal product={product} onClose={() => setShowNotifyModal(false)} />
      )}
    </>
  );
};

const Products = () => {
  return (
    <section id="products" className="py-24 bg-secondary/50">
      <div className="necta-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Shop the Range
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Four formulas, one goal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each formula targets specific wellness needs with traceable, science-backed ingredients.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard variant="focus" />
          <ProductCard variant="immunity" />
          <ProductCard variant="calm" />
          <ProductCard variant="beauty" />
        </div>

        {/* Pre-order Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-sm">
            <span className="text-sm text-foreground">
              <strong>Pre-Order Guarantee:</strong> Full refund if we don't ship within 6 months
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;