import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginPage, RegistrPage, HomePage, ProfilePage } from "./pages";
import { useAuth } from "./context/AuthContext";
import SettingsPage from "./pages/settingsPage";
import CropContainer from "./components/CropCotainer/CropContainer";
import Loader from "./components/Loading/Loader";
import Messenger from "./pages/messenger";
import DefaultLayout from "./layouts/DefaultLayout";

function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Loader />
        <Outlet />
      </>
    );
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
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/editAvatar" element={<CropContainer />} />
          <Route path="/messenger" element={<Messenger />} />
        </Route>
      </Route>
    </Routes>
  );
}
