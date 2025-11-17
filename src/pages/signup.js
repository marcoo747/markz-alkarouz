import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/aouth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    country: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fileName, setFileName] = useState("Profile Photo (Optional)");

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "photo") {
      setFormData({ ...formData, photo: files[0] });
      setFileName(files[0] ? files[0].name : "No file chosen");
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Signed up successfully!");
    // هنا ممكن تضيف API call للتسجيل الحقيقي
  };

  const mockLogin = (service) => {
    alert("Signing up with " + service);
  };

  return (
    <div className="auth-page">
      <div className="signup-container">
        <img src="/imgs/AlkaroozCom.png" alt="Spotify" className="logo" />

        {/* Social Buttons */}
        <button className="btn facebook" onClick={() => mockLogin("Facebook")}>
          <img src="../imgs/facebook.svg" alt="Facebook" className="icon" />
          Continue with Facebook
        </button>

        <button className="btn apple" onClick={() => mockLogin("Apple")}>
          <img src="../imgs/apple.png" alt="Apple" className="icon" />
          Continue with Apple
        </button>

        <button className="btn google" onClick={() => mockLogin("Google")}>
          <img src="../imgs/google.svg" alt="Google" className="icon" />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Sign Up Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            id="phone"
            placeholder="Phone Number (Optional)"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <select
            id="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select your country</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="Egypt">Egypt</option>
          </select>

          {/* Password */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* File Upload */}
          <div className="file-input-wrapper">
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleChange}
            />
            <span
              className="file-input-text"
              onClick={() => document.getElementById("photo").click()}
            >
              {fileName}
            </span>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        {/* Link to Login */}
        <div className="login-section">
          <p>Already have an account?</p>
          <Link to="/" className="login-btn">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
