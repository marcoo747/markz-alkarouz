import React, { useEffect } from "react";

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
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        backgroundColor: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
        borderRadius: "6px",
        padding: "12px 24px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        fontWeight: "500",
        minWidth: "200px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      {message}
    </div>
  );
};

export default TopAlert;
