import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const WishlistContext = createContext(undefined);

const getWishlistKey = (user) => {
  if (user?.id) return `chetakplus-wishlist:${user.id}`;
  if (user?.email) return `chetakplus-wishlist:${String(user.email).toLowerCase()}`;
  return "chetakplus-wishlist:guest";
};

const parseStoredWishlist = (rawValue) => {
  if (!rawValue) return [];
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addItem: addToCart } = useCart();
  const storageKey = useMemo(() => getWishlistKey(user), [user?.id, user?.email]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setItems(parseStoredWishlist(stored));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [storageKey, items]);

  const addItem = (product) => {
    if (!product?.id) return;
    setItems((prev) => (prev.find((p) => String(p.id) === String(product.id)) ? prev : [...prev, product]));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(productId)));
  };

  const toggleItem = (product) => {
    if (!product?.id) return;
    setItems((prev) =>
      prev.find((p) => String(p.id) === String(product.id))
        ? prev.filter((p) => String(p.id) !== String(product.id))
        : [...prev, product]
    );
  };

  const moveToCart = (product, quantity = 1) => {
    if (!product?.id) return;
    addToCart(product, quantity);
    removeItem(product.id);
    toast.success("Moved to cart");
  };

  const clearWishlist = () => setItems([]);
  const isWished = (productId) => items.some((p) => String(p.id) === String(productId));

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        moveToCart,
        clearWishlist,
        isWished,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

