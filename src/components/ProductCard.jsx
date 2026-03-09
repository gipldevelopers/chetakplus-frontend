import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

import { motion } from "framer-motion";





const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const { addItem } = useCart();

  const discount = product.originalPrice ?
  Math.round((product.originalPrice - product.price) / product.originalPrice * 100) :
  0;

  return (
    <motion.div
      className="group relative bg-card rounded-2xl overflow-hidden hover-lift border border-border/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout>
      
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy" />
        

        {/* Badge */}
        {product.badge &&
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        }

        {/* Discount */}
        {discount > 0 &&
        <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        }

        {/* Quick actions */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`
          }>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex-1 bg-foreground text-background text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors">
            
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* Wishlist */}
      <button
        onClick={() => setIsWished(!isWished)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        style={{ display: discount > 0 ? 'none' : undefined }}
        aria-label="Add to wishlist">
        
        <Heart size={16} className={isWished ? "fill-primary text-primary" : "text-foreground/60"} />
      </button>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) =>
          <Star
            key={i}
            size={12}
            className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"} />

          )}
          <span className="text-[11px] text-muted-foreground ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-semibold text-foreground">₹{product.price}</span>
          {product.originalPrice &&
          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          }
        </div>
      </div>
    </motion.div>);

};

export default ProductCard;