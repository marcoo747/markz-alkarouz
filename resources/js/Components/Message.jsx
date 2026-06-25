import React from "react";

const Message = ({ type, children }) => {
  const className = type === "success" ? "text-green-700" : type === "error" ? "text-red-700" : "";
  return (
    <div className={`${className} font-semibold text-center mt-2`} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
};

export default Message;
