import { getImageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useData } from "@/context/DataContext";

const Categories = () => {
  const { categories, getProductsByCategory, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="bg-secondary py-16 lg:py-24">
        <div className="container-custom">
          <nav className="text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Categories</span>
          </nav>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">Shop by Category</h1>
          <p className="text-muted-foreground mt-4 max-w-lg text-lg">
            Explore our premium collection of stationery tailored for every need.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, i) => {
              return (
                <ScrollReveal key={category.id} delay={i * 0.1}>
                  <Link 
                    to={`/category/${category.slug}`}
                    className="group block relative overflow-hidden rounded-3xl bg-card border border-border/50 hover-lift shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img 
                        src={getImageUrl(category.imageUrl || "https://images.unsplash.com/photo-1544816155-12df96467463?q=80&w=800&auto=format&fit=crop")} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-[0.85] group-hover:brightness-[0.7]"
                      />
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 group-hover:bg-primary/20 transition-colors">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-2 block">
                          {category.productCount || 0} Products
                        </span>
                        <h3 className="font-display text-2xl font-bold mb-3">{category.name}</h3>
                        <p className="text-sm text-white/70 line-clamp-2 mb-4 group-hover:text-white transition-colors">
                          {category.description || `High-quality ${category.name.toLowerCase()} for all your creative needs.`}
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm font-bold group/btn">
                          Explore Collection 
                          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container-custom text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-8">Browse our full catalog to see everything we offer.</p>
            <Link to="/shop" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-opacity">
              View All Products
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Categories;
