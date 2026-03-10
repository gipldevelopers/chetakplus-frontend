import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <div className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground mt-3">
              {items.length > 0 ?
              `You have ${items.length} item${items.length > 1 ? "s" : ""} saved` :
              "Your wishlist is empty"}
            </p>
          </div>
        </ScrollReveal>

        {items.length > 0 ?
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((product, i) =>
          <ScrollReveal key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </ScrollReveal>
          )}
          </div> :

        <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-6">
              Save items you love by tapping the heart icon on any product.
            </p>
            <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        }
      </div>
    </div>);

};

export default Wishlist;