import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "default";
  active?: Boolean,
  count?: number
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  active = false,
  count,
  children,
  className,
  ...props
}) => {
  const getVariantClasses = (variant: string, active: boolean) => {
    if (active) {
      return "bg-white text-zinc-900 shadow-sm";
    }
    switch (variant) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "text-zinc-500 hover:text-zinc-900";
    }
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium transition-all rounded-sm w-full ${getVariantClasses(
        variant,
        active = false
      )} ${className}`}
    >
      {children}
      {count !== undefined && <span className="ml-2 text-gray-600">({count})</span>}
    </button>
  );
};

export default Button;
