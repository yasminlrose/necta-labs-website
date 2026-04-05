import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Shield, Leaf, CreditCard, Ban } from "lucide-react";
import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleGlow from "@/assets/bottle-glow.jpeg";

const VENUE_TYPES = ["Cafe", "Gym", "Yoga Studio", "Hotel/Spa", "Bar", "Office/Coworking", "Other"];
const DAILY_SALES = ["<50", "50-100", "100-200", "200+ cups"];
const PRODUCTS = ["FOCUS", "IMMUNITY", "CALM", "GLOW", "Not sure yet"];
const REFERRAL_SOURCES = ["Instagram", "Google", "Referral", "Trade Show", "Other"];

const WholesalePage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { ref: whyRef, isVisible: whyVisible } = useScrollAnimation();
  const { ref: pricingRef, isVisible: pricingVisible } = useScrollAnimation();
  const { ref: venueRef, isVisible: venueVisible } = useScrollAnimation();
  const { ref: includedRef, isVisible: includedVisible } = useScrollAnimation();
  const [formData, setFormData] = useState({
    business_name: "", venue_type: "", contact_name: "", email: "", phone: "",
    city: "", postcode: "", instagram_handle: "", website: "",
    daily_coffee_sales: "", referral_source: "", notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProduct = (product: string) => {
    setSelectedProducts(prev =>
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("wholesale_applications")
        .insert({ ...formData, products_interested: selectedProducts });
      if (error) throw error;
      setIsSubmitted(true);
      toast({ title: "Application Received! ✓", description: "We'll be in touch within 48 hours." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="pt-32 pb-20 md:pt-44 md:pb-28"
        style={{
          background: "linear-gradient(135deg, #B8DDD8 0%, #F2C4A8 100%)",
        }}
      >
        <div className="necta-container text-center max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-foreground leading-[1.15] mb-6">
            Stock NECTA. Elevate your offering.
          </h1>
          <p className="text-lg text-foreground/55 mb-10 max-w-lg mx-auto">
            Premium functional infusions your customers will love. 72% margins. Zero training required.
          </p>
          <Button onClick={scrollToForm} size="lg">
            Apply to Stock NECTA
          </Button>
        </div>
      </section>

      {/* Why Stock — 4 blocks */}
      <section ref={whyRef} className="py-28 bg-background">
        <div className="necta-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: "72%", title: "MARGINS", desc: "£22 wholesale → £35-40 retail" },
              { stat: "5s", title: "FITS YOUR WORKFLOW", desc: "Pump. Pour. Done in 5 seconds." },
              { stat: "37%", title: "CUSTOMERS WANT IT", desc: "37% already add infusions to their drinks" },
              { stat: "📸", title: "INSTAGRAM READY", desc: "Bottles designed to be photographed" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-muted p-8 rounded-2xl text-center scroll-fade-in ${whyVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-5xl font-heading font-extrabold text-primary mb-3">{item.stat}</div>
                <h3 className="text-lg font-heading font-extrabold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Range */}
      <section className="py-20 bg-muted">
        <div className="necta-container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground uppercase tracking-tight mb-12">
            FOUR PREMIUM BLENDS. ONE WHOLESALE PRICE.
          </h2>
          <div className="flex justify-center gap-6 flex-wrap mb-8">
            {[
              { img: bottleFocus, name: "FOCUS", flavor: "Vanilla Bean" },
              { img: bottleImmunity, name: "IMMUNITY", flavor: "Hazelnut & Orange" },
              { img: bottleCalm, name: "CALM", flavor: "Honey Caramel" },
              { img: bottleGlow, name: "GLOW", flavor: "Cherry Almond" },
            ].map((p) => (
              <div key={p.name} className="text-center">
                <img src={p.img} alt={p.name} className="h-40 w-auto object-contain mx-auto mb-3" />
                <p className="text-sm font-heading font-extrabold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.flavor}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Available in 250ml and 500ml pump bottles. Sachets are D2C exclusive.</p>
        </div>
      </section>

      {/* Pricing Table */}
      <section ref={pricingRef} className="py-28 bg-primary text-primary-foreground">
        <div className={`necta-container max-w-5xl mx-auto scroll-fade-in ${pricingVisible ? "visible" : ""}`}>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-center mb-16">
            WHOLESALE PRICING
          </h2>
          <div>
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-primary-foreground/20 text-xs font-bold tracking-widest uppercase">
              <span>FORMAT</span>
              <span className="text-center">WHOLESALE</span>
              <span className="text-center">SUGGESTED RETAIL</span>
              <span className="text-center">YOUR MARGIN</span>
            </div>
            {[
              ["250ML PUMP", "£22", "£35–40", "72%"],
              ["500ML PUMP", "£30", "£50–55", "69%"],
            ].map(([format, wholesale, retail, margin], i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-6 border-b border-primary-foreground/10 text-center">
                <span className="font-bold text-left">{format}</span>
                <span className="text-primary-foreground/70">{wholesale}</span>
                <span className="text-primary-foreground/70">{retail}</span>
                <span className="font-heading font-extrabold text-secondary text-2xl">{margin}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-xs text-primary-foreground/40 tracking-wider text-center">
            <p>MINIMUM ORDER: 6 BOTTLES (MIX & MATCH ALL 4 BLENDS)</p>
            <p>AVERAGE STOCKIST ORDER: £192/MONTH</p>
            <p>RESTOCK: MONTHLY RECOMMENDED • FREE POS MATERIALS WITH FIRST ORDER</p>
            <p>SACHETS NOT AVAILABLE FOR WHOLESALE (D2C CHANNEL EXCLUSIVE)</p>
          </div>
        </div>
      </section>

      {/* Who We Partner With */}
      <section ref={venueRef} className="py-24 bg-background">
        <div className="necta-container text-center">
          <h2 className={`text-3xl md:text-4xl font-heading font-extrabold text-foreground uppercase tracking-tight mb-12 scroll-fade-in ${venueVisible ? "visible" : ""}`}>
            PERFECT FOR
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { emoji: "☕", label: "Specialty Coffee Shops" },
              { emoji: "🧘", label: "Yoga Studios" },
              { emoji: "💪", label: "Gyms & Fitness" },
              { emoji: "🏨", label: "Boutique Hotels" },
              { emoji: "🍸", label: "Cocktail Bars" },
              { emoji: "🏢", label: "Corporate Offices" },
            ].map((venue, i) => (
              <div
                key={i}
                className={`text-center scroll-fade-in ${venueVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="text-4xl mb-3">{venue.emoji}</div>
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">{venue.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section ref={includedRef} className="py-24 bg-primary text-primary-foreground">
        <div className="necta-container">
          <h2 className={`text-3xl md:text-4xl font-heading font-extrabold text-center mb-16 scroll-fade-in ${includedVisible ? "visible" : ""}`}>
            WHAT'S INCLUDED
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "FREE POS MATERIALS",
                items: ["A5 table tents with QR codes", "Menu inserts (printable PDF)", "Shelf talkers with ingredient callouts"],
              },
              {
                title: "BARISTA RESOURCES",
                items: ["Quick-start guide", "Suggested drink pairings", "Customer FAQ sheet"],
              },
              {
                title: "ONGOING SUPPORT",
                items: ["Dedicated account manager", "Monthly restock reminders", "Social media features"],
              },
            ].map((block, i) => (
              <div
                key={i}
                className={`scroll-fade-in ${includedVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <h3 className="text-lg font-heading font-extrabold mb-4">{block.title}</h3>
                <ul className="space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="text-sm text-primary-foreground/70">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-28 bg-background">
        <div className="necta-container max-w-2xl mx-auto">
          {isSubmitted ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-4xl font-heading font-extrabold mb-4">APPLICATION RECEIVED</h2>
              <p className="text-lg text-muted-foreground">We'll be in touch within 48 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-center mb-4">
                APPLY TO BECOME A STOCKIST
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Premium venues only. Takes 2 minutes.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">BUSINESS NAME *</label>
                    <Input required value={formData.business_name} onChange={e => handleChange("business_name", e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">VENUE TYPE *</label>
                    <Select required onValueChange={v => handleChange("venue_type", v)}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {VENUE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">CONTACT NAME *</label>
                    <Input required value={formData.contact_name} onChange={e => handleChange("contact_name", e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">EMAIL *</label>
                    <Input required type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} className="rounded-xl" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">PHONE *</label>
                    <Input required type="tel" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">CITY *</label>
                    <Input required value={formData.city} onChange={e => handleChange("city", e.target.value)} className="rounded-xl" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">POSTCODE *</label>
                    <Input required value={formData.postcode} onChange={e => handleChange("postcode", e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wider uppercase mb-2 block">INSTAGRAM (OPTIONAL)</label>
                    <Input value={formData.instagram_handle} onChange={e => handleChange("instagram_handle", e.target.value)} className="rounded-xl" placeholder="@" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-wider uppercase mb-2 block">DAILY COFFEE SALES *</label>
                  <Select required onValueChange={v => handleChange("daily_coffee_sales", v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {DAILY_SALES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-wider uppercase mb-3 block">PRODUCTS INTERESTED *</label>
                  <div className="flex flex-wrap gap-3">
                    {PRODUCTS.map(p => (
                      <label key={p} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={selectedProducts.includes(p)} onCheckedChange={() => toggleProduct(p)} />
                        <span className="text-sm font-bold">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-wider uppercase mb-2 block">HOW DID YOU HEAR ABOUT US?</label>
                  <Select onValueChange={v => handleChange("referral_source", v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {REFERRAL_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-7 text-base font-bold tracking-wider uppercase shadow-bold"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                </Button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-muted">
        <div className="necta-container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Leaf, text: "Soil Association Organic Certified" },
              { icon: Shield, text: "Made in the UK" },
              { icon: CreditCard, text: "Net 30 Payment Terms Available" },
              { icon: Ban, text: "No Exclusivity Required" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <badge.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold text-foreground tracking-wider uppercase">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WholesalePage;
