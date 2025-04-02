import React from "react";

interface PillProps {
  text: string | null;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ text, className = "" }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[10px] ${className}`}
    >
      {text}
    </div>
  );
};

export default Pill;
