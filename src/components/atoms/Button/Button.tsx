import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "default";
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  className,
  ...props
}) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-gray-400 text-white hover:bg-gray-600";
    }
  };

  return (
    <button
      {...props}
      className={`cursor-pointer px-4 py-2 rounded ${getVariantClasses(
        variant
      )} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
