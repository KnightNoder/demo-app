import React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
      {children}
    </th>
  );
};

export default TableHeader;
