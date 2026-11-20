import React, { useState } from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";
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
    osra_code: "",
  });


  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setData(id, files ? (files[0] || null) : value);
  };

  const submit = (e) => {
    e.preventDefault();

    post(route("register.store"), {
      forceFormData: true,
    });
  };

  return (
    <>
      <Head title={t('users.add_user') || t('home.page_title')} />
      <NavBar page_name="users" />
      <Container className="container--center py-8">
        <div className="auth-page max-w-[520px] w-full mx-auto">
          <div className="signup-container bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900 m-0">
                {t('users.add_user') || "Add User"}
              </h1>
              <Link
                href={route("users.index")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 no-underline"
              >
                ← {t('errors.go_back_btn') || "Back"}
              </Link>
            </div>

            <form onSubmit={submit} className="signup-form space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.full_name_placeholder')}
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  value={data.full_name}
                  onChange={handleChange}
                  placeholder={t('auth.full_name_placeholder')}
                  className={errors.full_name ? "input-error" : ""}
                />
                {errors.full_name && <Message type="error">{errors.full_name}</Message>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.email_placeholder')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder={t('auth.email_placeholder')}
                  className={errors.email ? "input-error" : ""}
                  name="email"
                />
                {errors.email && <Message type="error">{errors.email}</Message>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.mobile_placeholder')}
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  value={data.mobile}
                  onChange={handleChange}
                  placeholder={t('auth.mobile_placeholder')}
                  className={errors.mobile ? "input-error" : ""}
                />
                {errors.mobile && <Message type="error">{errors.mobile}</Message>}
              </div>

              {/* User Type */}
              <div>
                <label htmlFor="user_type" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('users.role') || "Role"}
                </label>
                <select
                  id="user_type"
                  value={data.user_type}
                  onChange={handleChange}
                  className={errors.user_type ? "input-error" : ""}
                  name="user_type"
                >
                  <option value="user">{t('auth.role_user')}</option>
                  <option value="admin">{t('auth.role_admin')}</option>
                  <option value="manager">{t('auth.role_manager')}</option>
                </select>
                {errors.user_type && (
                  <Message type="error">{errors.user_type}</Message>
                )}
              </div>

              {/* Osra Code (manual input instead of select) */}
              <div>
                <label htmlFor="osra_code" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.osra_code_placeholder')}
                </label>
                <input
                  id="osra_code"
                  name="osra_code"
                  value={data.osra_code}
                  onChange={handleChange}
                  placeholder={t('auth.osra_code_placeholder')}
                  className={errors.osra_code ? "input-error" : ""}
                />
                {errors.osra_code && <Message type="error">{errors.osra_code}</Message>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.password_placeholder')}
                </label>
                <div className="password-wrapper relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={handleChange}
                    placeholder={t('auth.password_placeholder')}
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    className="toggle-password bg-transparent border-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <Message type="error">{errors.password}</Message>}
              </div>

              {data.password.length > 0 && (
                <PasswordChecklist
                  password={data.password}
                  confirm={data.password_confirmation}
                />
              )}

              {/* Confirm Password */}
              <div>
                <label htmlFor="password_confirmation" className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('auth.confirm_password_placeholder')}
                </label>
                <div className="password-wrapper relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={handleChange}
                    placeholder={t('auth.confirm_password_placeholder')}
                  />
                  <button
                    type="button"
                    aria-label="Toggle confirm password visibility"
                    className="toggle-password bg-transparent border-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password_confirmation && <Message type="error">{errors.password_confirmation}</Message>}
              </div>

              {/* Photo */}
              <div className="file-input-wrapper">
                <label htmlFor="user_photo" className="file-input-text">
                  {data.user_photo ? data.user_photo.name : t('auth.upload_photo')}
                </label>
                <input
                  type="file"
                  id="user_photo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              {errors.user_photo && <Message type="error">{errors.user_photo}</Message>}

              <button disabled={processing} type="submit" className="btn btn-success">
                {t('auth.add_user_btn')}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
