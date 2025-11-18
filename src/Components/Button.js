import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const cls = `btn btn-${variant} ${className}`.trim();
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};

export default Button;
