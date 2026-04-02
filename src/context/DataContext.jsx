import { createContext, useContext, useState, useEffect } from "react";
import { products as staticProducts, categories as staticCategories } from "@/data/products";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState(staticProducts);
    const [categories, setCategories] = useState(staticCategories);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch("/backend/api/products.php"),
                    fetch("/backend/api/categories.php")
                ]);

                if (!prodRes.ok || !catRes.ok) {
                    throw new Error("Failed to fetch data from API");
                }

                const backendProducts = await prodRes.json();
                const backendCategories = await catRes.json();

                // If backend has items, combine them with static if desired, 
                // or just replace them. To show "real-time" backend data, 
                // we'll primarily use backend data.
                if (backendProducts && backendProducts.length > 0) {
                    setProducts([...backendProducts, ...staticProducts]);
                }
                if (backendCategories && backendCategories.length > 0) {
                    setCategories([...backendCategories, ...staticCategories]);
                }

                setError(null);
            } catch (err) {
                console.error("API error:", err);
                setError(err.message);
                // Fallback to static data on error (already set)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getProductsByCategory = (slug) =>
        products.filter((p) => p.categorySlug === slug);

    const getProductBySlug = (slug) =>
        products.find((p) => p.slug === slug);

    const getBestSellers = () =>
        products.filter((p) => p.badge === "Best Seller" || p.badge === "Popular" || p.reviewCount > 100);

    const getTrending = () =>
        products.filter((p) => p.badge === "Trending" || p.badge === "New Arrival").slice(0, 8);

    const getNewArrivals = () =>
        products.filter((p) => p.badge === "New Arrival");

    const getBundles = () =>
        products.filter((p) => p.isBundle);

    const getFeaturedProduct = () =>
        products.find((p) => p.slug === "weekly-planner-productivity") || products[0];

    return (
        <DataContext.Provider value={{
            products,
            categories,
            loading,
            error,
            getProductsByCategory,
            getProductBySlug,
            getBestSellers,
            getTrending,
            getNewArrivals,
            getBundles,
            getFeaturedProduct
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
