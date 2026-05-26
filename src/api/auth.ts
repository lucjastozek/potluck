import { api } from "./client";

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

export async function register(
  email: string,
  password: string,
  displayName: string,
  username: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/register", {
    email,
    password,
    displayName,
    username,
  });
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/api/auth/login", { email, password });
}

export async function getMe(): Promise<User> {
  const res = await api.get<{ user: User }>("/api/auth/me");
  return res.user;
}

export async function updateDisplayName(displayName: string): Promise<User> {
  const res = await api.patch<{ user: User }>("/api/auth/me", { displayName });
  return res.user;
}
