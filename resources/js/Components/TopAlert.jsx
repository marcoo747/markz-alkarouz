import React, { useEffect } from "react";
import styles from "../../css/TopAlert.module.css";

const TopAlert = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      onClick={onClose}
      className={styles.topAlert}
    >
      {message}
    </div>
  );
};

export default TopAlert;
