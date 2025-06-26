import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "link" | "blue";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  title,
  className = "",
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-[#00b0f0] text-[#f8fafc] font-normal shadow hover:bg-[#00b0f0]/90 active:bg-[#00b0f0]/80",
    secondary:
      "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100",
    ghost:
      "text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:bg-gray-100",
    link: "text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium underline decoration-2 underline-offset-2 px-1 py-0.5",
    blue: "bg-blue-600 text-white shadow hover:bg-blue-700",
  };

  const sizes = {
    sm: "h-8 px-3 py-1",
    md: "h-9 px-4 py-2",
    lg: "h-10 px-6 py-2",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      tabIndex={0}
    >
      {children}
    </button>
  );
};