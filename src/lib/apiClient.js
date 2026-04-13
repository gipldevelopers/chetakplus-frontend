const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || "/backend/api",
);

const withQueryParams = (url, params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return url;

  const query = new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
  return `${url}?${query}`;
};

const makeUrl = (path = "") => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${API_BASE_URL}/${trimLeadingSlash(path)}`;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
};

const extractPayload = (body) => {
  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }
  return body;
};

const request = async (method, path, { data, params, headers } = {}) => {
  const requestUrl = withQueryParams(makeUrl(path), params);
  const finalHeaders = { ...(headers || {}) };
  const requestInit = { method, headers: finalHeaders };

  if (data !== undefined) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    if (isFormData) {
      requestInit.body = data;
    } else {
      finalHeaders["Content-Type"] = "application/json";
      requestInit.body = JSON.stringify(data);
    }
  }

  const response = await fetch(requestUrl, requestInit);
  const body = await parseResponseBody(response);

  if (!response.ok) {
    const errorMessage = body?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return extractPayload(body);
};

export const apiClient = {
  get: (path, config = {}) => request("GET", path, config),
  post: (path, data, config = {}) => request("POST", path, { ...config, data }),
  put: (path, data, config = {}) => request("PUT", path, { ...config, data }),
  patch: (path, data, config = {}) => request("PATCH", path, { ...config, data }),
  delete: (path, config = {}) => request("DELETE", path, config),
};

export default apiClient;
