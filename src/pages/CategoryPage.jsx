import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useData } from "@/context/DataContext";

const CategoryPage = () => {
  const { slug } = useParams();
  const { categories, getProductsByCategory, loading } = useData();
  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = getProductsByCategory(slug || "");
  const [sortBy, setSortBy] = useState("featured");

  const sorted = useMemo(() => {
    if (!categoryProducts) return [];
    const result = [...categoryProducts];
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;

      default: break;
    }
    return result;
  }, [categoryProducts, sortBy]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Category Not Found</h2>
          <Link to="/shop" className="text-primary hover:underline text-sm">Back to Shop</Link>
        </div>
      </div>);

  }

  return (
    <div>
      <div className="bg-secondary py-12 lg:py-16">
        <div className="container-custom">
          <nav className="text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Home</Link> /{" "}
            <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
            <span className="text-foreground">{category.name}</span>
          </nav>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">{category.name}</h1>
          <p className="text-muted-foreground mt-2 max-w-lg">{category.description}</p>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">{sorted.length} products</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="max-w-[160px] text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none">

            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>

          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {sorted.map((product, i) =>
            <ScrollReveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </ScrollReveal>
          )}
        </div>
        {sorted.length === 0 &&
          <div className="text-center py-20 text-muted-foreground">No products in this category yet.</div>
        }
      </div>
    </div>);

};

export default CategoryPage;