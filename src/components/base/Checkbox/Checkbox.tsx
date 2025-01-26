import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  variant?: "default" | "primary" | "secondary";
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  variant = "default",
  className,
  ...props
}) => {
  let variantClass = "";

  switch (variant) {
    case "primary":
      variantClass = "bg-blue-500 border-blue-700 focus:ring-blue-300";
      break;
    case "secondary":
      variantClass = "bg-gray-500 border-gray-700 focus:ring-gray-300";
      break;
    case "default":
    default:
      variantClass = "bg-white border-gray-300 focus:ring-gray-200";
      break;
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      {...props}
      className={`cursor-pointer ${variantClass} ${className}`}
    />
  );
};

export default Checkbox;
