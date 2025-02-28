import React from "react";
import TableCell from "../../atoms/TableCell/TableCell";

interface ColumnConfig<T> {
  key: keyof T;
  label?: string; // Optional for column header labels if needed
  render?: (value: T[keyof T], row: T) => React.ReactNode; // Avoids `any`
}

interface GenericTableRowProps<T> {
  data: T;
  columnConfig: ColumnConfig<T>[];
}

const GenericTableRow = <T,>({ data, columnConfig }: GenericTableRowProps<T>) => {
  return (
    <tr className="!py-10 !mt-10 transition-colors hover:bg-muted/50">
      {columnConfig.map(({ key, render }, index) => {
        const value = data[key]; // Extract value safely

        return (
          <TableCell key={index} className="text-left">
            {render ? render(value, data) : (String(value) || "N/A")} {/* Ensure valid ReactNode */}
          </TableCell>
        );
      })}
    </tr>
  );
};

export default GenericTableRow;
