import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const api = axios.create({ baseURL: API_URL });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  async function login(email, password) {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await axios.post(`${API_URL}/login`, form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    setToken(res.data.access_token);
    localStorage.setItem("token", res.data.access_token);
    return res.data;
  }

  async function signup(name, email, password) {
    const res = await axios.post(`${API_URL}/user/`, { name, email, password });
    return res.data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
