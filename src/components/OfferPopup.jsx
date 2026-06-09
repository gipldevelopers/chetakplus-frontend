import { getImageUrl } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Gift, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import offerImage from "@/assets/offer-popup.png";

const OfferPopup = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenOfferPopup");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenOfferPopup", "true");
  };

  const deriveNameFromEmail = (email) => {
    const localPart = email.split("@")[0] || "";
    const cleaned = localPart.replace(/[._-]+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    const name = deriveNameFromEmail(normalizedEmail);

    closePopup();

    const params = new URLSearchParams();
    params.set("email", normalizedEmail);
    if (name) {
      params.set("name", name);
    }

    navigate(`/signup?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Left Image Section */}
            <div className="md:w-1/2 relative h-48 md:h-auto">
              <img
                src={getImageUrl(offerImage)}
                alt="Special Offer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Right Content Section */}
            <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-cream">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                <Gift size={16} /> Exclusive Welcome Offer
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                Unlock <span className="text-primary italic">15% OFF</span> <br /> 
                Your First Order
              </h2>
              
              <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
                Join our premium community today and get an exclusive discount on your first purchase of planners, notebooks, and more.
              </p>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 rounded-xl bg-white border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  autoComplete="email"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-7 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Get My Discount <ArrowRight size={18} />
                </button>
              </form>
              
              <p className="text-[10px] text-muted-foreground/60 text-center mt-6">
                *Valid for new customers only. By signing up, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;
