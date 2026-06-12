import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // Restore user session on refresh
  // =========================
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/me");

        // backend returns full user object
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // =========================
  // REGISTER + auto login
  // =========================
  const register = async (name, email, password) => {
    setAuthLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });

      // login immediately after register
      await login(email, password);

    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================
  // LOGIN + redirect by role
  // =========================
  const login = async (email, password) => {
    setAuthLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      setUser(res.data.user);

      const role = String(res.data.user.role || "").trim().toLowerCase();

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login", { replace: true });
  };

    return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authLoading,
        login,
        register,
        logout,
        isAdmin: String(user?.role || "").trim().toLowerCase() === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);