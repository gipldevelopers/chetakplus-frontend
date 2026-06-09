import { getImageUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const checkoutHref = isAuthenticated ? "/checkout" : "/signin?redirect=%2Fcheckout";

  return (
    <AnimatePresence>
      {isCartOpen &&
      <>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
          onClick={() => setIsCartOpen(false)} />
        
          <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col">
          
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-semibold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ?
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-sm text-primary hover:underline">
                    Continue Shopping
                  </Link>
                </div> :

                <div className="space-y-4">
                  {items.map((item) => {
                    const price = item.selectedVariant?.price ? Number(item.selectedVariant.price) : Number(item.product.price);
                    const variantTitle = item.selectedVariant?.title || (item.selectedVariant?.pages ? `${item.selectedVariant.pages} Pages` : "");
                    
                    return (
                      <div key={item.cartItemId} className="flex gap-4 p-3 rounded-xl bg-secondary/50">
                        <img
                          src={getImageUrl(item.product.images[0])}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg" />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                          {variantTitle && (
                            <p className="text-xs text-muted-foreground mt-0.5">{variantTitle}</p>
                          )}
                          <p className="text-sm text-primary font-semibold mt-1">₹{price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 rounded-md bg-background border border-border hover:bg-secondary transition-colors">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-1 rounded-md bg-background border border-border hover:bg-secondary transition-colors">
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-muted-foreground hover:text-destructive transition-colors self-start">
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              }
            </div>

            {/* Footer */}
            {items.length > 0 &&
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-display text-lg font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
                <Link 
                  to={checkoutHref}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity block text-center">
                  Checkout · ₹{totalPrice.toLocaleString()}
                </Link>
              </div>
            }
          </motion.div>
        </>
      }
    </AnimatePresence>);

};

export default CartDrawer;
