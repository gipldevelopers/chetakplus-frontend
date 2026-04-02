import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, Shield, RotateCcw, Lock, GraduationCap, Briefcase, Target, PenTool, Layers, BookHeart, Gem, Share2, Facebook, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const RECENTLY_VIEWED_KEY = "chetakplus-recently-viewed";
const COLOR_MAP = {
  "Red Marble": "#b91c1c",
  "Blue Marble": "#1d4ed8",
  "Green Marble": "#15803d",
  "Black Marble": "#111827",
  "Marble Red": "#b91c1c",
  "Marble Blue": "#1d4ed8",
  "Marble Green": "#15803d",
  "Marble Black": "#111827",
  "Navy": "#1e3a8a",
  "Black": "#000000",
  "White": "#ffffff",
  "Tan": "#d2b48c",
  "Brown": "#78350f",
  "Pink": "#fbcfe8",
  "Lavender": "#e9d5ff"
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { products, getProductBySlug, loading } = useData();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCart();
  const { toggleItem, isWished } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (!product || !products) return;
    try {
      const stored = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
      const updated = [product.slug, ...stored.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

      const viewed = updated.
        filter((s) => s !== product.slug).
        map((s) => products.find((p) => p.slug === s)).
        filter(Boolean);
      setRecentlyViewed(viewed.slice(0, 4));
    } catch {/* ignore */ }
  }, [product, products]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Sticky bar on scroll
  useEffect(() => {
    const handler = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Reset state on product change
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setActiveTab("description");
    setSelectedVariants({});
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Product Not Found</h2>
          <Link to="/shop" className="text-primary hover:underline text-sm">Back to Shop</Link>
        </div>
      </div>);

  }

  const relatedProducts = products ? products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4) : [];
  const discount = product.originalPrice ? Math.round((product.originalPrice - product.price) / product.originalPrice * 100) : 0;
  const wished = isWished(product.id);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "features", label: "Features" },
    { id: "specifications", label: "Specifications" }];


  const perfectForIcons = {
    "Students": GraduationCap,
    "Professionals": Briefcase,
    "Goal Tracking": Target,
    "Journaling": PenTool,
    "Daily Planning": Target,
    "Creative writing": PenTool
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
          <Link to={`/category/${product.categorySlug}`} className="hover:text-primary">{product.category}</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Product Main */}
      <section className="container-custom pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-contain transition-transform duration-500" />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) =>
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-border"}`}>

                  <img src={img} alt="" className="w-full h-full object-contain bg-white" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {product.badge &&
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            }
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{product.name}</h1>



            <div className="flex items-center gap-3 mt-4">
              <span className="font-display text-3xl font-bold text-foreground">₹{product.price}</span>
              {product.originalPrice &&
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Save {discount}%</span>
                </>
              }
            </div>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.shortDescription}</p>

            {/* Variants */}
            {product.variants?.map((variant) => {
              const isColorVariant = variant.label.toLowerCase().includes("colo");

              return (
                <div key={variant.label} className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">{variant.label}</h4>
                    {selectedVariants[variant.label] && (
                      <span className="text-xs text-muted-foreground">{selectedVariants[variant.label]}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {variant.options.map((opt) => {
                      const hexColor = COLOR_MAP[opt];

                      if (isColorVariant && hexColor) {
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: opt }))}
                            className={`group relative flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all ${selectedVariants[variant.label] === opt
                              ? "border-primary scale-110 shadow-md"
                              : "border-transparent hover:border-border"
                              }`}
                            title={opt}
                          >
                            <span
                              className="w-7 h-7 rounded-full border border-black/5"
                              style={{ backgroundColor: hexColor }}
                            />
                            {/* Tooltip for mobile or desktop hover */}
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {opt}
                            </span>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: opt }))}
                          className={`text-xs px-4 py-2 rounded-xl border font-medium transition-all ${selectedVariants[variant.label] === opt
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "border-border text-foreground hover:border-primary/50"
                            }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Quantity & Actions */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => toggleItem(product)}
                  className={`p-3 border rounded-xl transition-colors ${wished ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary"}`}
                  aria-label="Add to wishlist">

                  <Heart size={18} className={wished ? "fill-primary" : ""} />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addItem(product, quantity, selectedVariants)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">

                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button className="flex-1 bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border">
              {[
                { icon: Lock, label: "Secure Payments" },
                { icon: Truck, label: "Fast Shipping" },
                { icon: Shield, label: "Quality Guaranteed" },
                { icon: RotateCcw, label: "Easy Returns" }].
                map((b) =>
                  <div key={b.label} className="flex items-center gap-2">
                    <b.icon size={16} className="text-primary shrink-0" />
                    <p className="text-xs font-medium text-foreground">{b.label}</p>
                  </div>
                )}
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Share2 size={16} className="text-primary" /> Share Product:
              </span>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"
                  title="Share on Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-black hover:text-white transition-all shadow-sm"
                  title="Share on X"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(product.images[0])}&description=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-[#E60023] hover:text-white transition-all shadow-sm"
                  title="Share on Pinterest"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.965 7.398 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Writing Experience */}
        {product.writingExperience &&
          <ScrollReveal>
            <div className="mt-16 bg-cream rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">Writing Experience</h3>
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                  { icon: Layers, label: product.writingExperience.gsm, sub: "Paper Weight" },
                  { icon: BookHeart, label: product.writingExperience.paper, sub: "Paper Type" },
                  { icon: Gem, label: product.writingExperience.feel, sub: "Writing Feel" }].
                  map((w) =>
                    <div key={w.sub} className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-2">
                        <w.icon size={18} />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{w.label}</p>
                      <p className="text-[11px] text-muted-foreground">{w.sub}</p>
                    </div>
                  )}
              </div>
            </div>
          </ScrollReveal>
        }

        {/* Perfect For */}
        {product.perfectFor && product.perfectFor.length > 0 &&
          <ScrollReveal>
            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Perfect For</h3>
              <div className="flex flex-wrap gap-3">
                {product.perfectFor.map((pf) => {
                  const Icon = perfectForIcons[pf] || GraduationCap;
                  return (
                    <div key={pf} className="flex items-center gap-2 bg-secondary/50 px-4 py-2.5 rounded-xl">
                      <Icon size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">{pf}</span>
                    </div>);

                })}
              </div>
            </div>
          </ScrollReveal>
        }

        {/* What's Inside */}
        {product.whatsInside && product.whatsInside.length > 0 &&
          <ScrollReveal>
            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">What's Inside</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.whatsInside.map((item) =>
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        }

        {/* Bundle items */}
        {product.isBundle && product.bundleItems &&
          <ScrollReveal>
            <div className="mt-10 bg-blush rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">This Bundle Includes</h3>
              <div className="space-y-2">
                {product.bundleItems.map((item) =>
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        }

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-0 border-b border-border overflow-x-auto">
            {tabs.map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`
                }>

                {tab.label}
              </button>
            )}
          </div>
          <div className="py-8">
            {activeTab === "description" &&
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
            }
            {activeTab === "features" &&
              <ul className="space-y-3 max-w-2xl">
                {product.features.map((f) =>
                  <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {f}
                  </li>
                )}
              </ul>
            }
            {activeTab === "specifications" &&
              <div className="max-w-md space-y-0">
                {Object.entries(product.specifications).map(([key, value]) =>
                  <div key={key} className="flex py-3 border-b border-border last:border-0">
                    <span className="text-sm font-medium text-foreground w-40 shrink-0">{key}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                )}
              </div>
            }

          </div>
        </div>
      </section>

      {/* Related / You May Also Like */}
      {relatedProducts.length > 0 &&
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <ScrollReveal>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, i) =>
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <ProductCard product={p} />
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      }

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 &&
        <section className="section-padding">
          <div className="container-custom">
            <ScrollReveal>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">Recently Viewed</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {recentlyViewed.map((p, i) =>
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <ProductCard product={p} />
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      }

      {/* Sticky Add to Cart Bar */}
      {showStickyBar &&
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40 py-3 px-4">

          <div className="container-custom flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3 min-w-0">
              <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                <p className="text-sm font-bold text-primary">₹{product.price}</p>
              </div>
            </div>
            <button
              onClick={() => addItem(product, quantity, selectedVariants)}
              className="w-full sm:w-auto flex flex-1 sm:flex-none justify-center items-center gap-2 bg-primary text-primary-foreground px-6 py-3 sm:py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shrink-0">

              <ShoppingBag size={16} /> Add to Cart
            </button>
          </div>
        </motion.div>
      }
    </div>);

};

export default ProductDetail;