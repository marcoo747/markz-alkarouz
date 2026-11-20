import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import styles from "../../css/LoginMessage.module.css";

const STORAGE_DISMISSED_KEY = "markaz_login_msg_dismissed";

const isAlreadyDismissed = () => {
  try {
    return sessionStorage.getItem(STORAGE_DISMISSED_KEY) === "1";
  } catch (_) {
    return false;
  }
};

const markDismissed = () => {
  try {
    sessionStorage.setItem(STORAGE_DISMISSED_KEY, "1");
  } catch (_) {}
};

const LoginMessage = ({ message, type = "error", onClose }) => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [visible, setVisible] = useState(() => !user && !!message && !isAlreadyDismissed());

  const handleDismiss = () => {
    markDismissed();
    setVisible(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        markDismissed();
        setVisible(false);
        if (onClose) onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const typeClass = {
    success: styles.success,
    error: styles.error,
    warning: styles.warning,
    info: styles.info,
  }[type] || styles.error;

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.visible : styles.hidden}`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className={`${styles.messageBox} ${typeClass} relative`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          aria-label="Close alert"
          className="absolute top-3 end-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 text-current text-lg font-bold border-0 cursor-pointer leading-none"
        >
          ×
        </button>
        {message}
      </div>
    </div>
  );
};

export default LoginMessage;
