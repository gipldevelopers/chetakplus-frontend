import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import OfferPopup from "@/components/OfferPopup";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PolicyPage from "./pages/PolicyPage";
import Wishlist from "./pages/Wishlist";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Corporate from "./pages/Corporate";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ["/signin", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <CartDrawer />}
      {!isAuthPage && <WhatsAppButton />}
      {!isAuthPage && <OfferPopup />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/privacy-policy" element={<PolicyPage />} />
          <Route path="/shipping-policy" element={<PolicyPage />} />
          <Route path="/refund-policy" element={<PolicyPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

const App = () =>
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;
