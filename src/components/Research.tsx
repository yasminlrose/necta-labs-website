import { FileText, Microscope, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const studies = [
  {
    title: "Ashwagandha & Stress Reduction",
    journal: "Journal of Clinical Medicine",
    finding: "Significantly reduced cortisol levels and improved stress resilience in a 60-day study.",
    year: "2019",
  },
  {
    title: "Lion's Mane Cognitive Benefits",
    journal: "Biomedical Research",
    finding: "Improved cognitive function in adults with mild cognitive impairment over 16 weeks.",
    year: "2020",
  },
  {
    title: "L-Theanine & Focus",
    journal: "Nutritional Neuroscience",
    finding: "Enhanced attention and focus when combined with caffeine in controlled trials.",
    year: "2021",
  },
  {
    title: "Marine Collagen & Skin Health",
    journal: "Journal of Cosmetic Dermatology",
    finding: "Improved skin elasticity and hydration after 8 weeks of supplementation.",
    year: "2022",
  },
];

const Research = () => {
  return (
    <section id="research" className="py-24 bg-background">
      <div className="necta-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Science-Backed
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            The research behind our formulas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every ingredient is selected based on peer-reviewed research and clinical studies.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "12", label: "Active Ingredients" },
            { value: "50+", label: "Studies Referenced" },
            { value: "100%", label: "Traceable Sources" },
            { value: "0", label: "Artificial Additives" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-xl">
              <div className="text-4xl font-serif text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Studies Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {studies.map((study, index) => (
            <div key={index} className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">{study.journal}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{study.year}</span>
                  </div>
                  <h3 className="text-lg font-serif text-foreground mb-2">{study.title}</h3>
                  <p className="text-sm text-muted-foreground">{study.finding}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" className="gap-2">
            <Microscope className="h-4 w-4" />
            View Full Research Library
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Research;