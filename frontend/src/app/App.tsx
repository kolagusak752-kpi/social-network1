import LoginPage from "../pages/loginPage";
import RegistrPage from "../pages/registrPage";
import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";


import { Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<HomePage></HomePage>} />
    </Routes>
  );
}
