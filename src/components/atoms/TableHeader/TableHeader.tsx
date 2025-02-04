import React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => {
  return (
    <th
      className={`h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap ${className}`}
      style={{
        fontFamily: "Inter, sans-serif",
        fontFeatureSettings: '"rlig", "calt"',
        fontVariationSettings: "normal",
      }}
    >
      {children}
    </th>
  );
};

export default TableHeader;
