import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useData } from "@/context/DataContext";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" }
];

const Shop = () => {
  const { products, categories, loading } = useData();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchValue, setSearchValue] = useState("");

  const [activeFilter, setActiveFilter] = useState(null);

  // Read URL params
  useEffect(() => {
    setActiveFilter(searchParams.get("filter"));

    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("all");
    }

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) {
      setPriceRange([0, parseInt(maxPrice)]);
    } else {
      setPriceRange([0, 50000]); // Reset if no maxPrice to a high number
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchValue) {
      const token = searchValue.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(token) ||
        (p.category && p.category.toLowerCase().includes(token))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (activeFilter === "new") {
      result = result.filter((p) => p.badge === "New Arrival");
    } else if (activeFilter === "bestseller") {
      result = result.filter((p) => p.badge === "Best Seller" || p.badge === "Popular" || p.reviewCount > 100);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => b.id - a.id); break;
      default: break;
    }
    return result;
  }, [selectedCategory, sortBy, priceRange, products, activeFilter, searchValue]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  return (
    <div>
      {/* Banner */}
      <div className="bg-secondary py-12 lg:py-16">
        <div className="container-custom">
          <nav className="text-xs text-muted-foreground mb-4">
            <a href="/" className="hover:text-primary">Home</a> / <span className="text-foreground">Shop</span>
          </nav>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">All Products</h1>
          <p className="text-muted-foreground mt-2">{filtered.length} products</p>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-60 shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold text-sm mb-3">Search</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left text-sm py-1.5 transition-colors ${selectedCategory === "all" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`
                  }>

                  All Products
                </button>
                {categories.map((cat) =>
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left text-sm py-1.5 transition-colors ${selectedCategory === cat.slug ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`
                    }>

                    {cat.name}
                  </button>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Price Range</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-20 px-3 py-2 text-sm border border-border rounded-lg bg-background"
                  placeholder="Min" />

                <span className="text-muted-foreground">–</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-20 px-3 py-2 text-sm border border-border rounded-lg bg-background"
                  placeholder="Max" />

              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-foreground px-4 py-2 border border-border rounded-xl">

                <SlidersHorizontal size={16} /> Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="max-w-[150px] sm:max-w-none text-sm border border-border rounded-xl px-4 py-2 bg-background text-foreground focus:outline-none">

                {sortOptions.map((opt) =>
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                )}
              </select>
            </div>

            {/* Mobile filters */}
            {showFilters &&
              <div className="lg:hidden mb-6 p-4 border border-border rounded-xl bg-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X size={16} /></button>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`
                    }>

                    All
                  </button>
                  {categories.map((cat) =>
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCategory === cat.slug ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`
                      }>

                      {cat.name}
                    </button>
                  )}
                </div>
              </div>
            }

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filtered.map((product, i) =>
                <ScrollReveal key={product.id} delay={i * 0.05}>
                  <ProductCard product={product} />
                </ScrollReveal>
              )}
            </div>

            {filtered.length === 0 &&
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default Shop;