import { useState, useEffect } from "react";
import { Building2, Gift, Package, Users, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import api from "@/api";

const PRODUCT_PRICES = {
  "Notebooks": 150,
  "Diaries": 250,
  "Planners": 350,
  "Corporate Gift Sets": 500,
  "Arch Clip Files": 120,
  "Other": 200
};

const benefits = [
  { icon: Building2, title: "Custom Branding", desc: "Add your company logo and branding to notebooks and planners." },
  { icon: Gift, title: "Corporate Gifting", desc: "Premium gift sets for employees, clients, and events." },
  { icon: Package, title: "Bulk Discounts", desc: "Special pricing for orders of 100+ units across all products." },
  { icon: Users, title: "Dedicated Support", desc: "A dedicated account manager for all your corporate orders." }
];

const features = [
  "Custom notebooks with your brand logo",
  "Personalized planners for employee onboarding",
  "Event stationery and conference kits",
  "Employee appreciation gift sets",
  "Minimum order quantity from 100 pcs",
  "Pan-India delivery with tracking"
];

const Corporate = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    productType: "Notebooks",
    quantity: "",
    requirements: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [estimate, setEstimate] = useState(0);

  useEffect(() => {
    const qty = parseInt(formData.quantity) || 0;
    const basePrice = PRODUCT_PRICES[formData.productType] || 200;
    let total = qty * basePrice;

    if (qty >= 100) {
      total = total * 0.8; // 20% discount for bulk
    }

    setEstimate(total);
  }, [formData.quantity, formData.productType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitCorporateOrder({
        ...formData,
        estimatedPrice: estimate
      });
      setSuccess(true);
      setFormData({
        companyName: "",
        email: "",
        phone: "",
        productType: "Notebooks",
        quantity: "",
        requirements: ""
      });
    } catch (err) {
      alert(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-cream section-padding">
        <div className="container-custom text-center">
          <ScrollReveal>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              For Business
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Corporate & Bulk Orders</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Custom notebooks, branded planners, and corporate gift sets. Let us help you make a lasting impression.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <ScrollReveal key={b.title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <b.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">What We Offer</h2>
              <div className="space-y-3">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{f}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Request a Quote</h3>
                <p className="text-sm text-muted-foreground mb-6">Fill in your requirements and we'll get back to you within 24 hours.</p>

                {success ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">Enquiry Sent!</h4>
                    <p className="text-sm text-muted-foreground mb-6">Thank you for reaching out. Our team will contact you shortly.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                      required
                      type="text"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {Object.keys(PRODUCT_PRICES).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <input
                        required
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    {estimate > 0 && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">Estimated Price</span>
                          {parseInt(formData.quantity) >= 100 && (
                            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">20% Bulk Discount Applied</span>
                          )}
                        </div>
                        <p className="text-xl font-bold text-foreground">₹{estimate.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">* Final price may vary based on customization requirements.</p>
                      </div>
                    )}

                    <textarea
                      placeholder="Describe your requirements (customization details...)"
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          Submit Enquiry <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Corporate;