import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Components/Container";
import Button from "../Components/Button";
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

  return (
    <Container className="container--center">
      <div className="auth-page" style={{ maxWidth: 520, width: "100%" }}>
        <div className="login-container">
          <img src="/imgs/AlkaroozCom.png" alt="Alkarooz" className="logo" />

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="user">Email address or username</label>
            <input
              id="user"
              type="text"
              placeholder="Email address or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="pwd">Password</label>
            <div className="password-wrapper">
              <input
                id="pwd"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePassword}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="button"
              className="forgot"
              onClick={() => alert("Password reset flow not implemented")}
            >
              Forgot your password?
            </button>

            <div className="remember">
              <input type="checkbox" defaultChecked id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <Button variant="primary" type="submit">
              LOG IN
            </Button>
          </form>

          <div className="signup-section" style={{ marginTop: 12 }}>
            <p>Don't have an account?</p>
            <Link to="/signup" className="signup-btn">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
