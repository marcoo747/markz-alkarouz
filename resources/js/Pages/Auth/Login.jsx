import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import Message from "@/Components/Message";
import { useTranslation } from "react-i18next";
import logo from "../../../imgs/AlkaroozCom.png";
import fallbackImg1 from "../../../imgs/shopping.webp";
import fallbackImg2 from "../../../imgs/img1.jpg";

export default function Login({ carouselPhotos = [] }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  const toggleLang = () => {
    i18n.changeLanguage(isRTL ? "en" : "ar");
  };
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, setData, post, processing, errors } = useForm({
    mobile: "",
    password: "",
  });

  // Determine images to use: carousel from DB, or fallback to local imgs
  const slides = carouselPhotos.length > 0
    ? carouselPhotos
    : [fallbackImg1, fallbackImg2];


  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.mobile || data.mobile.replace(/\D/g, "").length !== 11) {
      alert(t("auth.mobile_11_digits"));
      return;
    }
    if (!data.password) {
      alert(t("auth.password_required"));
      return;
    }
    post(route("login.store"), {
      onSuccess: () => router.visit(route("home")),
      onError: (err) => console.log(err),
    });
  };

  return (
    <>
      <Head title={t("home.page_title")} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ════════════════════════════
           LEFT — carousel background
        ════════════════════════════ */
        .login-left {
          display: none;
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .login-left { display: block; } }

        /* Slide images */
        .login-slide {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
          opacity: 0;
        }
        .login-slide.active { opacity: 1; }

        /* Dark overlay so text is readable */
        .login-slide-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10,20,60,0.72) 0%,
            rgba(10,20,60,0.45) 60%,
            rgba(10,20,60,0.65) 100%
          );
        }

        /* Branding content on top of carousel */
        .login-left-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 2;
          padding: 48px;
          text-align: center;
          color: #fff;
        }
        .login-left-logo {
          width: 130px;
          margin-bottom: 28px;
          object-fit: contain;
          filter: drop-shadow(0 2px 12px rgba(0,0,0,0.3));
        }
        .login-left-content h2 {
          font-size: 30px; font-weight: 800;
          line-height: 1.25; letter-spacing: -0.4px;
          margin-bottom: 14px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .login-left-content p {
          font-size: 15px; color: rgba(255,255,255,0.8);
          line-height: 1.75; max-width: 360px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.35);
        }

        /* Slide dots */
        .login-dots {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 3;
        }
        .login-dot {
          height: 8px; border-radius: 4px;
          background: rgba(255,255,255,0.4);
          transition: width 400ms ease, background 400ms ease;
          width: 8px; cursor: pointer; border: none;
        }
        .login-dot.active { width: 24px; background: #fff; }

        /* ── Language toggle ── */
        .lang-toggle-wrap {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }
        .lang-toggle {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 3px;
          gap: 0;
          position: relative;
          cursor: pointer;
          direction: ltr; /* Force LTR so buttons stay in place */
        }
        .lang-toggle-option {
          position: relative; z-index: 2;
          padding: 5px 14px;
          font-size: 12.5px; font-weight: 700;
          border: none; background: none;
          border-radius: 999px;
          cursor: pointer;
          transition: color 250ms;
          font-family: inherit;
          color: #64748b;
        }
        .lang-toggle-option.active { color: #1e40af; }
        .lang-toggle-slider {
          position: absolute;
          top: 3px; bottom: 3px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 280ms cubic-bezier(.4,0,.2,1), width 280ms;
          z-index: 1;
          left: 3px;
        }
        .login-right {
          flex: 0 0 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 28px;
          background: #ffffff;
          min-height: 100vh;
        }
        @media (min-width: 1024px) { .login-right { flex: 0 0 460px; } }

        .login-card {
          width: 100%; max-width: 380px;
          animation: slideUp 420ms cubic-bezier(.22,.9,.36,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Mobile logo */
        .login-logo-mobile {
          display: flex; justify-content: center;
          margin-bottom: 28px;
        }
        .login-logo-mobile img {
          width: 110px; object-fit: contain;
        }
        @media (min-width: 1024px) { .login-logo-mobile { display: none; } }

        /* Heading */
        .login-heading { margin-bottom: 28px; }
        .login-heading h1 {
          font-size: 26px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.4px;
          margin: 0 0 6px;
        }
        .login-heading p { font-size: 13.5px; color: #64748b; margin: 0; }

        /* Field */
        .login-field { margin-bottom: 16px; }
        .login-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 6px;
        }
        .login-input-wrap { position: relative; }
        .login-input {
          width: 100%; padding: 13px 16px;
          border: 2px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; color: #0f172a;
          background: #f9fafb;
          transition: border-color 180ms, box-shadow 180ms, background 180ms;
          outline: none; font-family: inherit;
        }
        .login-input::placeholder { color: #9ca3af; }
        .login-input:focus {
          border-color: #2563eb; background: #fff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }
        .login-input.has-error { border-color: #ef4444; background: #fff; }
        .login-input.has-error:focus { box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }

        .login-pw-btn {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 4px;
          display: flex; align-items: center;
          transition: color 180ms; line-height: 0;
        }
        .login-pw-btn:hover { color: #2563eb; }

        .login-err {
          font-size: 12px; color: #ef4444;
          margin-top: 5px; display: flex; align-items: center; gap: 4px;
        }

        /* Forgot */
        .login-forgot {
          display: flex; justify-content: flex-end;
          margin-top: -8px; margin-bottom: 20px;
        }
        .login-forgot button {
          background: none; border: none; cursor: pointer;
          font-size: 12.5px; font-weight: 600;
          color: #2563eb; padding: 0; font-family: inherit;
          transition: color 180ms;
        }
        .login-forgot button:hover { color: #1d4ed8; text-decoration: underline; }

        /* Submit */
        .login-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff; font-size: 15px; font-weight: 700;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 4px 14px rgba(37,99,235,0.38);
          transition: transform 150ms, box-shadow 200ms, opacity 200ms;
          font-family: inherit; letter-spacing: 0.2px;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(37,99,235,0.48);
        }
        .login-submit:active:not(:disabled) { transform: scale(0.98); }
        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider + signup */
        .login-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .login-divider span { flex: 1; height: 1px; background: #e5e7eb; }
        .login-divider p { font-size: 12px; color: #9ca3af; margin: 0; white-space: nowrap; }

        .login-signup {
          text-align: center; font-size: 13.5px; color: #64748b;
        }
        .login-signup a {
          color: #2563eb; font-weight: 700;
          text-decoration: none; margin-left: 4px;
          transition: color 180ms;
        }
        .login-signup a:hover { color: #1d4ed8; text-decoration: underline; }
      `}</style>

      <div className="login-root">

        {/* ── LEFT: carousel background ── */}
        <div className="login-left">
          {slides.map((src, i) => (
            <div
              key={i}
              className={`login-slide${i === currentSlide ? " active" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <div className="login-slide-overlay" />

          {/* Branding overlay */}
          <div className="login-left-content">
            <img
              src={logo}
              alt="Alkarooz"
              className="login-left-logo"
            />
            <h2>Welcome Back to<br />Markaz Al-Karouz</h2>
            <p>Sign in to manage your orders, explore our catalogue, and connect with your family group.</p>
          </div>

          {/* Slide indicator dots */}
          <div className="login-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`login-dot${i === currentSlide ? " active" : ""}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="login-right" dir={isRTL ? "rtl" : "ltr"}>
          <div className="login-card">

            {/* Mobile: show logo since left panel is hidden */}
            <div className="login-logo-mobile">
              <img src={logo} alt="Alkarooz" style={{ width: '110px', objectFit: 'contain' }} />
            </div>

            {/* ── Language toggle ── */}
            <div className="lang-toggle-wrap">
              <div className="lang-toggle" role="group" aria-label="Language switcher">
                {/* Sliding white pill */}
                <div
                  className="lang-toggle-slider"
                  style={isRTL
                    ? { transform: 'translateX(43px)', width: 52 }
                    : { transform: 'translateX(0)', width: 43 }
                  }
                />
                <button
                  type="button"
                  className={`lang-toggle-option${!isRTL ? " active" : ""}`}
                  onClick={() => isRTL && toggleLang()}
                  aria-pressed={!isRTL}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`lang-toggle-option${isRTL ? " active" : ""}`}
                  onClick={() => !isRTL && toggleLang()}
                  aria-pressed={isRTL}
                >
                  عربي
                </button>
              </div>
            </div>

            <div className="login-heading">
              <h1>{isRTL ? "تسجيل الدخول" : "Sign in"}</h1>
              <p>{isRTL ? "أدخل رقم هاتفك وكلمة المرور للمتابعة." : "Enter your mobile number and password to continue."}</p>
            </div>

            <form onSubmit={handleSubmit} method="post">

              {/* Mobile */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-mobile">
                  {t("auth.mobile_placeholder") || "Mobile Number"}
                </label>
                <div className="login-input-wrap">
                  <input
                    id="login-mobile"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={data.mobile}
                    onChange={(e) => setData("mobile", e.target.value)}
                    className={`login-input${errors.mobile ? " has-error" : ""}`}
                    required
                  />
                </div>
                {errors.mobile && (
                  <div className="login-err">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.mobile}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label" htmlFor="login-password">
                  {t("auth.password_placeholder") || "Password"}
                </label>
                <div className="login-input-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`login-input${errors.password ? " has-error" : ""}`}
                    style={{ paddingRight: "46px" }}
                    required
                  />
                  <button type="button" className="login-pw-btn" onClick={togglePassword} aria-label="Toggle password visibility">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="login-err">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Forgot */}
              <div className="login-forgot">
                <button type="button" onClick={() => alert(t("auth.contact_support_reset"))}>
                  {t("auth.forgot_password")}
                </button>
              </div>

              {/* Submit */}
              <button id="login-submit-btn" type="submit" className="login-submit" disabled={processing}>
                {processing && <span className="login-spinner" />}
                {processing ? "Signing in…" : t("auth.login_btn") || "Sign In"}
              </button>

              {errors.general && (
                <Message type="error">{t("auth.failed") || errors.general}</Message>
              )}
            </form>

            <div className="login-divider">
              <span /><p>Don't have an account?</p><span />
            </div>
            <div className="login-signup">
              <Link href={route("sign_up")}>Create an account →</Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
