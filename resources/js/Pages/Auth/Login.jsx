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
  const [showForgotModal, setShowForgotModal] = useState(false);

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

      <div className="min-h-screen flex font-sans">

        {/* ── LEFT: carousel background ── */}
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          {slides.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a143c]/70 via-[#0a143c]/45 to-[#0a143c]/65" />

          {/* Branding overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-12 text-center text-white">
            <img
              src={logo}
              alt="Alkarooz"
              className="w-[130px] mb-7 object-contain drop-shadow-xl"
            />
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-3.5 drop-shadow-md">
              Welcome Back to<br />Markaz Al-Karouz
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed max-w-[360px] drop-shadow">
              Sign in to manage your orders, explore our catalogue, and connect with your family group.
            </p>
          </div>

          {/* Slide indicator dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-400 ease-in-out cursor-pointer border-none ${i === currentSlide ? "w-6 bg-white" : "w-2 bg-white/40"}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="flex-none w-full lg:w-[460px] flex flex-col items-center justify-center p-12 px-7 bg-white min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
          <div className="w-full max-w-[380px] animate-[slideUp_420ms_ease-out_both]">

            {/* Mobile: show logo since left panel is hidden */}
            <div className="flex lg:hidden justify-center mb-7">
              <img src={logo} alt="Alkarooz" className="w-[110px] object-contain" />
            </div>

            {/* ── Language toggle ── */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-[3px] relative cursor-pointer ltr" style={{ direction: 'ltr' }} role="group" aria-label="Language switcher">
                {/* Sliding white pill */}
                <div
                  className={`absolute top-[3px] bottom-[3px] rounded-full bg-white shadow-sm transition-all duration-300 z-0 left-[3px] ${isRTL ? "translate-x-[43px] w-[52px]" : "translate-x-0 w-[43px]"}`}
                />
                <button
                  type="button"
                  className={`relative z-10 px-3.5 py-1.5 text-[12.5px] font-bold border-none bg-transparent rounded-full cursor-pointer transition-colors duration-250 ${!isRTL ? "text-blue-800" : "text-slate-500"}`}
                  onClick={() => isRTL && toggleLang()}
                  aria-pressed={!isRTL}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`relative z-10 px-3.5 py-1.5 text-[12.5px] font-bold border-none bg-transparent rounded-full cursor-pointer transition-colors duration-250 ${isRTL ? "text-blue-800" : "text-slate-500"}`}
                  onClick={() => !isRTL && toggleLang()}
                  aria-pressed={isRTL}
                >
                  عربي
                </button>
              </div>
            </div>

            <div className="mb-7">
              <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight mb-1.5">{isRTL ? "تسجيل الدخول" : "Sign in"}</h1>
              <p className="text-[13.5px] text-slate-500 m-0">{isRTL ? "أدخل رقم هاتفك وكلمة المرور للمتابعة." : "Enter your mobile number and password to continue."}</p>
            </div>

            <form onSubmit={handleSubmit} method="post">

              {/* Mobile */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5" htmlFor="login-mobile">
                  {t("auth.mobile_placeholder") || "Mobile Number"}
                </label>
                <div className="relative">
                  <input
                    id="login-mobile"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={data.mobile}
                    onChange={(e) => setData("mobile", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm text-slate-900 transition-all duration-180 outline-none placeholder:text-gray-400 ${errors.mobile ? "border-red-500 bg-white focus:ring-4 focus:ring-red-500/10" : "border-gray-200 bg-gray-50 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"}`}
                    required
                  />
                </div>
                {errors.mobile && (
                  <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.mobile}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5" htmlFor="login-password">
                  {t("auth.password_placeholder") || "Password"}
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`w-full pl-4 pr-[46px] py-3 border-2 rounded-xl text-sm text-slate-900 transition-all duration-180 outline-none placeholder:text-gray-400 ${errors.password ? "border-red-500 bg-white focus:ring-4 focus:ring-red-500/10" : "border-gray-200 bg-gray-50 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"}`}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 p-1 flex items-center transition-colors duration-180 hover:text-blue-600 leading-none" onClick={togglePassword} aria-label="Toggle password visibility">
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
                  <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end -mt-2 mb-5">
                <button type="button" className="bg-transparent border-none cursor-pointer text-[12.5px] font-semibold text-blue-600 p-0 transition-colors duration-180 hover:text-blue-700 hover:underline" onClick={() => setShowForgotModal(true)}>
                  {t("auth.forgot_password")}
                </button>
              </div>

              {/* Submit */}
              <button id="login-submit-btn" type="submit" className="w-full p-3.5 bg-gradient-to-br from-blue-700 to-blue-500 text-white text-[15px] font-bold border-none rounded-xl cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.38)] transition-all duration-200 tracking-wide hover:-translate-y-[1px] hover:shadow-[0_7px_20px_rgba(37,99,235,0.48)] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed" disabled={processing}>
                {processing && <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin align-middle mr-2" />}
                {processing ? "Signing in…" : t("auth.login_btn") || "Sign In"}
              </button>

              {errors.general && (
                <Message type="error">{t("auth.failed") || errors.general}</Message>
              )}
            </form>

            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px bg-gray-200" /><p className="text-xs text-gray-400 m-0 whitespace-nowrap">Don't have an account?</p><span className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="text-center text-[13.5px] text-slate-500">
              <Link className="text-blue-600 font-bold no-underline ml-1 transition-colors duration-180 hover:text-blue-700 hover:underline" href={route("sign_up")}>Create an account →</Link>
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-[slideUp_300ms_ease-out_both]" dir={isRTL ? "rtl" : "ltr"}>
            <button
              onClick={() => setShowForgotModal(false)}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mt-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t("auth.forgot_password") || "Forgot Password"}</h3>
              <p className="text-sm text-gray-500 mb-6">{t("auth.contact_support_reset")}</p>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                {t("close") || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
