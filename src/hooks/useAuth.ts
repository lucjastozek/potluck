// Re-export for convenience — import from here rather than the context file
export { useAuth } from "@/context/AuthContext";

/**
 * Like useAuth but throws at runtime if no user is present.
 * Use inside ProtectedRoute-wrapped pages where user is guaranteed.
 */
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/api/auth";

interface AuthenticatedUser {
  user: User;
  logout: () => void;
}

export function useRequireAuth(): AuthenticatedUser {
  const { user, logout } = useAuth();
  if (!user) throw new Error("useRequireAuth: user is null — page must be wrapped in ProtectedRoute");
  return { user, logout };
}
