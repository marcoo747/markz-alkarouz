import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import Message from "@/Components/Message";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
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
      alert(t('auth.mobile_11_digits'));
      return;
    }
    if (!data.password) {
      alert(t('auth.password_required'));
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
      <Head title={t('home.page_title')} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        <Container className="container--center">
          <div className="auth-page max-w-[520px] w-full mx-auto">
            <div className="bg-white py-10 px-8 shadow-2xl rounded-3xl border border-gray-100 transform transition-all duration-500 hover:shadow-blue-100/50">
              <div className="flex justify-center mb-8 transform transition-transform hover:scale-105 duration-300">
                <img src="imgs/AlkaroozCom.png" alt="Alkarooz" className="h-20 w-auto object-contain" />
              </div>

              <form className="login-form space-y-5" onSubmit={handleSubmit} method="post">
                {/* Mobile input */}
                <div className="group">
                  <input
                    type="tel"
                    placeholder={t('auth.mobile_placeholder')}
                    value={data.mobile}
                    onChange={(e) => setData("mobile", e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.mobile ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                    required
                  />
                  {errors.mobile && <div className="text-red-500 text-sm mt-1 ml-2 animate-pulse">{errors.mobile}</div>}
                </div>

                {/* Password input */}
                <div className="password-wrapper relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.password_placeholder')}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.password ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200 p-2 focus:outline-none"
                    onClick={togglePassword}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {errors.password && <div className="text-red-500 text-sm mt-1 ml-2 animate-pulse">{errors.password}</div>}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() =>
                      alert(t('auth.contact_support_reset'))
                    }
                  >
                    {t('auth.forgot_password')}
                  </button>
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 active:scale-95 text-lg mt-2" 
                  disabled={processing}
                >
                  {t('auth.login_btn')}
                </button>
              </form>

            <p className="mt-3 mb-0">Do not have an account?</p>
            <Link href={route("sign_up")} className="btn btn-primary mt-0">
              Sign Up
            </Link>

              {/* Optional server messages */}
              {errors.general && <Message type="error" className="mt-4 animate-bounce">{errors.general}</Message>}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
