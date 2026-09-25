/* --------------------------------------------------
   Layout for all common public pages (non Admin/ non User)
   --------------------------------------------------- */

import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <Navbar type="common" />
      <Outlet />
    </>
  );
}
