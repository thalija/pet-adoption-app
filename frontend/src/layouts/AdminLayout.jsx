/* --------------------------
   Layout, styling for the admin home page
   Wrapper for admin pages - navbar
   ------------------------- */

import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <Navbar type="admin" />
      <Outlet />
    </>
  );
}
