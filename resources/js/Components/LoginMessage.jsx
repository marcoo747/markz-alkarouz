import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

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

  const colors = {
    success: { bg: "#e6fffa", border: "#38b2ac", text: "#234e52" },
    error: { bg: "#ffe6e6", border: "#e53e3e", text: "#742a2a" },
    warning: { bg: "#fffbea", border: "#ecc94b", text: "#744210" },
    info: { bg: "#ebf8ff", border: "#4299e1", text: "#2a4365" },
  };

  const theme = colors[type] || colors.error;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)", // dim background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "opacity 0.4s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        style={{
          backgroundColor: theme.bg,
          color: theme.text,
          border: `2px solid ${theme.border}`,
          borderRadius: "12px",
          padding: "32px 48px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          fontWeight: "600",
          fontSize: "1.2rem",
          textAlign: "center",
          maxWidth: "500px",
          width: "80%",
          animation: "scaleIn 0.3s ease",
          cursor: "pointer", // ✅ whole box is clickable
        }}
      >
        {message}
      </div>

      {/* Add keyframe animation */}
      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default LoginMessage;
