import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || /^data:/i.test(path) || /^blob:/i.test(path)) {
    return path;
  }

  if (path.startsWith("/src/") || path.startsWith("/assets/") || path.startsWith("/@fs/") || path.startsWith("/media/")) {
    return path;
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  
  if (baseUrl) {
    let backendRoot = baseUrl.replace(/\/api\/?$/, "");
    let relativePath = path;
    
    if (relativePath.startsWith("/backend/")) {
      if (backendRoot.endsWith("/backend")) {
        backendRoot = backendRoot.replace(/\/backend$/, "");
      } else {
        relativePath = relativePath.replace(/^\/backend/, "");
      }
    }
    
    return backendRoot + (relativePath.startsWith("/") ? "" : "/") + relativePath;
  }
  
  return path;
};