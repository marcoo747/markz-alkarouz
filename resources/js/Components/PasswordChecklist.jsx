import React from "react";

const CheckItem = ({ ok, text }) => (
  <div className={`pw-crit ${ok ? "pw-ok" : "pw-fail"}`} aria-hidden>
    <span className="pw-dot">{ok ? "✔" : "○"}</span>
    <span className="pw-text">{text}</span>
  </div>
);

const PasswordChecklist = ({ password = "", confirm = "" }) => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const minLen = password.length >= 8;
  const match = password && password === confirm;

  return (
    <div className="pw-checklist" aria-live="polite">
      <CheckItem ok={minLen} text="At least 8 characters" />
      <CheckItem ok={hasLower} text="Lowercase letter" />
      <CheckItem ok={hasUpper} text="Uppercase letter" />
      <CheckItem ok={hasDigit} text="A number" />
      <CheckItem ok={match} text="Passwords match" />
    </div>
  );
};

export default PasswordChecklist;
