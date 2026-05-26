import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

/**
 * Wrap any route that requires authentication.
 * Redirects to /login and remembers where the user was trying to go.
 *
 * Usage in your router:
 *   <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Avoids a flash-redirect while the token is being verified on mount
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
