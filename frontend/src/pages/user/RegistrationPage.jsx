/* --------------------------------------------------
   Registration page for both admin and public users
   ---------------------------------------------------*/

   import "../../App.css";
   import { useNavigate } from "react-router-dom";
   import { useState } from "react";
   import { BASE_URL } from "../../services/petsApi";
   
   export default function RegistrationPage() {
     const navigate = useNavigate();
   
     // State to manage form input values with default role field "user"
     const [formData, setFormData] = useState({
       email: "",
       password: "",
       role: "user",
       children: "", // will be "yes"/"no" in UI, converted before sending
       activity: "",
       secretKey: "",
     });
   
     // State for error and message
     const [error, setError] = useState("");
     const [message, setMessage] = useState("");
   
     // Handle change operation
     const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData((prev) => ({ ...prev, [name]: value }));
     };
   
     // Convert UI children value ("yes"/"no") to backend integer (1/0)
     const normalizeChildren = (val) => {
       if (val === "yes") return 1;
       if (val === "no") return 0;
       return null;
     };
   
     // Handle submit operation
     const handleSubmit = async (e) => {
       e.preventDefault();
       setError("");
       setMessage("");
   
       // Build payload for backend
       const data = {
         email: formData.email.trim().toLowerCase(),
         password: formData.password,
         role: formData.role, 
       };
   
       if (formData.role === "user") {
         data.children = normalizeChildren(formData.children);
         data.activity = formData.activity || null;
       }
   
       if (formData.role === "admin") {
         data.secretKey = (formData.secretKey || "").trim();
       }
   
       try {
         const response = await fetch(`${BASE_URL}/api/auth/register/`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(data),
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
           // Backend returns: { "errors": serializer.errors }
           const errors = result?.errors;
   
           if (errors && typeof errors === "object") {
             const msg = Object.entries(errors)
               .map(([field, msgs]) => {
                 const asText = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
                 return `${field}: ${asText}`;
               })
               .join(" | ");
             setError(msg || "Registration failed");
           } else {
             setError(result?.error || result?.detail || "Registration failed");
           }
           return;
         }
   
         setMessage(result.message || "Registration Successful");
   
         // Reset the form input values with default role field "user"
         setFormData({
           email: "",
           password: "",
           role: "user",
           children: "",
           activity: "",
           secretKey: "",
         });
   
         // After successfully registering, navigate to login page
         navigate("/login");
       } catch (err) {
         console.error("Registration error:", err);
         setError("Error! Please try again");
       }
     };
   
     return (
       <div className="register-page">
         <h2>Register for User or Admin Account</h2>
         {error && <p className="error">{error}</p>}
         {message && <p className="success">{message}</p>}
   
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
             placeholder="Enter Password (8+ characters)"
             value={formData.password}
             onChange={handleChange}
             required
           />
   
           {/* Select Role */}
           <select name="role" value={formData.role} onChange={handleChange}>
             <option value="user">User Account</option>
             <option value="admin">Admin Account</option>
           </select>
   
           {/* Fields for User Account Only */}
           {formData.role === "user" && (
             <>

             <div>
              <h4>Tell Us a Bit About Your Home.</h4>
             </div>
               {/* Children Radio Buttons */}
               <div className="has-children-field">
                 <label className="title">Are there children in your household?
                  <span
                    title="This helps to recommend pets who do well in households with children."
                    style={{marginLeft: 6, cursor: "help"}}
                    >
                      ⓘ
                  </span>
                 </label>
                 <div className="has-children-options">
                   <label className="option">
                     <input
                       type="radio"
                       name="children"
                       value="yes"
                       checked={formData.children === "yes"}
                       onChange={handleChange}
                       required
                     />
                     Yes
                   </label>
                   <label className="option">
                     <input
                       type="radio"
                       name="children"
                       value="no"
                       checked={formData.children === "no"}
                       onChange={handleChange}
                       required
                     />
                     No
                   </label>
                 </div>
               </div>
   
               {/* Activity Level Dropdown */}
                <div className="activity-field">
                 <label className="title">How active is your current lifestyle?
                  <span
                    title="This helps to recommend pets who fit your daily routine."
                    style={{marginLeft: 6, cursor: "help"}}
                    >
                      ⓘ
                  </span>
                  </label>
                  </div>
               <select name="activity" value={formData.activity} onChange={handleChange}>
                 <option value="">Select Activity Level</option>
                 <option value="low">Low</option>
                 <option value="medium">Medium</option>
                 <option value="high">High</option>
               </select>
             </>
           )}
   
           {/* Field for Admin Account Only */}
           {formData.role === "admin" && (
            <>
            <p>
              Please enter the Secret Key:
            </p>
             <input
               type="password"
               name="secretKey"
               placeholder="Admin Secret Key"
               value={formData.secretKey}
               onChange={handleChange}
               required
             />
             </>
           )}
   
           <button className="register-button" type="submit">
             Register
           </button>
         </form>
       </div>
     );
   }
   