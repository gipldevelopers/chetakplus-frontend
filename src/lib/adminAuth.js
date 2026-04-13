const ADMIN_SESSION_KEY = "cp_admin_session";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const getAdminSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!rawValue) {
    return null;
  }

  if (rawValue === "active") {
    return {
      token: "legacy-session",
      admin: {
        name: "Admin User",
        email: "admin@chetakplus.com",
      },
    };
  }

  const parsed = safeParse(rawValue);
  if (!parsed || !parsed.token) {
    return null;
  }

  return parsed;
};

export const isAdminAuthenticated = () => Boolean(getAdminSession()?.token);

export const setAdminSession = (session) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!session || !session.token) {
    return;
  }

  window.localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      token: session.token,
      admin: session.admin || null,
      loginAt: new Date().toISOString(),
    }),
  );
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};
