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
import { DataProvider } from "@/context/DataContext";
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

import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHeroList from "./pages/admin/AdminHeroList";
import AdminHeroForm from "./pages/admin/AdminHeroForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminProductDetail from "./pages/admin/AdminProductDetail";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerDetail from "./pages/admin/AdminCustomerDetail";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPaymentDetail from "./pages/admin/AdminPaymentDetail";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminContactDetail from "./pages/admin/AdminContactDetail";
import AdminSettings from "./pages/admin/AdminSettings";
const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuthPage = ["/signin", "/signup", "/forgot-password", "/admin/login"].includes(location.pathname);
  const hideCustomerUI = isAuthPage || isAdmin;

  return (
    <>
      <ScrollToTop />
      {!hideCustomerUI && <Navbar />}
      {!hideCustomerUI && <CartDrawer />}
      {!hideCustomerUI && <WhatsAppButton />}
      {!hideCustomerUI && <OfferPopup />}
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

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hero" element={<AdminHeroList />} />
            <Route path="hero/new" element={<AdminHeroForm />} />
            <Route path="hero/:heroId/edit" element={<AdminHeroForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/new" element={<AdminCategoryForm />} />
            <Route path="categories/:categoryId/edit" element={<AdminCategoryForm />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminAddProduct />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderId" element={<AdminOrderDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:customerId" element={<AdminCustomerDetail />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="payments/:paymentId" element={<AdminPaymentDetail />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="contacts/:contactId" element={<AdminContactDetail />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideCustomerUI && <Footer />}
    </>
  );
};

const App = () =>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </DataProvider>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;
