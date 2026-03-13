import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginPage, RegistrPage } from "./pages";
import { useAuth } from "./context/AuthContext";

function RequireAuth() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrPage />} />

      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />

      </Route>
    </Routes>
  );
}
