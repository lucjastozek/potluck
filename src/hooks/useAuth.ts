import { useAuth } from "@/context/AuthContext";
import type { User } from "@/api/auth";

interface AuthenticatedUser {
  user: User;
  logout: () => void;
}

export function useRequireAuth(): AuthenticatedUser {
  const { user, logout } = useAuth();
  if (!user)
    throw new Error(
      "useRequireAuth: user is null — page must be wrapped in ProtectedRoute",
    );
  return { user, logout };
}
