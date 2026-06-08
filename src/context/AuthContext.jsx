import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);
const AUTH_USER_KEY = "chetakplus.auth.user";
const AUTH_SESSION_KEY = "chetakplus.auth.session";

const pickString = (...values) => {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return "";
};

const normalizeAuthUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== "object") return null;

  const name = pickString(rawUser.name, rawUser.displayName);
  const photoURL = pickString(rawUser.photoURL, rawUser.picture, rawUser.photo_url);

  return {
    ...rawUser,
    id: rawUser.id != null ? String(rawUser.id) : "",
    name,
    displayName: pickString(rawUser.displayName, name),
    email: pickString(rawUser.email).toLowerCase(),
    phone: pickString(rawUser.phone),
    address: pickString(rawUser.address),
    photoURL,
    picture: pickString(rawUser.picture, photoURL),
  };
};

const parseStoredUser = (rawValue) => {
  if (!rawValue) return null;
  try {
    return normalizeAuthUser(JSON.parse(rawValue));
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserRaw = localStorage.getItem(AUTH_USER_KEY);
    if (savedUserRaw) {
      const parsedUser = parseStoredUser(savedUserRaw);
      if (parsedUser) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }

    const onStorage = (event) => {
      if (event.key !== AUTH_USER_KEY) return;
      const nextUser = parseStoredUser(event.newValue);
      setUser(nextUser);
    };

    window.addEventListener("storage", onStorage);
    setIsLoading(false);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = (userData) => {
    const normalizedUser = normalizeAuthUser(userData);
    if (!normalizedUser) return null;
    setUser(normalizedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
    return normalizedUser;
  };

  const loginWithGoogle = (credential) => {
    try {
      const decoded = jwtDecode(credential);
      const userData = {
        id: String(decoded.sub || ""),
        email: decoded.email,
        name: decoded.name,
        photoURL: decoded.picture,
        picture: decoded.picture,
        provider: "google",
        displayName: decoded.name,
      };
      return login(userData);
    } catch (error) {
      console.error("Google login decode error:", error);
      return null;
    }
  };

  const logout = () => {
    const currentEmail = String(user?.email || "").toLowerCase();
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    if (currentEmail) {
      localStorage.removeItem(`chetakplus.address.suggestions.${currentEmail}`);
    }
    localStorage.removeItem("chetakplus.orders.updatedAt");
  };

  const updateUser = (userData) => {
    const newUser = normalizeAuthUser({ ...(user || {}), ...userData });
    if (!newUser) return;
    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  };

  const value = {
    user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
