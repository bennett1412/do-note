/**
 * Session context — thin wrapper around useAuth() for backward compatibility.
 *
 * Existing components import { useSession } from "@/hooks/useSession".
 * Under the hood it uses React Query via useAuth().
 */

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useAuth } from "./useAuth";

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
  const auth = useAuth();

  const value: SessionType = {
    user: auth.user ?? { id: "", email: "", role: "user" },
    login: async (email: string, password: string) => {
      await auth.login({ email, password });
    },
    register: async (email: string, password: string) => {
      await auth.register({ email, password });
    },
    signOut: auth.signOut,
    error: auth.error,
    status: auth.status,
  };

  return (
    <SessionContext.Provider value={value}>
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