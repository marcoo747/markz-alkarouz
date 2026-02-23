import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import styles from "../../css/LoginMessage.module.css";

const LoginMessage = ({ message, type = "error", onClose }) => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [visible, setVisible] = useState(!user && !!message);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
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
    <div className={`${styles.overlay} ${visible ? styles.visible : styles.hidden}`}>
      <div
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className={`${styles.messageBox} ${typeClass}`}
      >
        {message}
      </div>
    </div>
  );
};

export default LoginMessage;
