import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, ChevronDown, Search, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "@/components/SearchModal";

const shopLinks = [
{ name: "All Products", href: "/shop" },
{ name: "Planners", href: "/category/planners" },
{ name: "Notebooks", href: "/category/notebooks" },
{ name: "Journals", href: "/category/journals" },
{ name: "Office Stationery", href: "/category/office-stationery" }];


const navLinks = [
{ name: "Home", href: "/" },
{ name: "Shop", href: "/shop", children: shopLinks },
{ name: "Planners", href: "/category/planners" },
{ name: "Notebooks", href: "/category/notebooks" },
{ name: "About", href: "/about" },
{ name: "Contact", href: "/contact" }];


const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

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
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl lg:text-2xl font-bold tracking-tight text-foreground">
              Chetak<span className="text-primary">Plus</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.children && setShopDropdownOpen(true)}
              onMouseLeave={() => link.children && setShopDropdownOpen(false)}>
              
                <Link
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors flex items-center gap-1 py-2 ${
                location.pathname === link.href ?
                "text-primary" :
                "text-foreground/70 hover:text-foreground"}`
                }>
                
                  {link.name}
                  {link.children && <ChevronDown size={14} />}
                </Link>
                {link.children && shopDropdownOpen &&
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full left-0 bg-card rounded-xl shadow-lg border border-border py-2 min-w-48">
                
                    {link.children.map((child) =>
                <Link
                  key={child.name}
                  to={child.href}
                  className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors">
                  
                        {child.name}
                      </Link>
                )}
                  </motion.div>
              }
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="p-2 text-foreground/70 hover:text-foreground transition-colors hidden sm:block" aria-label="Wishlist">
              <Heart size={20} />
            </button>
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

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border bg-background overflow-hidden">
          
            <div className="container-custom py-4 space-y-1">
              {navLinks.map((link) =>
            <div key={link.name}>
                  <Link
                to={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                
                    {link.name}
                  </Link>
                  {link.children &&
              <div className="pl-4 space-y-1">
                      {link.children.map((child) =>
                <Link
                  key={child.name}
                  to={child.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  
                          {child.name}
                        </Link>
                )}
                    </div>
              }
                </div>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>);

};

export default Navbar;