/* ---------------------------------------------
   Login page for both admin and public users
   ---------------------------------------------*/

   import "../../App.css";
   import { useNavigate } from "react-router-dom";
   import { useState } from "react";
   import { BASE_URL } from "../../services/petsApi";
   
   export default function LoginPage() {
     const navigate = useNavigate();
   
     // State to manage form input values
     const [formData, setFormData] = useState({
       email: "",
       password: "",
     });
   
     // State for error message
     const [error, setError] = useState("");
     // True while waiting for the server (it can take a minute to wake up on the free host)
     const [loading, setLoading] = useState(false);
   
     // Handle change operation
     const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData((prev) => ({ ...prev, [name]: value }));
     };
   
     // Handle submit operation
     const handleSubmit = async (e) => {
       e.preventDefault();
       setError("");
       setLoading(true);
   
       try {
         const response = await fetch(`${BASE_URL}/api/auth/token/`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             email: formData.email,
             password: formData.password,
           }),
         });
   
         // Read text first so we can always show useful errors
         const rawText = await response.text();
         let result = {};
         try {
           result = JSON.parse(rawText);
         } catch {
           result = { raw: rawText };
         }
   
         if (!response.ok) {
           console.error("Login failed:", response.status, result);
   
           // Backend returns { errors: {...} } on validation failure
           const errors = result?.errors;
   
           // Try to format errors nicely
           if (errors && typeof errors === "object") {
             const msg = Object.entries(errors)
               .map(([field, msgs]) => {
                 const asText = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
                 return `${field}: ${asText}`;
               })
               .join(" | ");
             setError(msg || "Login failed");
           } else {
             setError(result?.error || result?.detail || "Login failed");
           }
           return;
         }
   
         localStorage.setItem("accessToken", result.access);
   
         if (result.user) {
           localStorage.setItem("userEmail", result.user.email || "");
           localStorage.setItem("userRole", result.user.role || "");
         }
   
         // Route based on role returned by  backend
         if (result?.user?.role === "admin") {
           navigate("/admin/pets");
         } else {
           navigate("/user");
         }
       } catch (err) {
         console.error("Login error:", err);
         setError("Could not reach the server. Please try again in a moment.");
       } finally {
         setLoading(false);
       }
     };
   
     return (
       <div className="register-page">
         <h2>Login to User or Admin Account</h2>
         {error && <p className="error">{error}</p>}
   
         <form onSubmit={handleSubmit}>
           <input
             type="email"
             name="email"
             placeholder="Enter Email"
             value={formData.email}
             onChange={handleChange}
             required
           />
   
           <input
             type="password"
             name="password"
             placeholder="Enter Password"
             value={formData.password}
             onChange={handleChange}
             required
           />
   
           <button className="register-button" type="submit" disabled={loading}>
             {loading ? "Logging in…" : "Login"}
           </button>
           {loading && (
             <p>The demo server may take up to a minute to wake up.</p>
           )}
         </form>
       </div>
     );
   }
   