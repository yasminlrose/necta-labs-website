import Header from "@/components/Header";
import WhatIsNectaSection from "@/components/WhatIsNectaSection";
import HeroSection from "@/components/HeroSection";
import BestSellersSection from "@/components/BestSellersSection";
import SocialProofSection from "@/components/SocialProofSection";
import BundleSection from "@/components/BundleSection";
import FeatureIconsSection from "@/components/FeatureIconsSection";
import BenefitTabsSection from "@/components/BenefitTabsSection";
import ReviewsSection from "@/components/ReviewsSection";
import SubscribeSection from "@/components/SubscribeSection";
import IngredientSpotlightsSection from "@/components/IngredientSpotlightsSection";
import CategoryCardsSection from "@/components/CategoryCardsSection";
import Footer from "@/components/Footer";
import EmailPopup from "@/components/EmailPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <WhatIsNectaSection />
        <HeroSection />
        <BestSellersSection />
        <SocialProofSection />
        <BundleSection />
        <FeatureIconsSection />
        <BenefitTabsSection />
        <ReviewsSection />
        <IngredientSpotlightsSection />
        <CategoryCardsSection />
        <SubscribeSection />
      </main>
      <Footer />
      <EmailPopup />
    </div>
  );
};

export default Index;
