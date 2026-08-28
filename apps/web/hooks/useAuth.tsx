/**
 * React Query hooks for auth.
 *
 * Provides:
 * - useAuth() — main hook: user, status, login, register, signOut
 * - useLogin() — mutation for login
 * - useRegister() — mutation for registration
 *
 * Token is stored in localStorage and managed by lib/auth.ts.
 * React Query handles caching, refetching, and stale state.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  refreshToken,
  getToken,
  setToken,
  clearToken,
  isTokenExpired,
  type AuthUser,
} from "@/lib/auth";

// ── Query key ────────────────────────────────────────────────────

const AUTH_QUERY_KEY = ["auth", "currentUser"];

// ── Hook: useAuth ────────────────────────────────────────────────

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check if we have a token — determines whether to fetch user
  const token = typeof window !== "undefined" ? getToken() : null;
  const hasToken = token !== null && !isTokenExpired(token);

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AuthUser | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const storedToken = getToken();
      if (!storedToken) return null;

      // Quick local expiry check
      if (isTokenExpired(storedToken)) {
        // Try to refresh
        try {
          const { token: newToken } = await refreshToken(storedToken);
          setToken(newToken);
        } catch {
          clearToken();
          return null;
        }
      }

      // Verify with server
      try {
        return await fetchCurrentUser();
      } catch {
        // Token invalid — try refresh
        const currentToken = getToken();
        if (!currentToken) return null;
        try {
          const { token: newToken } = await refreshToken(currentToken);
          setToken(newToken);
          return await fetchCurrentUser();
        } catch {
          clearToken();
          return null;
        }
      }
    },
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes before refetch
    refetchOnWindowFocus: false,
  });

  // When there's no token, isLoading stays true because the query is disabled.
  // We need to treat "no token" as "unauthenticated", not "loading".
  const status: "loading" | "authenticated" | "unauthenticated" =
    !hasToken
      ? "unauthenticated"
      : isLoading
        ? "loading"
        : user
          ? "authenticated"
          : "unauthenticated";

  // ── Login mutation ───────────────────────────────────────────

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await loginUser(email, password);
      setToken(res.token);
      return res.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push("/notes");
    },
  });

  // ── Register mutation ────────────────────────────────────────

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await registerUser(email, password);
      setToken(res.token);
      return res.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push("/notes");
    },
  });

  // ── Sign out ─────────────────────────────────────────────────

  const signOut = () => {
    clearToken();
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    router.push("/auth");
  };

  return {
    user: user ?? null,
    status,
    isLoading,
    isAuthenticated: status === "authenticated",
    error: error ? (error as Error).message : loginMutation.error
      ? (loginMutation.error as Error).message
      : registerMutation.error
        ? (registerMutation.error as Error).message
        : null,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    signOut,
    refetch,
  };
}

// ── Standalone mutations (if you need them separately) ───────────

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await loginUser(email, password);
      setToken(res.token);
      return res.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push("/notes");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await registerUser(email, password);
      setToken(res.token);
      return res.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push("/notes");
    },
  });
}