import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";






const SearchModal = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Keyboard shortcut
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

        <div className="max-h-80 overflow-y-auto">
          {query.trim() === "" ?
          <div className="p-6 text-center text-sm text-muted-foreground">
              <p>Start typing to search products...</p>
              <p className="text-xs mt-1 opacity-60">Tip: Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">⌘K</kbd> to open search</p>
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