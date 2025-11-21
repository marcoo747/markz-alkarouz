import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../Components/Container";
import Button from "../Components/Button";
import Message from "../Components/Message";
import { useAuth } from "../contexts/AuthContext";
// auth styles moved to theme.css

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!phone) {
      newErrors.phone = "Please enter your phone number.";
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 11)
        newErrors.phone = "Phone number must be exactly 11 digits.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setSuccess("");

    try {
      await auth.login({ phone, password });
      setSuccess("Logged in successfully.");
      setTimeout(() => navigate("/home"), 700);
    } catch (err) {
      setServerError(err?.message || "Server error");
    }
  };

  return (
    <Container className="container--center">
      <div className="auth-page" style={{ maxWidth: 520, width: "100%" }}>
        <div className="login-container">
          <img src="/imgs/AlkaroozCom.png" alt="Alkarooz" className="logo" />

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <input
                id="phone"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                required
                pattern="[0-9]{11}"
                title="Enter exactly 11 digits (numbers only)"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                className={errors.phone ? "input-error" : undefined}
              />
              {errors.phone && (
                <div id="err-phone" className="error-text">
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                required
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "err-password" : undefined}
                className={errors.password ? "input-error" : undefined}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePassword}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              {errors.password && (
                <div id="err-password" className="error-text">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="button"
              className="forgot"
              onClick={() =>
                setServerError("Please contact support to reset your password.")
              }
            >
              Forgot your password?
            </button>

            <Button variant="primary" type="submit">
              LOG IN
            </Button>
          </form>

          {serverError && <Message type="error">{serverError}</Message>}
          {success && <Message type="success">{success}</Message>}

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
