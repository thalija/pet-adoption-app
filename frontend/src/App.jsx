/* --------------------------
   Integrates the app, defines the page layouts and routes
   ------------------------- */

// Import dependencies
import { Routes, Route, Navigate } from "react-router-dom";

import CommonLayout from "./layouts/CommonLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Import pages publicly accessible without authentication
import LandingPage from "./pages/user/LandingPage";
import RegistrationPage from "./pages/user/RegistrationPage";
import LoginPage from "./pages/user/LoginPage";

// Import User pages
import UserHomePage from "./pages/user/UserHomePage";
import PetProfile from "./pages/user/PetProfile";
import ShelterInfo from "./pages/user/ShelterInfo";

// Import Admin pages
import AdminPetsList from "./pages/admin/AdminPetsList";
import AdminNewPet from "./pages/admin/AdminNewPet";
import AdminEditPet from "./pages/admin/AdminEditPet";

import "./styles/buttons.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* PUBLIC (no navbar) */}
      <Route element={<CommonLayout />}>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* USER (user navbar) */}
      <Route element={<UserLayout />}>
        <Route path="/user" element={<UserHomePage />} />
        <Route path="/pets/:petId" element={<PetProfile />} />
        <Route path="/shelter" element={<ShelterInfo />} />
      </Route>

      {/* Admins use the shared login page */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* ADMIN (admin navbar) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="pets" replace />} />
        <Route path="pets" element={<AdminPetsList />} />
        <Route path="pets/new" element={<AdminNewPet />} />
        <Route path="pets/:petId/edit" element={<AdminEditPet />} />
      </Route>

      <Route path="*" element={<p>Not Found</p>} />
    </Routes>
  );
}