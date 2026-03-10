import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { products } from "@/data/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";






const popularSearches = ["Planners", "Notebooks", "Journals", "Sticky Notes", "Gift Sets", "Study Planner"];

const trendingProducts = products.filter((p) => p.badge === "Trending" || p.badge === "Popular").slice(0, 4);

const SearchModal = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const handleSelect = (slug) => {
    onOpenChange(false);
    navigate(`/product/${slug}`);
  };

  const handlePopularSearch = (term) => {
    setQuery(term);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 px-3 py-4 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            autoFocus />
          
          {query &&
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          }
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.trim() === "" ?
          <div className="p-4 space-y-5">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Clock size={12} /> Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) =>
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  
                      {term}
                    </button>
                )}
                </div>
              </div>

              {/* Trending Products */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <TrendingUp size={12} /> Trending Products
                </div>
                {trendingProducts.map((product) =>
              <button
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-secondary rounded-xl transition-colors text-left">
                
                    <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover bg-secondary shrink-0" />
                
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{product.price}</p>
                    </div>
                  </button>
              )}
              </div>

              <p className="text-[10px] text-center text-muted-foreground/60">
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">⌘K</kbd> to open search
              </p>
            </div> :
          results.length === 0 ?
          <div className="p-6 text-center text-sm text-muted-foreground">
              No products found for "{query}"
            </div> :

          <AnimatePresence mode="wait">
              <motion.div
              key={query}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-2">
              
                {results.map((product) =>
              <button
                key={product.id}
                onClick={() => handleSelect(product.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left">
                
                    <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-secondary shrink-0" />
                
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category} · ₹{product.price}</p>
                    </div>
                    {product.badge &&
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                        {product.badge}
                      </span>
                }
                  </button>
              )}
              </motion.div>
            </AnimatePresence>
          }
        </div>
      </DialogContent>
    </Dialog>);

};

export default SearchModal;