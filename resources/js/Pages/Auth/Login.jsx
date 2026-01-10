import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import Message from "@/Components/Message";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    mobile: "",
    password: "",
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional client-side validation
    if (!data.mobile || data.mobile.replace(/\D/g, "").length !== 11) {
      alert("Mobile number must be exactly 11 digits.");
      return;
    }
    if (!data.password) {
      alert("Password is required.");
      return;
    }

    // POST request using useForm (Inertia adds CSRF token automatically)
    post(route("login.store"), {
      onSuccess: () => {
        router.visit(route("home"));
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <Container className="container--center">
        <div className="auth-page" style={{ maxWidth: 520, width: "100%" }}>
          <div className="login-container">
            <img src="imgs/AlkaroozCom.png" alt="Alkarooz" className="logo" />

            <form className="login-form" onSubmit={handleSubmit} method="post">
              {/* Mobile input */}
              <div>
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={data.mobile}
                  onChange={(e) => setData("mobile", e.target.value)}
                  className={errors.mobile ? "input-error" : undefined}
                  required
                />
                {errors.mobile && <div className="error-text">{errors.mobile}</div>}
              </div>

              {/* Password input */}
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className={errors.password ? "input-error" : undefined}
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
                {errors.password && <div className="error-text">{errors.password}</div>}
              </div>

              {/* Forgot password */}
              <button
                type="button"
                className="forgot"
                onClick={() =>
                  alert("Please contact support to reset your password.")
                }
              >
                Forgot your password?
              </button>

              {/* Submit button */}
              <button type="submit" className="btn btn-success mt-1" disabled={processing}>
                LOG IN
              </button>
            </form>

            <p className="mt-3 mb-0">Do not have an account?</p>
            <Link href={route("sign_up")} className="btn btn-primary mt-0">
              Sign Up
            </Link>

            {/* Optional server messages */}
            {errors.general && <Message type="error">{errors.general}</Message>}
          </div>
        </div>
      </Container>
    </>
  );
}
