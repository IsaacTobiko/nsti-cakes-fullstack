import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true",
  );
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true",
  );

  const api = axios.create({ baseURL: API_URL, withCredentials: true });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  function markLoggedIn(data) {
    setIsAdmin(data.is_admin === true);
    localStorage.setItem("isAdmin", String(data.is_admin === true));
    setLoggedIn(true);
    localStorage.setItem("loggedIn", "true");
  }

  async function login(email, password, remember = false) {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await axios.post(
      `${API_URL}/login?remember=${remember}`,
      form,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      },
    );

    markLoggedIn(res.data);
    return res.data;
  }

  async function signup(name, email, password) {
    const res = await axios.post(`${API_URL}/user/`, { name, email, password });
    return res.data;
  }

  async function googleLogin(credential) {
    const res = await axios.post(
      `${API_URL}/auth/google`,
      { credential },
      { withCredentials: true },
    );
    markLoggedIn(res.data);
    return res.data;
  }

  async function logout() {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (e) {
      console.error("Logout request failed", e);
    }
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("loggedIn");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAdmin,
        loggedIn,
        login,
        signup,
        googleLogin,
        logout,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
