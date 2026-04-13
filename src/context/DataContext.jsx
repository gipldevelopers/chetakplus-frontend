import { createContext, useContext, useState, useEffect } from "react";
import { products as staticProducts, categories as staticCategories } from "@/data/products";
import api from "@/api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState(staticProducts);
    const [categories, setCategories] = useState(staticCategories);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [backendProducts, backendCategories] = await Promise.all([
                    api.getProducts(),
                    api.getCategories()
                ]);

                // If backend has items, combine them with static if desired, 
                // or just replace them. We prefer backend data and only
                // fallback to static when backend is empty/unavailable.
                if (backendProducts && backendProducts.length > 0) {
                    setProducts(backendProducts);
                } else {
                    setProducts(staticProducts);
                }
                if (backendCategories && backendCategories.length > 0) {
                    setCategories(backendCategories);
                } else {
                    setCategories(staticCategories);
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
