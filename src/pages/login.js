import React, { useState } from "react";
import { Link } from "react-router-dom";   // ✅ استخدم Link بدل a
import "../styles/aouth.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter both username/email and password.");
      return;
    }
    alert("Logging in...");
  };

  const mockLogin = (service) => {
    alert("Logging in with " + service);
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <img src="/imgs/AlkaroozCom.png" alt="rannim" className="logo" />

        <button className="btn facebook" onClick={() => mockLogin("Facebook")}>
          <img src="/imgs/facebook.svg" alt="Facebook" className="icon" />
          Continue with Facebook
        </button>

        <button className="btn apple" onClick={() => mockLogin("Apple")}>
          <img src="/imgs/apple.png" alt="Apple" className="icon" />
          Continue with Apple
        </button>

        <button className="btn google" onClick={() => mockLogin("Google")}>
          <img src="/imgs/google.svg" alt="Google" className="icon" />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email address or username</label>
          <input
            type="text"
            placeholder="Email address or username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={togglePassword}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <a href="#" className="forgot">
            Forgot your password?
          </a>

          <div className="remember">
            <input type="checkbox" defaultChecked />
            <label id="m">Remember me</label>
          </div>

          <button type="submit" className="login-btn">
            LOG IN
          </button>
        </form>

        <div className="signup-section">
          <p>Don't have an account?</p>
          {/* ✅ استخدم Link بدل a */}
          <Link to="/signup" className="signup-btn">
            Sign up for Spotify
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
