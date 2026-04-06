import apiClient from "@/lib/apiClient";

export const api = {
  getProducts: (params = {}) => apiClient.get("/products.php", { params }),
  getCategories: () => apiClient.get("/categories.php"),
  adminLogin: (payload) => apiClient.post("/admin/login.php", payload),
  submitContact: (payload) => apiClient.post("/contacts.php", payload),
};

export default api;
adminDeleteHero: (id) => apiClient.delete(`/admin/hero.php?id=${id}`),
  submitContact: (payload) => apiClient.post("/contacts.php", payload),
};

export default api;
