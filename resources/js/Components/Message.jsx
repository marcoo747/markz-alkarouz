import React from "react";

const Message = ({ type = "info", children }) => {
  const className =
    type === "success" ? "success-text" : type === "error" ? "error-text" : "";
  return (
    <div className={className} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
};

export default Message;
