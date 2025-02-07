import React from "react";
import Icon from "../../../assets/Icons/Icons"; // Adjust import path accordingly

interface ButtonProps {
  variant: "primary" | "secondary" | "default";
  icon?: "add" | "view";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  dataCy?: string;
  disabled?: boolean;
  className?: string; // Added this to allow for additional custom styles
}

const Button: React.FC<ButtonProps> = ({ variant, icon, children, onClick, disabled, className = "" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 text-[#0093D3] underline-offset-4 hover:underline hover:brightness-110 h-7 rounded-md px-3 text-xs gap-1 shrink-0";
      case "secondary":
        return "inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 text-[#0093D3] underline-offset-4 hover:underline hover:brightness-110 h-7 rounded-md px-3 text-xs shrink-0";
      default:
        return "bg-transparent text-[#0093D3]";
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 text-xs rounded-md px-3 h-7 ${getVariantClasses()} ${className}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {icon && <Icon variant={icon} />}
      {children}
    </button>
  );
};

export default Button;
