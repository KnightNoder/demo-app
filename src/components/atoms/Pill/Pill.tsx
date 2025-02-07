import React from "react";

interface PillProps {
  text: string | null;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ text, className = "" }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-[12px] transition-colors duration-200 hover:bg-gray-200 ${className}`}
      style={{
        fontFamily: "Inter, sans-serif",
        fontFeatureSettings: '"rlig", "calt"',
        fontVariationSettings: "normal",
      }}
    >
      {text}
    </div>
  );
};

export default Pill;
