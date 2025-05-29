import React from "react";

interface ColumnConfig<T> {
  key: keyof T;
  label?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
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
    <tr className="transition-colors hover:bg-muted/50 my-2">
      {columnConfig?.map(({ key, render, className = "" }, index) => {
        const value = data[key];

        // Match the styling from AllergyRow
        const cellClass =
          "pl-1 pr-2 py-3 align-middle text-xs font-light text-[#020817] " +
          className;

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