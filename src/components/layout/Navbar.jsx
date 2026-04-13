import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, ChevronDown, Search, Heart, ChevronRight, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "@/components/SearchModal";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";


const megaMenuData = {
  // planners: [
  // { name: "All Planners", href: "/category/planners" },
  // { name: "Weekly Planners", href: "/shop?category=planners&type=weekly" },
  // { name: "Daily Planners", href: "/shop?category=planners&type=daily" },
  // { name: "Monthly Planners", href: "/shop?category=planners&type=monthly" },
  // { name: "Study Planners", href: "/shop?category=planners&type=study" }],

  notebooks: [
  { name: "All Notebooks", href: "/category/notebooks" },
  { name: "Spiral Notebooks", href: "/shop?category=notebooks&type=spiral" },
  { name: "Hardbound Notebooks", href: "/shop?category=notebooks&type=hardbound" },
  { name: "A4 Notebooks", href: "/shop?category=notebooks&type=a4" }],

  journals: [
  { name: "All Journals", href: "/category/journals" },
  { name: "Gratitude Journals", href: "/shop?category=journals&type=gratitude" },
  { name: "Productivity Journals", href: "/shop?category=journals&type=productivity" }],

  office: [
  { name: "All Office Stationery", href: "/category/office-stationery" },
  { name: "Sticky Notes", href: "/shop?category=office-stationery&type=sticky" },
  { name: "Desk Organizers", href: "/shop?category=office-stationery&type=organizers" },
  { name: "Files & Folders", href: "/shop?category=office-stationery&type=files" }],

  bundles: [
  { name: "All Bundles", href: "/category/bundles" }]

};

const navLinks = [
{ name: "Home", href: "/" },
{ name: "Shop", href: "/shop", hasMega: true },
{ name: "New Arrivals", href: "/shop?filter=new" },
{ name: "Best Sellers", href: "/shop?filter=bestseller" },
{ name: "Blog", href: "/blog" },
{ name: "Corporate Orders", href: "/corporate" },
{ name: "About", href: "/about" },
{ name: "Contact", href: "/contact" }];


const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaRef = useRef(null);
  const megaTimeout = useRef();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userDisplayName = user?.name || user?.displayName || "";
  const profilePhoto = user?.photoURL || user?.picture || "";
  const userInitial = (userDisplayName || user?.email || "U").charAt(0).toUpperCase();
  const userFirstName = userDisplayName.split(" ")[0] || user?.email?.split("@")[0] || "Account";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setMobileShopOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  const handleMegaEnter = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-2 font-medium tracking-wide">
        Free shipping on orders above ₹999 · Premium Quality Stationery
      </div>

      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 -ml-2 text-foreground"
            aria-label="Toggle menu">
            
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.jpg" alt="ChetakPlus" className="h-10 lg:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) =>
            <div
              key={link.name}
              className="relative"
              onMouseEnter={link.hasMega ? handleMegaEnter : undefined}
              onMouseLeave={link.hasMega ? handleMegaLeave : undefined}>
              
                <Link
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors flex items-center gap-1 py-2 ${
                location.pathname === link.href ?
                "text-primary" :
                "text-foreground/70 hover:text-foreground"}`
                }>
                
                  {link.name}
                  {link.hasMega && <ChevronDown size={14} />}
                </Link>
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            {user ? (
              <div className="relative group">
                <Link to="/profile" className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-secondary transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt={userDisplayName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold">{userInitial}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-[13px] font-bold text-foreground truncate max-w-[80px]">
                    {userFirstName}
                  </span>
                </Link>
                
                {/* Simple Hover Dropdown */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-card border border-border rounded-xl shadow-xl p-2 min-w-[160px]">
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-[13px] font-medium text-foreground transition-colors">
                      <User size={14} /> My Profile
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-[13px] font-medium text-foreground transition-colors">
                      <ShoppingBag size={14} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-[13px] font-medium text-red-500 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/signin" className="p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Sign In">
                <User size={20} />
              </Link>
            )}
            <Link to="/wishlist" className="relative p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 &&
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              }
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Cart">
              
              <ShoppingBag size={20} />
              {totalItems > 0 &&
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                
                  {totalItems}
                </motion.span>
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Menu */}
      <AnimatePresence>
        {megaOpen &&
        <motion.div
          ref={megaRef}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="hidden lg:block absolute left-0 right-0 bg-card border-b border-border shadow-lg z-40"
          onMouseEnter={handleMegaEnter}
          onMouseLeave={handleMegaLeave}>
          
            <div className="container-custom py-8">
              <div className="grid grid-cols-5 gap-8">
                {Object.entries(megaMenuData).map(([key, items]) =>
              <div key={key}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                      {key === "office" ? "Office Stationery" : key.charAt(0).toUpperCase() + key.slice(1)}
                    </h4>
                    <ul className="space-y-2">
                      {items.map((item) =>
                  <li key={item.name}>
                          <Link
                      to={item.href}
                      className="text-sm text-foreground/70 hover:text-primary transition-colors flex items-center gap-1 group">
                      
                            <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                            {item.name}
                          </Link>
                        </li>
                  )}
                    </ul>
                  </div>
              )}
              </div>
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Explore 100+ products across all categories</p>
                <Link to="/shop" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  View All Products <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border bg-background overflow-hidden">
          
            <div className="container-custom py-4 max-h-[70vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-border/30 last:border-0">
                  {link.hasMega ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Link
                          to={link.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex-1"
                        >
                          {link.name}
                        </Link>
                        <button
                          onClick={() => setMobileShopOpen(!mobileShopOpen)}
                          className="p-3 -mr-3 text-foreground/80 hover:text-primary flex items-center justify-center"
                          aria-label="Toggle Submenu"
                        >
                          <ChevronDown size={16} className={`transition-transform duration-200 ${mobileShopOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {mobileShopOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-3 space-y-4">
                              {Object.entries(megaMenuData).map(([key, items]) => (
                                <div key={key}>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                                    {key === "office" ? "Office Stationery" : key.charAt(0).toUpperCase() + key.slice(1)}
                                  </h4>
                                  <ul className="space-y-2">
                                    {items.map((item) => (
                                      <li key={item.name}>
                                        <Link
                                          to={item.href}
                                          onClick={() => setIsMobileOpen(false)}
                                          className="text-sm text-foreground/70 hover:text-primary transition-colors block py-1"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        }
      </AnimatePresence>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>);

};

export default Navbar;
