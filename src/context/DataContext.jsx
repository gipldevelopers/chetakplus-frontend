import { createContext, useContext, useState, useEffect } from "react";
import api from "@/api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [backendProducts, backendCategories, backendFaqs] = await Promise.all([
                    api.getProducts(),
                    api.getCategories(),
                    api.getFaqs()
                ]);

                if (backendProducts) setProducts(backendProducts);
                if (backendCategories) setCategories(backendCategories);
                if (backendFaqs) setFaqs(backendFaqs);

                setError(null);
            } catch (err) {
                console.error("API error:", err);
                setError(err.message);
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
            faqs,
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
