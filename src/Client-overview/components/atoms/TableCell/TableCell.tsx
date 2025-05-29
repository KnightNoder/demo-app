import React from "react";
import { capitalize } from "../../../../utils/utils";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isAnyModalOpen?: boolean;
  capitalize?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  // Updated to match example styling
  const cellClass = `pl-1 pr-2 py-1 align-middle text-xs font-light ${className}`;

  // Handle capitalization based on children type
  const processedChildren = React.Children?.map(children, (child) => {
    // If children is a simple string, we can capitalize it
    if (typeof child === "string") {
      return capitalize(child);
    }
    // If it's not a string or capitalization is not requested, return as is
    return child;
  });

  return <td className={cellClass}>{processedChildren}</td>;
};

export default TableCell;