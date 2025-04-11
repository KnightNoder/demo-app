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
    <div className="w-full mt-4 overflow-x-auto rounded-md">
      <table className="w-full text-xs">
        <thead className="top-0 bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <tr key={index} className="my-2">
                {headers.map((_, colIndex) => (
                  <td key={colIndex} className="pl-1 pr-2 py-3 align-middle">
                    <Skeleton width={100} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;