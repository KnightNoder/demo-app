import React from "react";

interface PillProps {
  text: string;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ text, className = "" }) => {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-[10px] ${className}`}>
      {text}
    </div>
  );
};

export default Pill;
