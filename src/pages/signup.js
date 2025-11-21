import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Components/Container";
import Button from "../Components/Button";
import Message from "../Components/Message";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PasswordChecklist from "../Components/PasswordChecklist";
// auth styles moved to theme.css

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // fileName removed (not used); keep photo in formData if provided
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
      // clear existing error for this field
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case "fullName":
        if (!value || value.trim().length < 2)
          return "Please enter your full name.";
        return;
      case "phone":
        if (!value) return "Please enter your phone number.";
        // count only digits to validate length
        const digits = value.replace(/\D/g, "");
        if (digits.length !== 11)
          return "Phone number must be exactly 11 digits.";
        return;
      case "password":
        if (!value || value.length < 8)
          return "Password must be at least 8 characters.";
        // require at least one lowercase, one uppercase and one number
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return "Password must include uppercase, lowercase letters and a number.";
        return;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match.";
        return;
      default:
        return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // validate all fields
    ["fullName", "phone", "password", "confirmPassword"].forEach((f) => {
      const msg = validateField(f, formData[f]);
      if (msg) newErrors[f] = msg;
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setSuccess("");

    try {
      await auth.signup(formData);
      setSuccess("Signed up successfully.");
      setTimeout(() => navigate("/home"), 700);
    } catch (err) {
      setServerError(err?.message || "Server error");
    }
  };

  return (
    <Container className="container--center">
      <div className="auth-page" style={{ maxWidth: 720, width: "100%" }}>
        <div className="signup-container">
          <img src="/imgs/AlkaroozCom.png" alt="Alkarooz" className="logo" />

          <form className="signup-form" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                id="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={errors.fullName ? "true" : "false"}
                aria-describedby={errors.fullName ? "err-fullName" : undefined}
                className={errors.fullName ? "input-error" : undefined}
              />
              {errors.fullName && (
                <div id="err-fullName" className="error-text">
                  {errors.fullName}
                </div>
              )}
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                aria-required="true"
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
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                title="Password must be at least 8 characters and include uppercase, lowercase and a number"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "err-password" : undefined}
                className={errors.password ? "input-error" : undefined}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
              {errors.password && (
                <div id="err-password" className="error-text">
                  {errors.password}
                </div>
              )}
            </div>
            <PasswordChecklist
              password={formData.password}
              confirmPassword={formData.confirmPassword}
            />

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={
                  errors.confirmPassword ? "err-confirmPassword" : undefined
                }
                className={errors.confirmPassword ? "input-error" : undefined}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
              {errors.confirmPassword && (
                <div id="err-confirmPassword" className="error-text">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div className="file-input-wrapper">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </form>

          {serverError && <Message type="error">{serverError}</Message>}
          {success && <Message type="success">{success}</Message>}

          <div className="login-section" style={{ marginTop: 12 }}>
            <p>Already have an account?</p>
            <Link to="/" className="login-btn">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
