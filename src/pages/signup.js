import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Components/Container";
import Button from "../Components/Button";
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
  };

  return (
    <Container className="container--center">
      <div className="auth-page" style={{ maxWidth: 720, width: "100%" }}>
        <div className="signup-container">
          <img src="/imgs/AlkaroozCom.png" alt="Alkarooz" className="logo" />

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

            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
              <Link to="/" style={{ alignSelf: "center" }}>
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
