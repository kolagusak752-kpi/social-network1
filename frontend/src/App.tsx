import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginPage, RegistrPage, HomePage, ProfilePage } from "./pages";
import { useAuth } from "./context/AuthContext";
import Settings from "./components/Settings/Settings";

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
        <Route path="/" element={<HomePage/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path = "/settings" element = {<Settings />} />

      </Route>
    </Routes>
  );
}
