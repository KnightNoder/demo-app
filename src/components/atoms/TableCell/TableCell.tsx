import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  return (
    <td className={`py-1 pl-1 pr-2 text-xs align-middle ${className}`}>
      {children}
    </td>
  );
};

export default TableCell;
