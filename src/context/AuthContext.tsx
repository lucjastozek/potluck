import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  getMe,
  login as apiLogin,
  register as apiRegister,
  updateDisplayName as apiUpdateDisplayName,
} from "@/api/auth";
import type { User } from "@/api/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    username: string,
    timezone: string,
  ) => Promise<void>;
  logout: () => void;
  updateDisplayName: (displayName: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const u = await getMe();
    setUser(u);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchMe()
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setIsLoading(false));
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await apiLogin(email, password);
    localStorage.setItem("token", token);
    setUser(user);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      username: string,
      timezone: string,
    ) => {
      const { user, token } = await apiRegister(
        email,
        password,
        displayName,
        username,
        timezone,
      );
      localStorage.setItem("token", token);
      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const updateDisplayName = useCallback(async (displayName: string) => {
    const updated = await apiUpdateDisplayName(displayName);
    setUser(updated);
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateDisplayName,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
