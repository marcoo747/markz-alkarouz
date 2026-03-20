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
    osra_code: "",
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
    if (data.osra_code) formData.append("osra_code", data.osra_code);
    if (data.user_photo) formData.append("user_photo", data.user_photo);

    post(route("register.store"), formData);
  };

  return (
    <>
      <Head title={t('home.page_title')} />
      <Container className="container--center">
        <div className="auth-page">
          <div className="signup-container">
            <img src="imgs/AlkaroozCom.png" className="logo" />

            <form onSubmit={submit} className="signup-form">
              {/* Full Name */}
              <input
                id="full_name"
                value={data.full_name}
                onChange={handleChange}
                placeholder={t('auth.full_name_placeholder')}
                className={errors.full_name && "input-error"}
              />
              {errors.name && <Message type="error">{errors.name}</Message>}

              {/* Email */}
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={handleChange}
                placeholder={t('auth.email_placeholder')}
                className={errors.email && "input-error"}
                name="email"
              />
              {errors.email && <Message type="error">{errors.email}</Message>}

              {/* Phone */}
              <input
                id="mobile"
                value={data.mobile}
                onChange={handleChange}
                placeholder={t('auth.mobile_placeholder')}
                className={errors.mobile && "input-error"}
              />

              {/* User Type */}
              <select
                id="user_type"
                value={data.user_type}
                onChange={handleChange}
                className={errors.user_type && "input-error"}
                name="user_type"
              >
                <option value="user">{t('auth.role_user')}</option>
                <option value="admin">{t('auth.role_admin')}</option>
                <option value="manager">{t('auth.role_manager')}</option>
              </select>

              {errors.user_type && (
                <Message type="error">{errors.user_type}</Message>
              )}

              {errors.phone && <Message type="error">{errors.phone}</Message>}

              {/* Osra Code (manual input instead of select) */}
              <input
                id="osra_code"
                value={data.osra_code}
                onChange={handleChange}
                placeholder={t('auth.osra_code_placeholder')}
                className={errors.osra_code ? "input-error" : ""}
              />
              {errors.osra_code && <Message type="error">{errors.osra_code}</Message>}

              {/* Password */}
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={handleChange}
                  placeholder={t('auth.password_placeholder')}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              {errors.password && <Message type="error">{errors.password}</Message>}

              {data.password.length > 0 && (
                <PasswordChecklist
                  password={data.password}
                  confirm={data.password_confirmation}
                />
              )}

              {/* Confirm Password */}
              <div className="password-wrapper">
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={data.password_confirmation}
                  onChange={handleChange}
                  placeholder={t('auth.confirm_password_placeholder')}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
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
