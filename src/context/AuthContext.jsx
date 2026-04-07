import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);
const AUTH_USER_KEY = "chetakplus.auth.user";
const AUTH_SESSION_KEY = "chetakplus.auth.session";

const parseStoredUser = (rawValue) => {
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserRaw = localStorage.getItem(AUTH_USER_KEY);
    const hasSession = sessionStorage.getItem(AUTH_SESSION_KEY) === "1";

    if (savedUserRaw && !hasSession) {
      localStorage.removeItem(AUTH_USER_KEY);
    } else if (savedUserRaw && hasSession) {
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
    setUser(userData);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    sessionStorage.setItem(AUTH_SESSION_KEY, "1");
  };

  const loginWithGoogle = (credential) => {
    try {
      const decoded = jwtDecode(credential);
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        provider: "google",
        displayName: decoded.name,
      };
      login(userData);
      return userData;
    } catch (error) {
      console.error("Google login decode error:", error);
      return null;
    }
  };

  const logout = () => {
    const currentEmail = String(user?.email || "").toLowerCase();
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    if (currentEmail) {
      localStorage.removeItem(`chetakplus.address.suggestions.${currentEmail}`);
    }
    localStorage.removeItem("chetakplus.orders.updatedAt");
  };

  const updateUser = (userData) => {
    const newUser = { ...user, ...userData };
    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    sessionStorage.setItem(AUTH_SESSION_KEY, "1");
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
