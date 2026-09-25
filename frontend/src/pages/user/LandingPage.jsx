/* ----------------------------------------
   Landing page for both admin and public 
   -----------------------------------------*/

import "../../App.css";
import logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="landing-page">
            <div className="landing-container">
                <h1>Dating App for Animal Adoption</h1>
                <img className="app-logo" src={logo} alt="App Logo" />
                <p className="welcome-text">Welcome! Helping animals find the homes they deserve.</p>
                <button className="login-button" onClick={handleLoginClick}>Login</button>
                <button className="register-button" onClick={handleRegisterClick}>Register</button>
            </div>
        </div>
    );
}