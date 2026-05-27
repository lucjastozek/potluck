import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/api/auth";

interface RoleRouteProps {
  allowedRoles: Array<User["role"]>;
  children: JSX.Element;
}

export default function RoleRoute({
  allowedRoles,
  children,
}: RoleRouteProps): JSX.Element {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}
