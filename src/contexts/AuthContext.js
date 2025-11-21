import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, signup as apiSignup } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("authToken");
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // placeholder: could fetch user profile when token changes
  }, [token]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await apiLogin(payload);
      if (res?.token) setToken(res.token);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const res = await apiSignup(payload);
      if (res?.token) setToken(res.token);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    try {
      localStorage.removeItem("authToken");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
