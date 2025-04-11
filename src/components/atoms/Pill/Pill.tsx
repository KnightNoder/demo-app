import React from "react";

interface PillProps {
  text: string;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ text, className = "" }) => {
  // Base styling from the example
  let pillClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 font-light transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[10px]";

  // Status-specific styling
  if (text === "normal") {
    pillClasses += " bg-gray-50 text-gray-600 hover:bg-gray-100";
  } else if (text === "abnormal") {
    pillClasses += " bg-gray-100 text-gray-700 hover:bg-gray-200";
  } else if (text === "critical") {
    pillClasses += " bg-red-50 text-red-700 hover:bg-red-100";
  }

  return <div className={`${pillClasses} ${className}`}>{text}</div>;
};

export default Pill;