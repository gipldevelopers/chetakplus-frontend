import { getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Wishlist = () => {
  const { items, moveToCart, removeItem } = useWishlist();

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((product, i) =>
          <ScrollReveal key={product.id} delay={i * 0.05}>
                <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-secondary/30 shrink-0">
                    {product.images?.[0] ? <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Rs {Number(product.price || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveToCart(product)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                      Move to Cart
                    </button>
                    <button onClick={() => removeItem(product.id)} className="px-3 py-2 rounded-lg border border-border text-xs font-semibold text-rose-600">
                      Remove
                    </button>
                  </div>
                </div>
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
