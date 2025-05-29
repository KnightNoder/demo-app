import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outlined" | "filled" | "" | undefined;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  variant = "default", // Default variant if none is passed
  className,
  ...props
}) => {
  // Define valid variants (don't include empty string here, it should fallback to default)
  const validVariants: InputProps["variant"][] = [
    "default",
    "outlined",
    "filled",
  ];

  // Validate variant and set to default if invalid
  const getVariantClasses = (variant: string) => {
    // We use a ternary here to check for invalid values more explicitly
    if (!validVariants.includes(variant as InputProps["variant"])) {
      variant = "default"; // fallback to default if invalid
    }

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
      className={`${getVariantClasses(variant)} ${className || ""}`}
    />
  );
};

export default Input;
