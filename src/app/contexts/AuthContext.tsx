import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { ApiService } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, cpf: string, role?: "visitor" | "admin") => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, cpf: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe sessão salva no localStorage
    const savedToken = localStorage.getItem("tere_verde_token");
    const savedUser = localStorage.getItem("tere_verde_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const response = await ApiService.login(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("tere_verde_token", response.token);
      localStorage.setItem("tere_verde_user", JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, cpf: string, role: "visitor" | "admin" = "visitor") => {
    setLoading(true);
    try {
      const response = await ApiService.register(name, email, cpf, role);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("tere_verde_token", response.token);
      localStorage.setItem("tere_verde_user", JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("tere_verde_token");
    localStorage.removeItem("tere_verde_user");
  };

  const updateProfile = async (name: string, cpf: string) => {
    if (!user) throw new Error("Nenhum usuário logado.");
    setLoading(true);
    try {
      const updatedUser = await ApiService.updateProfile(user.id, name, cpf);
      setUser(updatedUser);
      localStorage.setItem("tere_verde_user", JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
