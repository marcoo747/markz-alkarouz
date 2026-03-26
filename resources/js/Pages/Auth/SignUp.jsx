import React, { useState } from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import Message from "@/Components/Message";
import PasswordChecklist from "@/Components/PasswordChecklist";
import { useTranslation } from "react-i18next";

export default function Register({ osras }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    password_confirmation: "",
    user_photo: null,
    user_type: "user",
    osra_code: "", // instead of osra_id
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setData(id, files ? files[0] : value);
  };

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("user_type", data.user_type);
    if (data.osra_id) formData.append("osra_id", data.osra_id);
    if (data.user_photo) formData.append("user_photo", data.user_photo);

    post(route("sign_up.store"), formData, {
      headers: {
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
        "Content-Type": "multipart/form-data"
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
              <div className="flex justify-center mb-6 transform transition-transform hover:scale-105 duration-300">
                <img src="imgs/AlkaroozCom.png" className="h-20 w-auto object-contain" />
              </div>

              <form onSubmit={submit} className="signup-form space-y-4">
                {/* Full Name */}
                <div className="group">
                  <input
                    id="full_name"
                    value={data.full_name}
                    onChange={handleChange}
                    placeholder={t('auth.full_name_placeholder')}
                    className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.full_name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                  />
                  {errors.name && <Message type="error" className="mt-1 animate-pulse">{errors.name}</Message>}
                </div>

                {/* Email */}
                <div className="group">
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder={t('auth.email_placeholder')}
                    className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.email ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                    name="email"
                  />
                  {errors.email && <Message type="error" className="mt-1 animate-pulse">{errors.email}</Message>}
                </div>

                {/* Phone */}
                <div className="group">
                  <input
                    id="mobile"
                    value={data.mobile}
                    onChange={handleChange}
                    placeholder={t('auth.mobile_placeholder')}
                    className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.mobile ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                  />
                  {errors.phone && <Message type="error" className="mt-1 animate-pulse">{errors.phone}</Message>}
                </div>

                {/* Osra Code (manual input instead of select) */}
                <div className="group">
                  <input
                    id="osra_code"
                    value={data.osra_code}
                    onChange={handleChange}
                    placeholder={t('auth.osra_code_shorter')}
                    className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.osra_code ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                  />
                  {errors.osra_code && <Message type="error" className="mt-1 animate-pulse">{errors.osra_code}</Message>}
                </div>

                {/* Password */}
                <div className="password-wrapper relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={handleChange}
                    placeholder={t('auth.password_placeholder')}
                    className={`w-full px-5 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.password ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500 group-hover:border-blue-300"}`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200 p-1 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <Message type="error" className="mt-1 animate-pulse">{errors.password}</Message>}

                {data.password.length > 0 && (
                  <PasswordChecklist
                    password={data.password}
                    confirm={data.password_confirmation}
                  />
                )}

                {/* Confirm Password */}
                <div className="password-wrapper relative group">
                  <input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={handleChange}
                    placeholder={t('auth.confirm_password_placeholder')}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 group-hover:border-blue-300"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200 p-1 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>

                {/* Photo */}
                <div className="file-input-wrapper mt-4">
                  <label htmlFor="user_photo" className="block w-full px-5 py-3 text-center rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 transition-all duration-300 cursor-pointer text-sm font-semibold">
                    <div className="flex items-center justify-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       {data.user_photo ? data.user_photo.name : t('auth.upload_photo')}
                    </div>
                  </label>
                  <input
                    type="file"
                    id="user_photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
                {errors.user_photo && <Message type="error" className="animate-pulse">{errors.user_photo}</Message>}

                <button 
                  disabled={processing} 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 active:scale-95 text-lg mt-4"
                >
                  {t('auth.add_user_btn')}
                </button>
              </form>
              
              <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <p className="text-gray-600 mb-4">{t('auth.already_have_account')}</p>
                <Link 
                  href={route('login')} 
                  className="inline-block w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transform transition-all duration-300 active:scale-95 text-lg"
                >
                  {t('auth.login_link')}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
