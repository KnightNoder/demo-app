import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TableHeader from "../../atoms/TableHeader/TableHeader";

interface TableProps<T> {
  headers: string[];
  data: T[];
  loading: boolean;
  renderRow: (item: T, index: number) => React.ReactNode;
}

const Table = <T,>({ headers, data, loading, renderRow }: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto rounded-md">
      <table className="w-full text-xs">
        <thead className="top-0 bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? [...Array(5)].map((_, index) => (
              <tr key={index}>
                {headers.map((_, colIndex) => (
                  <td key={colIndex}>
                    <Skeleton width={100} />
                  </td>
                ))}
              </tr>
            ))
            : data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
