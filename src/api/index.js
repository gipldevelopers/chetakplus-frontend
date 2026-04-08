import apiClient from "@/lib/apiClient";

export const api = {
  getProducts: (params = {}) => apiClient.get("/products.php", { params }),
  getCategories: () => apiClient.get("/categories.php"),
  getHeroSlides: () => apiClient.get("/hero.php"),
  getCheckoutSettings: () => apiClient.get("/settings.php"),

  authSignUp: (payload) => apiClient.post("/auth/signup.php", payload),
  authSignIn: (payload) => apiClient.post("/auth/signin.php", payload),
  authForgotPassword: (payload) => apiClient.post("/auth/forgot-password.php", payload),
  authVerifyResetToken: ({ email, token }) => apiClient.get("/auth/reset-password.php", { params: { email, token } }),
  authResetPassword: (payload) => apiClient.post("/auth/reset-password.php", payload),

  adminLogin: (payload) => apiClient.post("/admin/login.php", payload),
  adminGetHeroes: () => apiClient.get("/admin/hero.php"),
  adminGetHeroById: (id) => apiClient.get("/admin/hero.php", { params: { id } }),
  adminCreateHero: (payload) => apiClient.post("/admin/hero.php", payload),
  adminUpdateHero: (id, payload) => apiClient.put("/admin/hero.php", payload, { params: { id } }),
  adminDeleteHero: (id) => apiClient.delete("/admin/hero.php", { params: { id } }),
  adminUploadMedia: (file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options.folder) formData.append("folder", options.folder);
    if (options.kind) formData.append("kind", options.kind);
    return apiClient.post("/admin/upload.php", formData);
  },

  adminGetCategories: () => apiClient.get("/admin/categories.php"),
  adminGetCategoryById: (id) => apiClient.get("/admin/categories.php", { params: { id } }),
  adminCreateCategory: (payload) => apiClient.post("/admin/categories.php", payload),
  adminUpdateCategory: (id, payload) => apiClient.put("/admin/categories.php", payload, { params: { id } }),
  adminDeleteCategory: (id) => apiClient.delete("/admin/categories.php", { params: { id } }),

  adminGetProducts: (params = {}) => apiClient.get("/admin/products.php", { params }),
  adminGetProductById: (id) => apiClient.get("/admin/products.php", { params: { id } }),
  adminCreateProduct: (payload) => apiClient.post("/admin/products.php", payload),
  adminUpdateProduct: (id, payload) => apiClient.put("/admin/products.php", payload, { params: { id } }),
  adminDeleteProduct: (id) => apiClient.delete("/admin/products.php", { params: { id } }),

  adminGetOrders: (params = {}) => apiClient.get("/admin/orders.php", { params }),
  adminGetOrderById: (id) => apiClient.get("/admin/orders.php", { params: { id } }),
  adminUpdateOrder: (id, payload) => apiClient.put("/admin/orders.php", payload, { params: { id } }),

  adminGetCustomers: (params = {}) => apiClient.get("/admin/customers.php", { params }),
  adminGetCustomerById: (id) => apiClient.get("/admin/customers.php", { params: { id } }),
  adminUpdateCustomer: (id, payload) => apiClient.put("/admin/customers.php", payload, { params: { id } }),

  adminGetPayments: (params = {}) => apiClient.get("/admin/payments.php", { params }),
  adminGetPaymentById: (id) => apiClient.get("/admin/payments.php", { params: { id } }),
  adminUpdatePayment: (id, payload) => apiClient.put("/admin/payments.php", payload, { params: { id } }),
  adminGetDashboard: () => apiClient.get("/admin/dashboard.php"),

  adminGetContacts: (params = {}) => apiClient.get("/admin/contacts.php", { params }),
  adminGetContactById: (id) => apiClient.get("/admin/contacts.php", { params: { id } }),
  adminUpdateContact: (id, payload) => apiClient.put("/admin/contacts.php", payload, { params: { id } }),

  adminGetSettings: () => apiClient.get("/admin/settings.php"),
  adminUpdateSettings: (payload) => apiClient.put("/admin/settings.php", payload),

  adminGetReviews: (params = {}) => apiClient.get("/admin/reviews.php", { params }),
  adminGetReviewById: (id) => apiClient.get("/admin/reviews.php", { params: { id } }),
  adminUpdateReview: (id, payload) => apiClient.put("/admin/reviews.php", payload, { params: { id } }),

  adminGetReturns: (params = {}) => apiClient.get("/admin/returns.php", { params }),
  adminGetReturnById: (id) => apiClient.get("/admin/returns.php", { params: { id } }),
  adminUpdateReturn: (id, payload) => apiClient.put("/admin/returns.php", payload, { params: { id } }),

  createOrder: (payload) => apiClient.post("/orders.php", payload),
  getUserOrders: ({ email, customerId } = {}) => {
    const params = {};
    const rawCustomerId = customerId !== undefined && customerId !== null ? String(customerId).trim() : "";
    if (rawCustomerId) {
      if (/^\d+$/.test(rawCustomerId)) {
        params.customerId = rawCustomerId;
      } else {
        const fallbackMatch = rawCustomerId.match(/(\d+)/);
        if (fallbackMatch) params.customerId = fallbackMatch[1];
      }
    }
    if (email) params.email = String(email).trim().toLowerCase();
    return apiClient.get("/orders.php", { params });
  },

  getReturns: (params = {}) => apiClient.get("/returns.php", { params }),
  submitReturn: (payload) => apiClient.post("/returns.php", payload),
  cancelReturnRequest: (id, payload = {}) => apiClient.patch("/returns.php", payload, { params: { id } }),

  submitContact: (payload) => apiClient.post("/contacts.php", payload),

  getProfile: (email) => apiClient.get("/profile.php", { params: { email } }),
  updateProfile: (payload) => apiClient.post("/profile.php", payload),
  getAddressSuggestions: (email) => apiClient.get("/address-suggestions.php", { params: { email } }),
  getAddresses: ({ email, customerId } = {}) => {
    const params = {};
    const rawCustomerId = customerId !== undefined && customerId !== null ? String(customerId).trim() : "";
    if (rawCustomerId) {
      if (/^\d+$/.test(rawCustomerId)) {
        params.customerId = rawCustomerId;
      } else {
        const fallbackMatch = rawCustomerId.match(/(\d+)/);
        if (fallbackMatch) params.customerId = fallbackMatch[1];
      }
    }
    if (email) params.email = String(email).trim().toLowerCase();
    return apiClient.get("/addresses.php", { params });
  },
  createAddress: (payload) => apiClient.post("/addresses.php", payload),
  updateAddress: (id, payload) => apiClient.put("/addresses.php", payload, { params: { id } }),
  deleteAddress: (id, payload = {}) => apiClient.delete("/addresses.php", { params: { id, ...payload } }),
  uploadProfilePhoto: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "profiles");
    return apiClient.post("/admin/upload.php", formData);
  },
  getReviews: (productId) => apiClient.get("/reviews.php", { params: { productId } }),
  addReview: (payload) => apiClient.post("/reviews.php", payload),
};

export default api;
