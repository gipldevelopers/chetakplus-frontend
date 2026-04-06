const ADMIN_SESSION_KEY = "cp_admin_session";

export const isAdminAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "active";
};

export const setAdminSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};
