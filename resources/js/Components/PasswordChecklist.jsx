import React from "react";
import { useTranslation } from "react-i18next";

const CheckItem = ({ ok, text }) => (
  <div className={`pw-crit ${ok ? "pw-ok" : "pw-fail"}`}>
    <span className="pw-dot" aria-hidden="true">{ok ? "✔" : "○"}</span>
    <span className="pw-text">{text}</span>
  </div>
);

const PasswordChecklist = ({ password = "", confirm = "" }) => {
  const { t } = useTranslation();
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const minLen = password.length >= 8;
  const match = password && password === confirm;

  return (
    <div className="pw-checklist" aria-live="polite">
      <CheckItem ok={minLen} text={t("auth.pw_min_len") || "At least 8 characters"} />
      <CheckItem ok={hasLower} text={t("auth.pw_lower") || "Lowercase letter"} />
      <CheckItem ok={hasUpper} text={t("auth.pw_upper") || "Uppercase letter"} />
      <CheckItem ok={hasDigit} text={t("auth.pw_digit") || "A number"} />
      <CheckItem ok={match} text={t("auth.pw_match") || "Passwords match"} />
    </div>
  );
};

export default PasswordChecklist;
