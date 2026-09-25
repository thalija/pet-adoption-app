import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  return (
    <>
      <Navbar type="user" />
      <Outlet />
    </>
  );
}
