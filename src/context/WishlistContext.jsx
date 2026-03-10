import { createContext, useContext, useState, useEffect } from "react";











const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("chetakplus-wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("chetakplus-wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => prev.find((p) => p.id === product.id) ? prev : [...prev, product]);
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleItem = (product) => {
    if (items.find((p) => p.id === product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const isWished = (productId) => !!items.find((p) => p.id === productId);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isWished, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>);

};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};