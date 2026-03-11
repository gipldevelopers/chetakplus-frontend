import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Lock, Shield, CreditCard, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate("/shop");
    }
  }, [items, navigate, isProcessing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment / network request
    setTimeout(() => {
      clearCart();
      toast.success("Order Placed Successfully!", {
        description: "You'll receive an email confirmation containing your order details.",
      });
      navigate("/");
    }, 2000);
  };

  if (items.length === 0 && !isProcessing) {
    return null; // Will redirect via useEffect
  }

  const tax = totalPrice * 0.18; // 18% dummy tax
  const finalTotal = totalPrice + tax;

  return (
    <div className="bg-secondary/30 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-background border-b border-border py-6">
        <div className="container-custom max-w-6xl flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
            Chetak<span className="text-primary">Plus</span>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Lock size={16} /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="container-custom max-w-6xl mt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft size={16} /> Back to Shopping
        </Link>
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Block - Forms */}
          <div className="lg:col-span-7 space-y-8">
            <ScrollReveal>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Apartment, suite, etc."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-6">Payment</h2>
                <div className="p-5 border border-primary/20 bg-primary/5 rounded-xl flex items-start gap-4">
                  <CreditCard className="text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Cash on Delivery / Pay on Delivery</h4>
                    <p className="text-sm text-muted-foreground mt-1">Pay with cash or UPI when your order arrives at your door.</p>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Right Block - Order Summary */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={0.1}>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-28">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">Order Summary</h3>
                
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="relative">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border border-border" />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground leading-snug line-clamp-2 pr-4">{item.product.name}</h4>
                        {item.selectedVariants && Object.values(item.selectedVariants).map(v => (
                           <span key={v} className="text-xs text-muted-foreground block mt-0.5">{v}</span>
                        ))}
                      </div>
                      <div className="text-sm font-semibold whitespace-nowrap">
                        ₹{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Tax (18%)</span>
                    <span className="font-medium text-foreground">₹{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium text-primary">Free</span>
                  </div>
                </div>

                <div className="border-t border-border mt-6 pt-6 flex justify-between items-center mb-8">
                  <span className="font-display text-xl font-bold">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    ₹{finalTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                     <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Place Order <Shield size={18} />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
