/* --------------------------
   Navbar for User and Admin
   -------------------------- */

   import React from "react";
   import { Link, useLocation, useNavigate } from "react-router-dom";
   import "./Navbar.css";
   
   function Navbar({ type }) {
     const navigate = useNavigate();
     const location = useLocation();
   
     // Determine user type if not explicitly passed
     const userType =
       type ?? (location.pathname.startsWith("/admin") ? "admin" : "user");
   
     // Determine if we're on a pet profile page
     const isPetProfile = location.pathname.startsWith("/pets/");
   
     // Determine if we're on the shelter info page
     const isShelterInfo = location.pathname === "/shelter";
   
     const logout = () => {
       // Clear everything the login page stored
       ["accessToken", "userEmail", "userRole", "token"].forEach((key) =>
         localStorage.removeItem(key)
       );
       navigate("/"); // Landing page
     };
   
     return (
       <nav className="navbar">
         {/* Common Pages Navigation */}
         {type === "common" && (
           <>
             <Link to="/">Home</Link>
           </>
         )}
   
         {/* User Navigation */}
         {userType === "user" && (
           <>
             {isPetProfile || isShelterInfo ? (
               <button onClick={() => navigate(-1)} className="back-button">
                 Back
               </button>
             ) : (
               <button onClick={logout} className="logout">
                 Logout
               </button>
             )}
           </>
         )}
   
         {/* Admin Navigation */}
         {userType === "admin" && (
           <>
             <Link to="/">Home</Link>
             {/* This IS the admin dashboard */}
             <Link to="/admin/pets">Manage Pet Profiles</Link>
             <Link to="/admin/pets/new">Add Pet</Link>
   
             <button onClick={logout} className="logout">
               Logout
             </button>
           </>
         )}
       </nav>
     );
   }
   
   export default Navbar;