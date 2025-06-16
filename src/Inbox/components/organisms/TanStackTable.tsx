import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { TaskPriority } from "../molecules/TaskPriority";
import { TaskStatus } from "../molecules/TaskStatus";
import { TaskActions } from "../molecules/TaskAction";
import { TimeDisplay } from "../molecules/TimeDisplay";
import { PersonDisplay } from "../molecules/PersonDisplay";

// Extended task interface with index signature for dynamic properties
export interface ExtendedTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  person: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "in-progress";
  type: string;
  [key: string]: any;
}

export interface ApiColumn {
  key: string;
  label: string;
}

// Server-side pagination response interface
export interface ServerResponse {
  data: ExtendedTask[];
  totalCount: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Props for the server-side fetch function
export interface FetchDataProps {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
}

export interface TanStackTableProps {
  columns?: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  fetchData: (props: FetchDataProps) => Promise<ServerResponse>;
  initialData?: ExtendedTask[];
  initialTotalCount?: number;
  externalGlobalFilter?: string; // Add external search prop
}

const columnHelper = createColumnHelper<ExtendedTask>();

// Generic cell component for dynamic columns
const GenericCell: React.FC<{ value: any; columnKey: string }> = ({
  value,
  columnKey,
}) => {
  const baseClasses = "text-sm text-gray-900 px-3 py-2";

  // Handle special formatting for common field types
  if (columnKey.toLowerCase().includes("phone")) {
    return (
      <div className={baseClasses} title={value}>
        {value || <span className="text-gray-400 italic">-</span>}
      </div>
    );
  }

  if (columnKey.toLowerCase().includes("date") || columnKey === "DOB") {
    return (
      <div className={baseClasses} title={value}>
        {value ? (
          new Date(value).toLocaleDateString()
        ) : (
          <span className="text-gray-400 italic">-</span>
        )}
      </div>
    );
  }

  if (columnKey === "pid") {
    return (
      <div className={`${baseClasses} font-mono`} title={value}>
        {value || <span className="text-gray-400 italic">-</span>}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} truncate`} title={value}>
      {value || <span className="text-gray-400 italic">-</span>}
    </div>
  );
};

export const TanStackTable: React.FC<TanStackTableProps> = ({
  columns = [],
  onReply,
  onComplete,
  fetchData,
  initialData = [],
  initialTotalCount = 0,
  externalGlobalFilter = "", // Add external search prop
}) => {
  // Table state
  const [data, setData] = useState<ExtendedTask[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Update internal global filter when external filter changes
  useEffect(() => {
    setGlobalFilter(externalGlobalFilter);
  }, [externalGlobalFilter]);

  // Create column definitions dynamically
  const columnDefs = useMemo(() => {
    if (columns.length > 0) {
      // Dynamic columns based on API response
      const dynamicColumns = columns.map((column) =>
        columnHelper.accessor(
          (row) => row[column.key],
          {
            id: column.key,
            header: column.label,
            cell: (info) => (
              <GenericCell
                value={info.getValue()}
                columnKey={column.key}
              />
            ),
            enableSorting: true,
            enableColumnFilter: true,
            size: column.key === "name" ? 200 : 150,
          }
        )
      );

      return dynamicColumns;
    }

    // Fallback to static columns
    return [
      columnHelper.accessor("title", {
        id: "title",
        header: "Subject",
        cell: (info) => (
          <div className="text-sm font-medium text-gray-900 px-3 py-2 truncate">
            {info.getValue() || (
              <span className="text-gray-400 italic">No subject</span>
            )}
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        size: 200,
      }),
      columnHelper.accessor("description", {
        id: "description",
        header: "Message",
        cell: (info) => (
          <div className="text-sm text-gray-600 px-3 py-2 line-clamp-2">
            {info.getValue()}
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        size: 300,
      }),
      columnHelper.accessor("priority", {
        id: "priority",
        header: "Priority",
        cell: (info) => (
          <div className="flex justify-center px-3 py-2">
            <TaskPriority priority={info.getValue()} />
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.accessor("dueDate", {
        id: "dueDate",
        header: "Due",
        cell: (info) => (
          <div className="flex justify-center px-3 py-2">
            <TimeDisplay time={info.getValue()} />
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.accessor("status", {
        id: "status",
        header: "Status",
        cell: (info) => (
          <div className="flex justify-center px-3 py-2">
            <TaskStatus status={info.getValue()} />
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.accessor("assignedTo", {
        id: "assignedTo",
        header: "Received from",
        cell: (info) => (
          <div className="flex justify-center px-3 py-2">
            <PersonDisplay name={info.getValue()} variant="assigned" />
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        size: 150,
      }),
      columnHelper.accessor("person", {
        id: "person",
        header: "Person",
        cell: (info) => (
          <div className="flex justify-center px-3 py-2">
            <PersonDisplay name={info.getValue()} variant="person" />
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        size: 150,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex justify-center px-3 py-2">
            <TaskActions
              onReply={() => onReply(info.row.original.id)}
              onComplete={() => onComplete(info.row.original.id)}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 120,
      }),
    ];
  }, [columns, onReply, onComplete]);

  // Debounced fetch function to prevent excessive API calls
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState(globalFilter);
  
  // Debounce the global filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Fetch data when table state changes
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await fetchData({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sorting,
          columnFilters,
          globalFilter: debouncedGlobalFilter,
        });
        
        setData(response.data);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Failed to fetch table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [pagination, sorting, columnFilters, debouncedGlobalFilter, fetchData]);

  // Initialize table
  const table = useReactTable({
    data,
    columns: columnDefs,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // Export to CSV function
  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = columnDefs.map((col) => col.header as string).join(",");
    const rows = data
      .map((row) =>
        columnDefs
          .map((col) => {
            const value = row[col.id as keyof ExtendedTask];
            return `"${String(value || "").replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "table-data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="hidden sm:block w-full">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Header Controls */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {totalCount} total records
            </span>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
            disabled={data.length === 0}
          >
            Export CSV
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center space-x-1 ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-gray-700"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: " ↑",
                                desc: " ↓",
                              }[header.column.getIsSorted() as string] ?? " ↕"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-gray-200 text-sm"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <span className="text-sm text-gray-500">
              ({totalCount} total records)
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};