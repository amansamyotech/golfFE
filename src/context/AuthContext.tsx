"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "Admin" | "SuperAdmin" | "Manager" | "Staff" | "Member" | null;

interface AuthUser {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  setAuthFromStorage: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setAuthFromStorage = () => {
    if (typeof window === "undefined") return;
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "auth-token=; path=/; max-age=0";
    document.cookie = "auth-user=; path=/; max-age=0";
    setUser(null);
    setToken(null);
    window.location.href = "/signin";
  };

  useEffect(() => {
    setAuthFromStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        token,
        isAuthenticated: !!token && !!user,
        setAuthFromStorage,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
