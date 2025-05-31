import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "red"
    | "blue"
    | "green"
    | "yellow"
    | "gray"
    | "orange"
    | "high"
    | "medium"
    | "low"
    | "pending"
    | "in-progress"
    | "completed";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gray",
  size = "md",
  className = "",
}) => {
  const variants = {
    // Original color variants
    red: "text-red-600",
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    gray: "text-gray-600",
    orange: "text-orange-600 font-normal",

    // Healthcare task variants with enhanced styling
    high: "inline-flex items-center rounded-full px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all duration-200",
    medium:
      "inline-flex items-center rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all duration-200",
    low: "inline-flex items-center rounded-full px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all duration-200",
    pending:
      "inline-flex items-center rounded-full px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all duration-200",
    "in-progress":
      "inline-flex items-center rounded-full px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all duration-200",
    completed:
      "inline-flex items-center rounded-full px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all duration-200",
  };

  const sizes = {
    sm: "text-xs h-6 font-medium",
    md: "text-3xl font-bold",
    lg: "text-4xl font-bold",
  };

  // Check if it's a healthcare task variant
  const isTaskVariant = [
    "high",
    "medium",
    "low",
    "pending",
    "in-progress",
    "completed",
  ].includes(variant);

  if (isTaskVariant) {
    // For healthcare task variants, override size styling
    const taskSizes = {
      sm: "text-xs h-6 font-medium",
      md: "text-sm h-6 font-medium",
      lg: "text-base h-8 font-medium",
    };

    return (
      <div className={`${variants[variant]} ${taskSizes[size]} ${className}`}>
        {children}
      </div>
    );
  }

  // Original badge behavior for color variants
  return (
    <span className={`${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
