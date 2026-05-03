import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContext } from "../types/interfaces";
import { usersApi } from "../api/users";
import { authApi } from "../api/auth";

const AuthContext = createContext<AuthContext>({
  user: null,
  accessToken: null,
  loading: true,
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const userData = await usersApi.getMe();
      setUser(userData);
      const { accessToken: token } = await authApi.getToken();
      setAccessToken(token);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
