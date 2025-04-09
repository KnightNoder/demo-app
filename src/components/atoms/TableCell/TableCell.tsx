import React from "react";
import { capitalize } from "../../../utils/utils";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isAnyModalOpen?: boolean;
  capitalize?: boolean; // Add a prop to control capitalization
}

// Helper function to capitalize string

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  isAnyModalOpen,
}) => {
  // Handle capitalization based on children type
  const processedChildren = React.Children.map(children, (child) => {
    // If children is a simple string, we can capitalize it
    if (typeof child === "string") {
      return capitalize(child);
    }

    // If it's not a string or capitalization is not requested, return as is
    return child;
  });

  return (
    <td
      className={`py-2 px-2 my-10 ${isAnyModalOpen ? "max-w-[400px]" : "max-w-[100px] truncate"} text-[12px] align-middle text-left ${className} first-letter:uppercase`}
    >
      {processedChildren}
    </td>
  );
};

export default TableCell;