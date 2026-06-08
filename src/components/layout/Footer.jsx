import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const response = await api.subscribeToNewsletter(email);
      setSubscribed(true);
      toast({
        title: "Success!",
        description: response.message || "You have been subscribed successfully.",
      });
      setEmail("");
    } catch (err) {
      toast({
        title: "Error",
        description: err?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter CTA */}
      <div className="border-b border-background/10">
        <div className="container-custom py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold">Get 10% Off Your First Order</h3>
            <p className="text-background/60 text-sm mt-1">Subscribe for productivity tips & exclusive offers.</p>
          </div>
          
          {subscribed ? (
            <div className="flex items-center gap-2 text-primary font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 size={20} />
              <span>You're on the list!</span>
            </div>
          ) : (
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={handleSubscribe}>
              <input
                required
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm bg-background/10 text-background placeholder:text-background/40 focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
              
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="container-custom py-12 px-4 sm:px-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6">
              <Link to="/">
                <img src="/logo.jpg" alt="ChetakPlus" className="h-12 lg:h-14 w-auto object-contain brightness-110 contrast-110" />
              </Link>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Premium quality paper stationery for students, professionals, and everyone who loves to write.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/50 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-background/50 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-background/50 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3">
              {[
              { name: "Planners", href: "/category/planners" },
              { name: "Notebooks", href: "/category/notebooks" },
              { name: "Journals", href: "/category/journals" },
              { name: "Office Stationery", href: "/category/office-stationery" },
              { name: "Bundles", href: "/category/bundles" },
              { name: "New Arrivals", href: "/shop?filter=new" },
              { name: "Best Sellers", href: "/shop?filter=bestseller" }].
              map((link) =>
              <li key={link.name}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {[
              { name: "About Us", href: "/about" },
              { name: "Contact", href: "/contact" },
              { name: "Blog", href: "/blog" },
              { name: "Corporate Orders", href: "/corporate" },
              { name: "FAQ", href: "/faq" }].
              map((link) =>
              <li key={link.name}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Policies</h4>
            <ul className="space-y-3">
              {[
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Shipping Policy", href: "/shipping-policy" },
              { name: "Refund Policy", href: "/refund-policy" },
              { name: "Terms & Conditions", href: "/terms" }].
              map((link) =>
              <li key={link.name}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-background/60">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <span>079-22131764 / 22132622</span>
              </li>
              <div className="flex items-start gap-3 text-sm text-background/60 w-full">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span className="break-words">chetakplus84@gmail.com</span>
              </div>
              <li className="flex items-start gap-2 text-sm text-background/60">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} ChetakPlus. All rights reserved. Premium Stationery Since 1984.
          </p>
          <div className="flex gap-6 text-xs text-background/40">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;