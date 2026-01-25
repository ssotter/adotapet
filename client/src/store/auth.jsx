import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("adotapet_token"),
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  async function fetchMe() {
    try {
      const { data } = await api.get("/me");
      setUser(data.data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("adotapet_token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchMe();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("adotapet_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("adotapet_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("adotapet_token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, setUser }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
