/**
 * Auth service — thin wrapper around localStorage + React Query.
 *
 * This is the single source of truth for auth state.
 * Components use `useAuth()` (React Query hook) instead of reading localStorage directly.
 */

import { api } from "@/utils/api";

// ── Types ────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: "super_user" | "admin" | "user";
}

// ── Token helpers ────────────────────────────────────────────────

const TOKEN_KEY = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode a JWT without verifying the signature (client-side only).
 * Returns null if the token is malformed.
 */
function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

/**
 * Check if a JWT is expired by inspecting its `exp` claim.
 * Returns true if expired, malformed, or missing exp.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== "number") return true;
  // Add a 30-second buffer to avoid race conditions
  return Date.now() >= payload.exp * 1000 - 30_000;
}

// ── API calls ────────────────────────────────────────────────────

export async function fetchCurrentUser(): Promise<AuthUser> {
  return api.get<AuthUser>("/api/auth/me");
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  return api.post<{ user: AuthUser; token: string }>("/api/auth/login", {
    email,
    password,
  });
}

export async function registerUser(
  email: string,
  password: string,
): Promise<{ user: AuthUser; token: string }> {
  return api.post<{ user: AuthUser; token: string }>("/api/auth/register", {
    email,
    password,
  });
}

export async function refreshToken(
  token: string,
): Promise<{ token: string }> {
  return api.post<{ token: string }>("/api/auth/refresh", { token });
}