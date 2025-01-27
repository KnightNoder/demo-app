import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outlined" | "filled";
  className?: string;
}

const Input: React.FC<InputProps> = ({
  variant = "default",
  className,
  ...props
}) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "default":
        return "border border-gray-300 rounded px-2 py-1";
      case "outlined":
        return "border-2 border-blue-500 rounded px-2 py-1";
      case "filled":
        return "bg-gray-100 border border-gray-300 rounded px-2 py-1";
      default:
        return "border border-gray-300 rounded px-2 py-1";
    }
  };

  return (
    <input
      {...props}
      className={`${getVariantClasses(variant)} ${className}`}
    />
  );
};

export default Input;
