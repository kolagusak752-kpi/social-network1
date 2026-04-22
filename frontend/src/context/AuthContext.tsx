import { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContext } from "../types/interfaces";

const AuthContext = createContext<AuthContext>({
  user: null,
  accessToken: null,
  loading: true,
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!refreshRes.ok) {
        const errorData = await refreshRes.json();
        throw new Error(errorData.message);
      }
      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData.accessToken;
      console.log(newAccessToken)
      setAccessToken(newAccessToken);

      const userRes = await fetch("/api/users/Me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        credentials: "include",
      });

      if (!userRes.ok) {
        throw new Error("Failed to fetch user");
      }

      const userData = await userRes.json();
      console.log(userData);
      setUser(userData);
    } catch (error) {
      setUser(null);
      setAccessToken(null);
      console.error(error);
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
