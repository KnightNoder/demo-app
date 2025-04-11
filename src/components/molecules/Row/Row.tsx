import React from "react";

interface ColumnConfig<T> {
  key: keyof T;
  label?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string; // Added to allow custom styling per column
}

interface GenericTableRowProps<T> {
  data: T;
  columnConfig: ColumnConfig<T>[];
  isAnyModalOpen?: boolean;
}

const GenericTableRow = <T,>({
  data,
  columnConfig,
}: GenericTableRowProps<T>) => {
  return (
    <tr className="transition-colors hover:bg-muted/50">
      {columnConfig.map(({ key, render, className = "" }, index) => {
        const value = data[key];

        // Default cell styling based on example
        const defaultCellClass = "pl-1 pr-2 py-1 align-middle text-xs";
        // Add text-[#5B6B7A] for certain columns like Range, Ordered, Reported
        const mutedColumns = ["range", "ordered", "reported"];
        const isMuted = mutedColumns.includes(String(key));
        // Add font-medium for test name column
        const isBold = key === "test";

        const cellClass = `${defaultCellClass} ${isMuted ? "text-[#5B6B7A]" : ""} ${isBold ? "font-light" : ""} ${className}`;

        return (
          <td key={index} className={cellClass}>
            {render ? render(value, data) : String(value) || "N/A"}
          </td>
        );
      })}
    </tr>
  );
};

export default GenericTableRow;
