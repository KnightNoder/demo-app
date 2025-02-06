import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  return (
    <td className={`py-2 px-2 my-10 text-xs align-middle ${className}`}>
      {children}
    </td>
  );
};

export default TableCell;
