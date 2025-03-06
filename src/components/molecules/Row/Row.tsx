import React from "react";
import TableCell from "../../atoms/TableCell/TableCell";

interface ColumnConfig<T> {
  key: keyof T;
  label?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface GenericTableRowProps<T> {
  data: T;
  columnConfig: ColumnConfig<T>[];
}

const GenericTableRow = <T,>({
  data,
  columnConfig,
}: GenericTableRowProps<T>) => {
  return (
    <tr className="!py-10 !mt-10 transition-colors hover:bg-muted/50">
      {columnConfig.map(({ key, render }, index) => {
        const value = data[key];

        return (
          <TableCell key={index}>
            {render ? render(value, data) : String(value) || "N/A"}
          </TableCell>
        );
      })}
    </tr>
  );
};

export default GenericTableRow;
