import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              Chetak<span className="text-primary">Plus</span>
            </h3>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Premium quality paper stationery for students, professionals, and everyone who loves to write.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/50 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-background/50 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-background/50 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Shop", "Planners", "Notebooks", "Journals", "About Us"].map((link) =>
              <li key={link}>
                  <Link
                  to={`/${link.toLowerCase().replace(" ", "-").replace("us", "")}`}
                  className="text-sm text-background/60 hover:text-primary transition-colors">
                  
                    {link}
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
              { name: "Terms & Conditions", href: "/terms" },
              { name: "FAQ", href: "/faq" }].
              map((link) =>
              <li key={link.name}>
                  <Link to={link.href} className="text-sm text-background/60 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/60">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <span>079-22131764 / 22132622</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/60">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span>chetakplus84@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} ChetakPlus. All rights reserved. Premium Stationery Since 1984.
          </p>
        </div>
      </div>
    </footer>);

};

export default Footer;