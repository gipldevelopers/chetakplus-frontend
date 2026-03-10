
import { Building2, Gift, Package, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const benefits = [
{ icon: Building2, title: "Custom Branding", desc: "Add your company logo and branding to notebooks and planners." },
{ icon: Gift, title: "Corporate Gifting", desc: "Premium gift sets for employees, clients, and events." },
{ icon: Package, title: "Bulk Discounts", desc: "Special pricing for orders of 100+ units across all products." },
{ icon: Users, title: "Dedicated Support", desc: "A dedicated account manager for all your corporate orders." }];


const features = [
"Custom notebooks with your brand logo",
"Personalized planners for employee onboarding",
"Event stationery and conference kits",
"Employee appreciation gift sets",
"Minimum order quantity from 100 pcs",
"Pan-India delivery with tracking"];


const Corporate = () => {
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
            {benefits.map((b, i) =>
            <ScrollReveal key={b.title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover-lift">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <b.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">What We Offer</h2>
              <div className="space-y-3">
                {features.map((f) =>
                <div key={f} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{f}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Request a Quote</h3>
                <p className="text-sm text-muted-foreground mb-6">Fill in your requirements and we'll get back to you within 24 hours.</p>
                <form className="space-y-4">
                  <input type="text" placeholder="Company Name" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <textarea placeholder="Describe your requirements (products, quantity, customization...)" rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  <button type="submit" className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Submit Enquiry <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>);

};

export default Corporate;