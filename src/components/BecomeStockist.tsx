import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Coffee, Check, ArrowRight } from "lucide-react";

const benefits = [
  "Wholesale pricing from £18 per unit",
  "Free marketing materials",
  "Dedicated account manager",
  "Flexible ordering & delivery",
  "Staff training resources",
  "Exclusive early access to new products",
];

const BecomeStockist = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="stockist" className="py-24 bg-primary text-primary-foreground">
      <div className="necta-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-3">
              For Businesses
            </p>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Become a Stockist
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Join cafés, restaurants, hotels, and wellness spaces across the UK offering 
              functional drinks to their customers.
            </p>

            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-accent-foreground" />
                  </div>
                  <span className="text-primary-foreground/90">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Business Types */}
            <div className="flex flex-wrap gap-3">
              {["Cafés", "Restaurants", "Hotels", "Gyms", "Offices", "Spas"].map((type) => (
                <span key={type} className="px-4 py-2 bg-white/10 rounded-full text-sm">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-serif mb-2">Application Received!</h3>
                <p className="text-primary-foreground/70">
                  We'll be in touch within 48 hours to discuss your wholesale account.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-serif mb-6">Apply for Wholesale</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-primary-foreground/80">First Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-primary-foreground/80">Last Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-primary-foreground/80">Business Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-primary-foreground/80">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-primary-foreground/80">Business Type</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
                      <option value="">Select type</option>
                      <option value="cafe">Café / Coffee Shop</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                      <option value="gym">Gym / Fitness</option>
                      <option value="office">Office / Workplace</option>
                      <option value="spa">Spa / Wellness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-primary-foreground/80">Estimated Monthly Volume</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
                      <option value="">Select volume</option>
                      <option value="1-10">1-10 units</option>
                      <option value="11-25">11-25 units</option>
                      <option value="26-50">26-50 units</option>
                      <option value="50+">50+ units</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
                    Submit Application
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeStockist;