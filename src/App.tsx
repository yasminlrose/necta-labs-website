import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import Index from "./pages/Index";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import SachetProductPage from "./pages/SachetProductPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SciencePage from "./pages/SciencePage";
import AboutPage from "./pages/AboutPage";
import WholesalePage from "./pages/WholesalePage";
import WaitlistPage from "./pages/WaitlistPage";
import StockistPage from "./pages/StockistPage";
import IngredientPage from "./pages/IngredientPage";
import PreOrderPage from "./pages/PreOrderPage";
import PickAndMixPage from "./pages/PickAndMixPage";
import AccountPage from "./pages/AccountPage";
import StockistPortalPage from "./pages/StockistPortalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProductRouter() {
  const { slug } = useParams<{ slug: string }>();
  if (slug?.endsWith("-sachets")) return <SachetProductPage />;
  return <ProductPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:slug" element={<ProductRouter />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/science" element={<SciencePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/stockist" element={<StockistPage />} />
              <Route path="/wholesale" element={<Navigate to="/stockist" replace />} />
              <Route path="/ingredients/:slug" element={<IngredientPage />} />
              <Route path="/pre-order" element={<PreOrderPage />} />
              <Route path="/pick-and-mix" element={<PickAndMixPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/stockist-portal" element={<StockistPortalPage />} />
              <Route path="/become-a-stockist" element={<Navigate to="/stockist" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
