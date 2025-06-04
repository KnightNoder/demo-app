import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { TaskPriority } from "../molecules/TaskPriority";
import { TaskStatus } from "../molecules/TaskStatus";
import { TaskActions } from "../molecules/TaskAction";
import { TimeDisplay } from "../molecules/TimeDisplay";
import { PersonDisplay } from "../molecules/PersonDisplay";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
  [key: string]: any; // This allows dynamic property access
}

// Import the ApiColumn interface
export interface ApiColumn {
  key: string;
  label: string;
}

export interface AGGridTableProps {
  tasks: ExtendedTask[];
  columns?: ApiColumn[]; // Add optional columns prop
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onGridReady?: (event: GridReadyEvent) => void;
}

// Generic cell renderer for dynamic columns
// Generic cell renderer for dynamic columns
// Generic cell renderer for dynamic columns
const GenericCellRenderer: React.FC<ICellRendererParams> = ({
  value,
  colDef,
  columnApi,
}) => {
  const fieldName = colDef?.field || "";

  // Check if this is the first data column (after checkbox)
  const allColumns = columnApi?.getColumns() || [];
  const firstDataColumn = allColumns.find(
    (col) => col.getColId() !== "checkbox"
  );
  const isFirstDataColumn = colDef?.field === firstDataColumn?.getColId();

  // Base classes with conditional font size
  const baseClasses = `text-sm text-gray-900 flex items-center justify-center h-full ${
    isFirstDataColumn ? "text-base font-medium" : ""
  }`;

  // Handle special formatting for common field types
  if (fieldName.toLowerCase().includes("phone")) {
    return (
      <div className={baseClasses} title={value}>
        {value || <span className="text-gray-400 italic">-</span>}
      </div>
    );
  }

  if (fieldName.toLowerCase().includes("date") || fieldName === "DOB") {
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

  if (fieldName === "pid") {
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

// Cell Renderers (keeping original ones for backward compatibility)
const TitleRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div
      className="text-sm font-medium text-gray-900 flex items-center justify-center h-full truncate"
      title={value}
    >
      {value || <span className="text-gray-400 italic">No subject</span>}
    </div>
  );
};

const DescriptionRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div
      className="text-sm text-gray-600 flex items-center justify-center h-full line-clamp-2"
      title={value}
    >
      {value}
    </div>
  );
};

const PriorityRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <TaskPriority priority={value} />
    </div>
  );
};

const StatusRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <TaskStatus status={value} />
    </div>
  );
};

const DueDateRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <TimeDisplay time={value} />
    </div>
  );
};

const AssignedToRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <PersonDisplay name={value} variant="assigned" />
    </div>
  );
};

const PersonRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <PersonDisplay name={value} variant="person" />
    </div>
  );
};

const ActionsRenderer: React.FC<ActionsRendererProps> = ({
  data,
  onReply,
  onComplete,
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <TaskActions
        onReply={() => onReply(data.id)}
        onComplete={() => onComplete(data.id)}
      />
    </div>
  );
};

interface ActionsRendererProps extends ICellRendererParams {
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const AGGridTable: React.FC<AGGridTableProps> = ({
  tasks,
  columns = [], // Default to empty array
  onReply,
  onComplete,
  onGridReady,
}) => {
  const columnDefs: ColDef[] = useMemo(() => {
    const dynamicColumns: ColDef[] = [];

    // If we have API columns, create dynamic column definitions
    if (columns.length > 0) {
      // Add checkbox column first
      dynamicColumns.push({
        field: "checkbox",
        headerName: "",
        width: 50,
        maxWidth: 50,
        minWidth: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: "left",
        lockPosition: true,
        suppressMenu: true,
        sortable: false,
        filter: false,
        resizable: false,
        flex: 0,
      });

      // Create columns based on API response
      columns.forEach((column) => {
        const colDef: ColDef = {
          field: column.key,
          headerName: column.label,
          cellRenderer: GenericCellRenderer,
          sortable: true,
          filter: "agTextColumnFilter",
          flex: 1,
          minWidth: 120,
          comparator: (valueA: any, valueB: any) => {
            if (!valueA && !valueB) return 0;
            if (!valueA) return -1;
            if (!valueB) return 1;

            // Handle different data types
            if (
              column.key.toLowerCase().includes("date") ||
              column.key === "DOB"
            ) {
              const dateA = new Date(valueA).getTime();
              const dateB = new Date(valueB).getTime();
              return dateA - dateB;
            }

            if (column.key === "pid") {
              return Number(valueA) - Number(valueB);
            }

            return String(valueA).localeCompare(String(valueB));
          },
        };

        // Adjust column width based on content type
        if (column.key === "pid") {
          colDef.width = 100;
          colDef.flex = 0;
        } else if (column.key === "name") {
          colDef.flex = 1;
          colDef.minWidth = 150;
        } else if (column.key.toLowerCase().includes("phone")) {
          colDef.minWidth = 130;
        } else if (column.key === "postal_code") {
          colDef.width = 100;
          colDef.flex = 0;
        }

        dynamicColumns.push(colDef);
      });

      // Add actions column at the end
      dynamicColumns.push({
        field: "actions",
        headerName: "Actions",
        cellRenderer: (props: ICellRendererParams) =>
          ActionsRenderer({ ...props, onReply, onComplete }),
        sortable: false,
        filter: false,
        resizable: false,
        suppressMenu: true,
        flex: 1,
        minWidth: 120,
      });

      return dynamicColumns;
    }

    // Fallback to original static columns if no API columns are provided
    return [
      {
        field: "checkbox",
        headerName: "",
        width: 50,
        maxWidth: 50,
        minWidth: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: "left",
        lockPosition: true,
        suppressMenu: true,
        sortable: false,
        filter: false,
        resizable: false,
        flex: 0,
      },
      {
        field: "title",
        headerName: "Subject",
        cellRenderer: TitleRenderer,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 0.5,
        minWidth: 150,
        comparator: (valueA: string, valueB: string) => {
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.localeCompare(valueB);
        },
      },
      {
        field: "description",
        headerName: "Message",
        cellRenderer: DescriptionRenderer,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 3,
        minWidth: 150,
        comparator: (valueA: string, valueB: string) => {
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.localeCompare(valueB);
        },
      },
      {
        field: "priority",
        headerName: "Priority",
        cellRenderer: PriorityRenderer,
        sortable: true,
        filter: "agSetColumnFilter",
        flex: 1,
        minWidth: 100,
        comparator: (valueA: string, valueB: string) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityA =
            priorityOrder[
              valueA?.toLowerCase() as keyof typeof priorityOrder
            ] || 0;
          const priorityB =
            priorityOrder[
              valueB?.toLowerCase() as keyof typeof priorityOrder
            ] || 0;
          return priorityA - priorityB;
        },
      },
      {
        field: "dueDate",
        headerName: "Due",
        cellRenderer: DueDateRenderer,
        sortable: true,
        filter: "agTextColumnFilter",
        sort: "asc",
        flex: 1,
        minWidth: 100,
        comparator: (valueA: string, valueB: string) => {
          if (!valueA && !valueB) return 0;
          if (!valueA) return 1;
          if (!valueB) return -1;
          const dateA = new Date(valueA).getTime();
          const dateB = new Date(valueB).getTime();
          return dateA - dateB;
        },
      },
      {
        field: "status",
        headerName: "Status",
        cellRenderer: StatusRenderer,
        sortable: true,
        filter: "agSetColumnFilter",
        flex: 1,
        minWidth: 100,
        comparator: (valueA: string, valueB: string) => {
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.localeCompare(valueB);
        },
      },
      {
        field: "assignedTo",
        headerName: "Received from",
        cellRenderer: AssignedToRenderer,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1.5,
        minWidth: 120,
        comparator: (valueA: string, valueB: string) => {
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.localeCompare(valueB);
        },
      },
      {
        field: "person",
        headerName: "Person",
        cellRenderer: PersonRenderer,
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 0.5,
        minWidth: 120,
        comparator: (valueA: string, valueB: string) => {
          if (!valueA && !valueB) return 0;
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.localeCompare(valueB);
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        cellRenderer: (props: ICellRendererParams) =>
          ActionsRenderer({ ...props, onReply, onComplete }),
        sortable: false,
        filter: false,
        resizable: false,
        suppressMenu: true,
        flex: 1,
        minWidth: 120,
      },
    ];
  }, [columns, onReply, onComplete]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
    }),
    []
  );

  // Enhanced onGridReady to handle virtualization issues
  const handleGridReady = (event: GridReadyEvent) => {
    const { api } = event;

    // Force refresh of view after a small delay to fix virtualization issues
    setTimeout(() => {
      api.refreshCells({ force: true });
      api.redrawRows();
    }, 100);

    // Call the original onGridReady if provided
    if (onGridReady) {
      onGridReady(event);
    }
  };

  return (
    <div className="hidden sm:block w-full">
      <div className="w-full" style={{ height: "600px" }}>
        <div
          className="ag-theme-alpine ag-theme-custom w-full h-full rounded-lg shadow-sm animate-fade-in"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <AgGridReact
            rowData={tasks}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={handleGridReady}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            enableRangeSelection={true}
            suppressMenuHide={false}
            getRowId={(params) => params.data.id}
            suppressHorizontalScroll={true}
            suppressRowVirtualisation={true}
            domLayout="autoHeight"
            suppressAnimationFrame={false}
            ensureDomOrder={true}
            rowHeight={60}
            suppressCellFocus={true}
            enableCellTextSelection={true}
            rowStyle={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};