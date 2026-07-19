import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api, ApiError } from "@/utils/api";

interface User {
  id: string;
  email: string;
  role: "super_user" | "admin" | "user";
}

type SessionType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  error: string | null;
  status: string;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function setToken(token: string) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

const defaultSession: SessionType = {
  user: { id: "", email: "", role: "user" },
  login: async () => {},
  register: async () => {},
  signOut: () => {},
  error: null,
  status: "loading",
};

const SessionContext = createContext<SessionType>(defaultSession);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState<User>({ id: "", email: "", role: "user" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Validate token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    api
      .get<{ id: string; email: string; role: "super_user" | "admin" | "user" }>("/api/auth/me")
      .then((u) => {
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        clearToken();
        setStatus("unauthenticated");
      });
  }, []);

  const login = async (email: string, password: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.post<{
        user: User;
        token: string;
      }>("/api/auth/login", { email, password });
      setToken(res.token);
      setUser(res.user);
      setStatus("authenticated");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      setError(message);
      setStatus("unauthenticated");
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.post<{
        user: User;
        token: string;
      }>("/api/auth/register", { email, password });
      setToken(res.token);
      setUser(res.user);
      setStatus("authenticated");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Registration failed";
      setError(message);
      setStatus("unauthenticated");
      throw err;
    }
  };

  const signOut = () => {
    clearToken();
    setUser({ id: "", email: "", role: "user" });
    setStatus("unauthenticated");
    router.push("/auth");
  };

  return (
    <SessionContext.Provider value={{ user, login, register, signOut, error, status }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession hook must be used within SessionProvider");
  }
  return context;
};
