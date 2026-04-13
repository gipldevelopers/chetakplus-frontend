import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Lock, Shield, CreditCard, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/ui/ScrollReveal";
import api from "@/api";

const getAddressSuggestionStorageKey = (email = "") => `chetakplus.address.suggestions.${String(email).toLowerCase()}`;
const ORDERS_UPDATED_AT_KEY = "chetakplus.orders.updatedAt";
const DEFAULT_CHECKOUT_SETTINGS = {
  upiId: "",
  upiQrImageUrl: "",
  enableUpi: true,
  enableCod: true,
  defaultCodPaymentStatus: "pending",
  defaultCodOrderStatus: "placed",
  codVerificationRequired: true,
  requireUpiReference: false,
};

const generateUpiQrUrl = (upiId) => {
  if (!upiId) return "";
  const encoded = encodeURIComponent(`upi://pay?pa=${upiId}&pn=ChetakPlus`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;
};

const mergeAddressSuggestions = (addresses = []) => {
  const seen = new Set();
  const merged = [];

  addresses.forEach((entry) => {
    const value = String(entry || "").trim();
    if (!value) return;

    const normalized = value.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(normalized)) return;

    seen.add(normalized);
    merged.push(value);
  });

  return merged.slice(0, 10);
};

const readLocalAddressSuggestions = (email) => {
  if (!email) return [];

  try {
    const raw = localStorage.getItem(getAddressSuggestionStorageKey(email));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalAddressSuggestions = (email, suggestions) => {
  if (!email) return;
  localStorage.setItem(getAddressSuggestionStorageKey(email), JSON.stringify(mergeAddressSuggestions(suggestions)));
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [checkoutSettings, setCheckoutSettings] = useState(DEFAULT_CHECKOUT_SETTINGS);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [addressLabel, setAddressLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [upiTransactionRef, setUpiTransactionRef] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    state: "",
    pincode: "",
  });

  // Sync with user if changed
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: prev.firstName || user.name?.split(" ")[0] || "",
        lastName: prev.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    api.getCheckoutSettings()
      .then((data) => {
        if (!mounted) return;
        const settings = { ...DEFAULT_CHECKOUT_SETTINGS, ...(data || {}) };
        setCheckoutSettings(settings);
        if (!settings.enableCod && settings.enableUpi) {
          setPaymentMethod("UPI");
        } else {
          setPaymentMethod("Cash on Delivery");
        }
      })
      .catch(() => {
        // Keep defaults if settings fetch fails.
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.email && !user?.id) return;

    let mounted = true;
    api.getAddresses({ customerId: user?.id, email: user?.email })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setSavedAddresses(list);
        const defaultAddress = list.find((entry) => entry.isDefault) || list[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setFormData((prev) => ({
            ...prev,
            address: defaultAddress.addressLine || prev.address,
            city: defaultAddress.city || prev.city,
            state: defaultAddress.state || prev.state,
            pincode: defaultAddress.pincode || prev.pincode,
            firstName: defaultAddress.fullName ? String(defaultAddress.fullName).split(" ")[0] : prev.firstName,
            lastName: defaultAddress.fullName ? String(defaultAddress.fullName).split(" ").slice(1).join(" ") : prev.lastName,
            phone: defaultAddress.phone || prev.phone,
          }));
        }
      })
      .catch(() => {
        // silent
      });

    return () => {
      mounted = false;
    };
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (!user?.email) return;

    let isMounted = true;
    const localSuggestions = readLocalAddressSuggestions(user.email);
    setAddressSuggestions(localSuggestions);

    api.getAddressSuggestions(user.email)
      .then((response) => {
        if (!isMounted) return;
        const backendSuggestions = Array.isArray(response?.suggestions) ? response.suggestions : [];
        const merged = mergeAddressSuggestions([...localSuggestions, ...backendSuggestions]);
        setAddressSuggestions(merged);
        saveLocalAddressSuggestions(user.email, merged);
      })
      .catch(() => {
        // Keep local suggestions silently on API failure.
      });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate("/shop");
    }
  }, [items, navigate, isProcessing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (["address", "city", "state", "pincode", "firstName", "lastName", "phone"].includes(name)) {
      setSelectedAddressId("");
    }
  };

  const handleSelectSavedAddress = (addressId) => {
    setSelectedAddressId(addressId);
    const selected = savedAddresses.find((entry) => String(entry.id) === String(addressId));
    if (!selected) return;

    const [firstName = "", ...rest] = String(selected.fullName || "").split(" ");
    setFormData((prev) => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName: rest.join(" ") || prev.lastName,
      phone: selected.phone || prev.phone,
      address: selected.addressLine || prev.address,
      city: selected.city || prev.city,
      state: selected.state || prev.state,
      pincode: selected.pincode || prev.pincode,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to continue checkout.");
      navigate("/signin?redirect=%2Fcheckout");
      return;
    }

    const requiredKeys = ["email", "firstName", "lastName", "phone", "address", "city", "state", "pincode"];
    const hasMissingField = requiredKeys.some((key) => String(formData[key] || "").trim() === "");
    if (hasMissingField) {
      toast.error("Please fill all checkout fields.");
      return;
    }

    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (paymentMethod === "UPI" && checkoutSettings.requireUpiReference && String(upiTransactionRef || "").trim() === "") {
      toast.error("UPI transaction reference is required.");
      return;
    }

    setIsProcessing(true);

    try {
      let selectedAddress = savedAddresses.find((entry) => String(entry.id) === String(selectedAddressId));
      if (!selectedAddress && saveAddressForFuture) {
        const createdAddress = await api.createAddress({
          customerId: user.id,
          email: user.email,
          addressType,
          label: addressLabel,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          addressLine: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          isDefault: savedAddresses.length === 0,
        });
        selectedAddress = createdAddress;
        setSavedAddresses((prev) => [createdAddress, ...prev]);
        setSelectedAddressId(createdAddress?.id || "");
      }

      const payload = {
        customer: {
          ...formData,
          customerId: user.id || null,
          email: user.email || formData.email,
          addressId: selectedAddress?.id || selectedAddressId || null,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        },
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          imageUrl: item.product.images?.[0] || "",
          quantity: item.quantity,
          price: Number(item.product.price || 0),
          selectedVariants: item.selectedVariants || {},
        })),
        pricing: {
          subtotal: Number(totalPrice || 0),
          tax: Number(tax || 0),
          shipping: 0,
          discount: 0,
          total: Number(finalTotal || 0),
        },
        paymentMethod,
        upiTransactionRef: upiTransactionRef.trim() || null,
      };

      const createdOrder = await api.createOrder(payload);

      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`;
      const updatedSuggestions = mergeAddressSuggestions([shippingAddress, ...addressSuggestions]);
      setAddressSuggestions(updatedSuggestions);
      if (user?.email) {
        saveLocalAddressSuggestions(user.email, updatedSuggestions);
      }

      localStorage.setItem(ORDERS_UPDATED_AT_KEY, String(Date.now()));

      clearCart();
      if (paymentMethod === "UPI") {
        toast.success("UPI submitted. Order placed!", {
          description: `Order ${createdOrder?.orderNumber || ""} is pending payment verification.`,
        });
      } else {
        toast.success("Order Placed Successfully!", {
          description: `Order ${createdOrder?.orderNumber || ""} placed successfully.`,
        });
      }
      navigate("/profile");
    } catch (submitError) {
      toast.error("Unable to place order", {
        description: submitError?.message || "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
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
                {savedAddresses.length > 0 ? (
                  <>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4">Saved Addresses</h2>
                    <div className="space-y-3 mb-8">
                      {savedAddresses.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(entry.id)}
                          className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                            String(selectedAddressId) === String(entry.id)
                              ? "border-primary bg-primary/5"
                              : "border-border bg-background hover:bg-secondary/40"
                          }`}
                        >
                          <p className="text-xs font-bold uppercase tracking-widest text-primary">{entry.label || entry.addressType}{entry.isDefault ? " • Default" : ""}</p>
                          <p className="text-sm font-medium text-foreground mt-1">{entry.fullName}</p>
                          <p className="text-xs text-muted-foreground">{entry.phone}</p>
                          <p className="text-sm text-foreground/80 mt-1">{entry.fullAddress}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}

                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      readOnly
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/40 focus:outline-none transition-all text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={saveAddressForFuture}
                      onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                    />
                    Save this address for future checkout
                  </label>
                  {saveAddressForFuture ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Type</label>
                        <select
                          value={addressType}
                          onChange={(e) => setAddressType(e.target.value)}
                          className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm"
                        >
                          <option value="home">Home</option>
                          <option value="office">Office</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Label</label>
                        <input
                          type="text"
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm"
                          placeholder={addressType === "other" ? "Custom label" : "Optional"}
                        />
                      </div>
                    </div>
                  ) : null}
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
                      list="checkout-address-suggestions"
                      placeholder="Apartment, suite, etc."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                    <datalist id="checkout-address-suggestions">
                      {addressSuggestions.map((address) => (
                        <option key={address} value={address} />
                      ))}
                    </datalist>
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
                <div className="space-y-3">
                  {checkoutSettings.enableCod ? (
                    <label className={`block p-4 rounded-xl border cursor-pointer ${paymentMethod === "Cash on Delivery" ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="mr-2"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                      />
                      <span className="font-medium text-foreground">Cash on Delivery</span>
                      <p className="text-xs text-muted-foreground mt-1">Payment stays pending until admin marks it received.</p>
                    </label>
                  ) : null}

                  {checkoutSettings.enableUpi ? (
                    <label className={`block p-4 rounded-xl border cursor-pointer ${paymentMethod === "UPI" ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="mr-2"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                      />
                      <span className="font-medium text-foreground">UPI</span>
                      <p className="text-xs text-muted-foreground mt-1">Order is placed first. Payment is verified by admin before confirmation.</p>
                    </label>
                  ) : null}
                </div>

                {paymentMethod === "UPI" ? (
                  <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-xl">
                    <div className="flex items-start gap-4">
                      <CreditCard className="text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">UPI Payment</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          UPI ID: <span className="font-semibold text-foreground">{checkoutSettings.upiId || "Not configured"}</span>
                        </p>
                        {(checkoutSettings.upiQrImageUrl || checkoutSettings.upiId) ? (
                          <img
                            src={checkoutSettings.upiQrImageUrl || generateUpiQrUrl(checkoutSettings.upiId)}
                            alt="UPI QR"
                            className="mt-3 w-28 h-28 rounded-lg border border-border bg-background"
                          />
                        ) : null}
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">
                            UPI Transaction Reference {checkoutSettings.requireUpiReference ? "*" : "(Optional)"}
                          </label>
                          <input
                            type="text"
                            value={upiTransactionRef}
                            onChange={(e) => setUpiTransactionRef(e.target.value)}
                            placeholder="Enter UPI txn ref"
                            className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

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
                      {paymentMethod === "UPI" ? "Submit UPI & Place Order" : "Place Order"} <Shield size={18} />
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
