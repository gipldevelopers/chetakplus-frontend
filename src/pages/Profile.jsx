import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, Loader2, LogOut, MapPin, Package, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useData } from "@/context/DataContext";

const ORDERS_UPDATED_AT_KEY = "chetakplus.orders.updatedAt";
const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const defaultAddressForm = {
  addressType: "home",
  label: "",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { items: wishlistItems, moveToCart, removeItem } = useWishlist();
  const { products } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "orders";
  const setTab = (newTab) => {
    setSearchParams({ tab: newTab }, { replace: true });
  };

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "", address: "", photoURL: "" });
  const [profileLoading, setProfileLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const previousOrdersRef = useRef({});

  const [ordersPage, setOrdersPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [addressesPage, setAddressesPage] = useState(1);
  const itemsPerPage = 2;

  const wishlist = useMemo(() => {
    const map = new Map(products.map((p) => [String(p.id), p]));
    return wishlistItems.map((item) => map.get(String(item.id)) || item);
  }, [wishlistItems, products]);

  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * itemsPerPage;
    return orders.slice(start, start + itemsPerPage);
  }, [orders, ordersPage]);

  const paginatedWishlist = useMemo(() => {
    const start = (wishlistPage - 1) * itemsPerPage;
    return wishlist.slice(start, start + itemsPerPage);
  }, [wishlist, wishlistPage]);

  const paginatedAddresses = useMemo(() => {
    const start = (addressesPage - 1) * itemsPerPage;
    return addresses.slice(start, start + itemsPerPage);
  }, [addresses, addressesPage]);

  const totalOrdersPages = Math.ceil(orders.length / itemsPerPage);
  const totalWishlistPages = Math.ceil(wishlist.length / itemsPerPage);
  const totalAddressesPages = Math.ceil(addresses.length / itemsPerPage);

  const getStatusColor = (val) => {
    const colors = {
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
      placed: "bg-amber-100 text-amber-700 border-amber-200",
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200",
      failed: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return colors[val] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const notifyOrderChanges = useCallback((nextOrders) => {
    const prev = previousOrdersRef.current;
    const next = {};
    nextOrders.forEach((order) => {
      const status = String(order.status || "").toLowerCase();
      const paymentStatus = String(order.paymentStatus || "").toLowerCase();
      next[order.id] = { status, paymentStatus };
      if (!prev[order.id]) return;
      if (prev[order.id].paymentStatus !== paymentStatus && paymentStatus === "paid") toast.success(`Payment received: ${order.id}`);
      if (prev[order.id].status !== status && ["confirmed", "shipped", "delivered"].includes(status)) toast.success(`${order.id} ${status}`);
    });
    previousOrdersRef.current = next;
  }, []);

  const fetchOrders = useCallback(async ({ silent = false, retries = 1 } = {}) => {
    if (!user?.id && !user?.email) return;
    let attempt = 0;
    while (attempt <= retries) {
      try {
        const data = await api.getUserOrders({ customerId: user.id, email: user.email });
        const list = Array.isArray(data) ? data : [];
        setOrders(list);
        setOrdersLoading(false);
        notifyOrderChanges(list);
        return;
      } catch (error) {
        attempt += 1;
        if (attempt > retries) {
          setOrdersLoading(false);
          if (!silent) toast.error(error?.message || "Unable to load orders");
          setTimeout(() => fetchOrders({ silent: true, retries: 0 }), 2500);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }
  }, [user?.id, user?.email, notifyOrderChanges]);

  const fetchProfile = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await api.getProfile(user.email);
      const next = data && !Array.isArray(data) ? data : user;
      setProfileData({
        name: next.name || user.name || "",
        email: next.email || user.email || "",
        phone: next.phone || user.phone || "",
        address: next.address || user.address || "",
        photoURL: next.photoURL || user.photoURL || "",
      });
    } catch (error) {
      toast.error(error?.message || "Unable to load profile");
    } finally {
      setProfileLoading(false);
    }
  }, [user?.email, user?.name, user?.phone, user?.address, user?.photoURL]);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id && !user?.email) return;
    try {
      const data = await api.getAddresses({ customerId: user.id, email: user.email });
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.message || "Unable to load addresses");
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    setOrdersLoading(true);
    setProfileLoading(true);
    setAddressesLoading(true);
    void Promise.all([fetchOrders(), fetchProfile(), fetchAddresses()]);
  }, [user?.id, user?.email, navigate, fetchOrders, fetchProfile, fetchAddresses]);

  useEffect(() => {
    setOrdersPage(1);
    setWishlistPage(1);
    setAddressesPage(1);
  }, [tab]);

  useEffect(() => {
    if (!user) return undefined;
    const onFocus = () => fetchOrders({ silent: true });
    const onStorage = (event) => { if (event.key === ORDERS_UPDATED_AT_KEY) fetchOrders({ silent: true }); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    const poll = setInterval(() => { if (tab === "orders") fetchOrders({ silent: true, retries: 0 }); }, 12000);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, [user?.id, tab, fetchOrders]);

  if (!user) return null;

  const resetAddressForm = () => {
    setAddressForm({ ...defaultAddressForm, fullName: profileData.name, phone: profileData.phone });
    setEditingAddressId(null);
  };

  return (
    <div className="min-h-screen bg-secondary/30 pt-24 pb-16">
      <div className="container-custom max-w-6xl grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="bg-card border border-border rounded-2xl p-5 h-fit shadow-sm">
          <h2 className="font-display text-xl font-bold mb-4 px-3 truncate">{profileData.name || user.name}</h2>
          <div className="space-y-1">
            <button onClick={() => setTab("profile")} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "profile" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}>
              <Settings size={16} className="inline mr-2.5" />My Profile
            </button>
            <button onClick={() => setTab("orders")} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "orders" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}>
              <Package size={16} className="inline mr-2.5" />My Orders
            </button>
            <button onClick={() => setTab("wishlist")} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "wishlist" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}>
              <Heart size={16} className="inline mr-2.5" />Wishlist
            </button>
            <button onClick={() => setTab("addresses")} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "addresses" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}>
              <MapPin size={16} className="inline mr-2.5" />Saved Addresses
            </button>
            <hr className="my-2 border-border/50" />
            <button onClick={() => { logout(); navigate("/signin"); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
              <LogOut size={16} className="inline mr-2.5" />Logout
            </button>
          </div>
        </aside>

        <main className="bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[500px]">
          {tab === "orders" ? (
            searchParams.get("id") ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete("id");
                      setSearchParams(params);
                    }}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Package size={20} className="rotate-180" />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold font-display">Order Details</h1>
                    <p className="text-xs text-muted-foreground">Order ID: {searchParams.get("id")}</p>
                  </div>
                </div>

                {(() => {
                  const order = orders.find(o => String(o.id) === searchParams.get("id"));
                  if (!order) return <div className="py-12 text-center text-muted-foreground text-sm">Order not found.</div>;
                  
                  const orderStatus = (order.status || "placed").toLowerCase();
                  const paymentStatus = (order.paymentStatus || "pending").toLowerCase();

                  return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-border bg-secondary/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(orderStatus)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-secondary/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Payment</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(paymentStatus)}`}>
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-secondary/10">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Method</p>
                          <p className="text-xs font-bold uppercase tracking-wider">{order.paymentMethod || "Cash on Delivery"}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Order Items</h2>
                        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-card/50">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center border border-border overflow-hidden">
                                  {(item.images?.[0] || item.image) ? (
                                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : <Package size={20} className="text-muted-foreground" />}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-sm font-bold">{formatCurrency((item.price || 0) * (item.quantity || 1))}</p>
                            </div>
                          ))}
                          <div className="p-4 bg-secondary/10 space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Subtotal</span>
                              <span>{formatCurrency(order.amount)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Shipping</span>
                              <span className="text-emerald-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-border/50">
                              <span>Total Amount</span>
                              <span className="text-primary">{formatCurrency(order.amount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.shippingAddress && (
                        <div className="space-y-4">
                          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Shipping To</h2>
                          <div className="p-5 border border-border rounded-xl bg-secondary/5">
                            <p className="text-sm font-bold mb-1">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{order.shippingAddress}</p>
                            {order.phone && <p className="text-xs text-muted-foreground mt-2 font-medium">Contact: {order.phone}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                  <div>
                    <h1 className="text-2xl font-bold font-display">My Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track and manage your order history.</p>
                  </div>
                  <button onClick={() => fetchOrders()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20">
                    Refresh
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                    <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading your orders...</p>
                  </div>
                ) : orders.length ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {paginatedOrders.map((order) => {
                        const status = String(order.status || "placed").toLowerCase();
                        const paymentStatus = String(order.paymentStatus || "pending").toLowerCase();
                        
                        return (
                          <div key={order.id} className="border border-border rounded-xl p-4 transition-all hover:border-primary/20 bg-card group">
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                              <div className="space-y-1">
                                <p className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">{order.id}</p>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{order.date} • {order.paymentMethod || "Cash on Delivery"}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(status)}`}>
                                  {order.status}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm ${getStatusColor(paymentStatus)}`}>
                                  {order.paymentStatus || "Pending Payment"}
                                </span>
                              </div>
                            </div>

                            {order.codVerificationCode ? (
                              <div className="mt-4 p-4 bg-secondary/30 rounded-xl flex items-center gap-4 border border-border/50 group-hover:bg-secondary/50 transition-colors">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-border/50">
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(order.codVerificationCode)}`}
                                    alt="Delivery verification QR"
                                    className="w-12 h-12 rounded filter contrast-125"
                                  />
                                </div>
                                <div>
                                  <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-[0.15em] mb-1">Delivery Verification Code</p>
                                  <p className="text-lg font-mono font-bold tracking-[0.2em] text-slate-800">{order.codVerificationCode}</p>
                                </div>
                              </div>
                            ) : null}
                            
                            <div className="mt-4 pt-4 border-t border-border/40 flex justify-between items-center">
                              <p className="text-base font-bold text-slate-900">{formatCurrency(order.amount)}</p>
                              <Link 
                                to={`/profile?tab=orders&id=${order.id}`} 
                                className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-primary shadow-sm hover:shadow-primary/25 transition-all"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {orders.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                          Showing page {ordersPage} of {totalOrdersPages}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                            disabled={ordersPage === 1}
                            className="h-8 px-3 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Prev
                          </button>
                          <div className="flex gap-1 mx-1">
                            {[...Array(totalOrdersPages)].map((_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => setOrdersPage(i + 1)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${ordersPage === i + 1 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setOrdersPage((p) => Math.min(totalOrdersPages, p + 1))}
                            disabled={ordersPage === totalOrdersPages}
                            className="h-8 px-3 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                      <Package className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-lg font-bold font-display">No Orders Found</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">You haven't placed any orders yet. Visit our shop to find amazing products!</p>
                    <Link to="/shop" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Start Shopping</Link>
                  </div>
                )}
              </>
            )
          ) : null}

          {tab === "profile" ? (
            <>
              <h1 className="text-2xl font-bold font-display mb-5">My Profile</h1>
              {profileLoading ? <Loader2 className="animate-spin text-primary" /> : (
                <form onSubmit={async (event) => {
                  event.preventDefault();
                  setUpdatingProfile(true);
                  try {
                    await api.updateProfile(profileData);
                    updateUser({ ...user, ...profileData });
                    toast.success("Profile updated");
                  } catch (error) {
                    toast.error(error?.message || "Update failed");
                  } finally {
                    setUpdatingProfile(false);
                  }
                }} className="space-y-3 max-w-lg">
                  <input value={profileData.name} onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3" placeholder="Name" />
                  <input value={profileData.email} disabled className="h-10 w-full rounded-lg border border-border px-3 bg-secondary/40" />
                  <input value={profileData.phone} onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3" placeholder="Phone" />
                  <textarea value={profileData.address} onChange={(e) => setProfileData((p) => ({ ...p, address: e.target.value }))} className="w-full rounded-lg border border-border px-3 py-2" rows="3" placeholder="Default address" />
                  <button disabled={updatingProfile} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">{updatingProfile ? "Saving..." : "Save Changes"}</button>
                </form>
              )}
            </>
          ) : null}

          {tab === "wishlist" ? (
            <>
              <h1 className="text-2xl font-bold font-display mb-5">Wishlist</h1>
              {wishlist.length ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {paginatedWishlist.map((item) => (
                      <div key={item.id} className="border border-border rounded-xl p-4 bg-card hover:border-primary/20 transition-all group relative">
                        <div className="flex gap-4">
                          <Link to={`/product/${item.slug}`} className="w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0">
                            <img 
                              src={item.images?.[0] || item.image || "/placeholder.svg"} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          </Link>
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div className="flex-1">
                              <Link to={`/product/${item.slug}`}>
                                <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{item.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(item.price)}</p>
                              </Link>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => moveToCart(item)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm hover:translate-y-[-1px] transition-all">Add to Cart</button>
                              <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg border border-border text-rose-600 hover:bg-rose-50 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {wishlist.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        Showing page {wishlistPage} of {totalWishlistPages}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setWishlistPage((p) => Math.max(1, p - 1))}
                          disabled={wishlistPage === 1}
                          className="h-8 px-3 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Prev
                        </button>
                        <div className="flex gap-1 mx-1">
                          {[...Array(totalWishlistPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setWishlistPage(i + 1)}
                              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${wishlistPage === i + 1 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setWishlistPage((p) => Math.min(totalWishlistPages, p + 1))}
                          disabled={wishlistPage === totalWishlistPages}
                          className="h-8 px-3 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border text-rose-300">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-display">Your Wishlist is Empty</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Start saving items you love to your wishlist!</p>
                  <Link to="/shop" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Go Shopping</Link>
                </div>
              )}
            </>
          ) : null}

          {tab === "addresses" ? (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div>
                  <h1 className="text-2xl font-bold font-display">Saved Addresses</h1>
                  <p className="text-sm text-muted-foreground mt-1">Manage your delivery locations.</p>
                </div>
                <button 
                  onClick={resetAddressForm} 
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                >
                  <MapPin size={14} /> <span>Add New</span>
                </button>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    {addressesLoading ? (
                      <Loader2 className="animate-spin text-primary" />
                    ) : addresses.length ? (
                      paginatedAddresses.map((addr) => (
                        <div key={addr.id} className={`border border-border rounded-xl p-4 transition-all hover:border-primary/20 bg-card group ${addr.isDefault ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded bg-secondary text-secondary-foreground mb-2 inline-block">
                                  {addr.label || addr.addressType}
                                </span>
                                {addr.isDefault && <span className="ml-2 text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Default</span>}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { 
                                  setEditingAddressId(addr.id); 
                                  setAddressForm({ 
                                    addressType: addr.addressType || "home", 
                                    label: addr.label || "", 
                                    fullName: addr.fullName || "", 
                                    phone: addr.phone || "", 
                                    addressLine: addr.addressLine || "", 
                                    city: addr.city || "", 
                                    state: addr.state || "", 
                                    pincode: addr.pincode || "", 
                                    landmark: addr.landmark || "", 
                                    isDefault: Boolean(addr.isDefault) 
                                  }); 
                                }} 
                                className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors text-primary"
                              >
                                <Settings size={14} />
                              </button>
                              <button 
                                onClick={async () => { 
                                  try { 
                                    await api.deleteAddress(addr.id, { customerId: user.id, email: user.email }); 
                                    toast.success("Address deleted"); 
                                    fetchAddresses(); 
                                  } catch (error) { 
                                    toast.error(error?.message || "Delete failed"); 
                                  } 
                                }} 
                                className="p-1.5 rounded-lg border border-border hover:bg-rose-50 transition-colors text-rose-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm font-bold mt-2">{addr.fullName || "N/A"}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{addr.fullAddress || addr.addressLine}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground py-12 text-center bg-secondary/20 rounded-xl border border-dashed border-border">
                        No saved addresses yet.
                      </div>
                    )}
                  </div>

                  {addresses.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        Showing page {addressesPage} of {totalAddressesPages}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setAddressesPage((p) => Math.max(1, p - 1))}
                          disabled={addressesPage === 1}
                          className="h-8 px-3 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Prev
                        </button>
                        <div className="flex gap-1 mx-1">
                          {[...Array(totalAddressesPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setAddressesPage(i + 1)}
                              className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${addressesPage === i + 1 ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setAddressesPage((p) => Math.min(totalAddressesPages, p + 1))}
                          disabled={addressesPage === totalAddressesPages}
                          className="h-8 px-3 rounded-lg border border-border text-[10px] font-bold uppercase tracking-wider hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sticky top-0">
                  <div className="bg-secondary/10 border border-border rounded-2xl p-5 ring-1 ring-primary/5">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-slate-500">
                      {editingAddressId ? 'Update' : 'Add New'} Address
                    </h2>
                    <form onSubmit={async (event) => {
                      event.preventDefault();
                      setAddressSaving(true);
                      try {
                        const payload = { ...addressForm, customerId: user.id, email: user.email };
                        if (editingAddressId) await api.updateAddress(editingAddressId, payload);
                        else await api.createAddress(payload);
                        toast.success(editingAddressId ? "Address updated" : "Address saved");
                        resetAddressForm();
                        fetchAddresses();
                      } catch (error) {
                        toast.error(error?.message || "Save failed");
                      } finally {
                        setAddressSaving(false);
                      }
                    }} className="space-y-3">
                      <select name="addressType" value={addressForm.addressType} onChange={(e) => setAddressForm((p) => ({ ...p, addressType: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                        <option value="home">🏠 Home</option>
                        <option value="office">🏢 Office</option>
                        <option value="other">📍 Other</option>
                      </select>
                      <input value={addressForm.label} onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Label (e.g. My Place)" />
                      <input value={addressForm.fullName} onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Full Name" required />
                      <input value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Phone" required />
                      <input value={addressForm.addressLine} onChange={(e) => setAddressForm((p) => ({ ...p, addressLine: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Address line" required />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="City" required />
                        <input value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="State" required />
                      </div>
                      <input value={addressForm.pincode} onChange={(e) => setAddressForm((p) => ({ ...p, pincode: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Pincode" required />
                      <input value={addressForm.landmark} onChange={(e) => setAddressForm((p) => ({ ...p, landmark: e.target.value }))} className="h-10 w-full rounded-lg border border-border px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Landmark (optional)" />
                      <label className="text-xs font-medium flex items-center gap-2 px-1 py-1 cursor-pointer">
                        <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4 rounded border-border accent-primary" />
                        Set as default address
                      </label>
                      <button disabled={addressSaving} className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
                        {addressSaving ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </button>
                      {editingAddressId && (
                        <button type="button" onClick={resetAddressForm} className="w-full text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-rose-600 transition-colors pt-1">
                          Cancel Edit
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default Profile;
