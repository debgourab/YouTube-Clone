import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("yt_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("yt_user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("yt_token");
    localStorage.removeItem("yt_user");
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("yt_token");
    if (!token) {
      setInitializing(false);
      return;
    }

    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("yt_user", JSON.stringify(data.user));
      })
      .catch(logout)
      .finally(() => setInitializing(false));
  }, [logout]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      await api.post("/auth/register", payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("yt_token", data.token);
      localStorage.setItem("yt_user", JSON.stringify(data.user));
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, initializing, register, login, logout, setUser }),
    [user, loading, initializing, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
