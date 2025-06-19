import React, { useMemo, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, GridApi } from "ag-grid-community";
import { ExtendedTask, ApiColumn } from "./TaskManagementContainer";
import { formatDueDate } from "../../../utils/utils";

interface AGGridTableProps {
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  activeTab?: string;
  isPanelReady?: boolean;
  panelWidth?: number;
}

// Priority Badge Component
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border hover:bg-gray-50 text-sm h-6 ${getPriorityStyles(priority)}`}
    >
      {priority?.charAt(0).toUpperCase() + priority?.slice(1) || ""}
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in-progress":
        return "In Progress";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || "";
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border hover:bg-gray-50 text-sm h-6 ${getStatusStyles(status)}`}
    >
      {getStatusLabel(status)}
    </div>
  );
};

// Person/User Icon Component with Avatar Circle
const PersonWithIcon: React.FC<{ name: string }> = ({ name }) => {
  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  return (
    <div className="flex items-center">
      <div className="w-6 h-6 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-xs text-gray-600">
        {name ? getInitial(name) : ""}
      </div>
      <span className="text-sm text-gray-900">{name || ""}</span>
    </div>
  );
};

// Due Date with Clock Icon
const DueDateWithIcon: React.FC<{ dueDate: string }> = ({ dueDate }) => (
  <div className="flex items-center text-sm text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-4 w-4 mr-2 text-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
    {dueDate || "No due date"}
  </div>
);

// Actions Component for Reminders (Reply button + Complete checkbox)
const RemindersActionsCell: React.FC<{
  taskId: string;
  onReply: (id: string) => void;
  onComplete: (id: string) => void;
}> = ({ taskId, onReply, onComplete }) => (
  <div className="flex gap-2 items-center justify-end">
    <button
      className="text-blue-600 hover:text-blue-800 text-xs font-medium underline px-1 py-0.5"
      onClick={() => onReply(taskId)}
      title="Reply to task"
    >
      Reply
    </button>
    <button
      className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-50"
      onClick={() => onComplete(taskId)}
      title="Complete task"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-5 w-5 text-green-500 hover:text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>
  </div>
);

// Actions Component for Agenda (View, Edit, Delete icons)
const AgendaActionsCell: React.FC<{
  taskId: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = ({ taskId, onView, onEdit, onDelete }) => (
  <div className="flex gap-1 items-center justify-center">
    {/* View Icon */}
    <button
      className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
      onClick={() => onView?.(taskId)}
      title="View appointment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </button>

    {/* Edit Icon */}
    <button
      className="text-gray-400 hover:text-green-600 p-1 rounded hover:bg-green-50 transition-colors"
      onClick={() => onEdit?.(taskId)}
      title="Edit appointment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>
    </button>

    {/* Delete Icon */}
    <button
      className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
      onClick={() => onDelete?.(taskId)}
      title="Delete appointment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </button>
  </div>
);

// Title Cell Component
const TitleCell: React.FC<{ title: string }> = ({ title }) => {
  const displayTitle = title || "No subject";
  const isEmptyTitle = !title;

  return (
    <div
      className="text-sm font-medium text-gray-900 truncate"
      title={displayTitle}
    >
      {isEmptyTitle ? (
        <span className="text-gray-400 italic">No subject</span>
      ) : (
        displayTitle
      )}
    </div>
  );
};

// Description Cell Component
const DescriptionCell: React.FC<{ description: string }> = ({
  description,
}) => (
  <div
    className="text-sm text-gray-600 line-clamp-2"
    title={description || "No description"}
  >
    {description || "No description"}
  </div>
);

export const AGGridTable: React.FC<AGGridTableProps> = ({
  tasks,
  columns,
  onReply,
  onComplete,
  activeTab = "reminders",
  isPanelReady = true,
  panelWidth,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  // Check if we're dealing with reminders/urgent tasks (has subject/message columns) or birthdays
  const isRemindersData = columns.some(
    (col) => col.key === "subject" || col.key === "message"
  );

  // Check if this is urgent tasks data (high/medium/low priority reminders)
  const isUrgentTasksData = isRemindersData && activeTab === "reminders";

  // Calculate dynamic column widths based on panel width
  const getColumnWidth = (baseWidth: number) => {
    if (!panelWidth) return baseWidth;
    const availableWidth = panelWidth - 100; // Account for padding and scrollbar
    const scaleFactor = Math.max(0.8, Math.min(1.2, availableWidth / 1200)); // Scale between 80% and 120%
    return Math.max(120, Math.floor(baseWidth * scaleFactor));
  };

  // Placeholder functions for agenda actions
  const handleView = (taskId: string) => {
    console.log("View appointment:", taskId);
    // TODO: Implement view functionality
  };

  const handleEdit = (taskId: string) => {
    console.log("Edit appointment:", taskId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (taskId: string) => {
    console.log("Delete appointment:", taskId);
    // TODO: Implement delete functionality
  };

  const columnDefs = useMemo((): ColDef[] => {
    // Base columns that always exist for reminders and agenda (not birthdays)
    let baseColumns: ColDef[] = [];

    // Only add checkbox column for reminders, urgent tasks, and agenda, not birthdays
    if (activeTab !== "birthdays") {
      baseColumns = [
        {
          field: "checkbox",
          headerName: "",
          width: 50,
          minWidth: 50,
          maxWidth: 50,
          checkboxSelection: true,
          headerCheckboxSelection: true,
          pinned: "left",
          sortable: false,
          filter: false,
          resizable: false,
          suppressSizeToFit: true,
        },
      ];
    }

    // For reminders data AND urgent tasks data, use custom cell renderers with fixed widths
    if ((isRemindersData && activeTab === "reminders") || isUrgentTasksData) {
      const reminderColumns: ColDef[] = [
        {
          field: "title",
          headerName: "Subject",
          width: getColumnWidth(280),
          minWidth: 200,
          cellRenderer: (params: any) => <TitleCell title={params.value} />,
          wrapText: false,
          autoHeight: false,
        },
        {
          field: "description",
          headerName: "Message",
          width: getColumnWidth(300),
          minWidth: 250,
          cellRenderer: (params: any) => (
            <DescriptionCell description={params.value} />
          ),
          wrapText: false,
          autoHeight: false,
        },
        {
          field: "priority",
          headerName: "Priority",
          width: getColumnWidth(130),
          minWidth: 120,
          cellRenderer: (params: any) => (
            <PriorityBadge priority={params.value} />
          ),
        },
        {
          field: "dueDate",
          headerName: "Due",
          width: getColumnWidth(180),
          minWidth: 150,
          cellRenderer: (params: any) => (
            <DueDateWithIcon dueDate={formatDueDate(params.value)} />
          ),
        },
        {
          field: "status",
          headerName: "Status",
          width: getColumnWidth(130),
          minWidth: 120,
          cellRenderer: (params: any) => <StatusBadge status={params.value} />,
        },
        {
          field: "assignedTo",
          headerName: "Received from",
          width: getColumnWidth(180),
          minWidth: 150,
          cellRenderer: (params: any) => <PersonWithIcon name={params.value} />,
        },
        {
          field: "person",
          headerName: "Person",
          width: getColumnWidth(180),
          minWidth: 150,
          cellRenderer: (params: any) => <PersonWithIcon name={params.value} />,
        },
        {
          field: "actions",
          headerName: "Actions",
          width: 130,
          minWidth: 130,
          maxWidth: 130,
          cellRenderer: (params: any) => (
            <RemindersActionsCell
              taskId={params.data.id}
              onReply={onReply}
              onComplete={onComplete}
            />
          ),
          sortable: false,
          filter: false,
          pinned: "right",
          suppressSizeToFit: true,
        },
      ];

      return [...baseColumns, ...reminderColumns];
    }

    // For agenda data, create columns with special handling for Person column
    if (activeTab === "agenda") {
      const agendaColumns: ColDef[] = columns.map((column) => {
        // Special handling for Person column to show avatar
        if (column.key === "name" || column.key === "patient_name") {
          return {
            field: column.key,
            headerName: column.label,
            width: getColumnWidth(180),
            minWidth: 150,
            cellRenderer: (params: any) => (
              <PersonWithIcon name={params.value} />
            ),
          };
        }

        return {
          field: column.key,
          headerName: column.label,
          width: getColumnWidth(150),
          minWidth: 120,
        };
      });

      // Add actions column for agenda
      const actionsColumn: ColDef = {
        field: "actions",
        headerName: "Actions",
        width: 110,
        minWidth: 110,
        maxWidth: 110,
        cellRenderer: (params: any) => (
          <AgendaActionsCell
            taskId={params.data.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
        sortable: false,
        filter: false,
        pinned: "right",
        suppressSizeToFit: true,
      };

      return [...baseColumns, ...agendaColumns, actionsColumn];
    }

    // For birthday data, use dynamic columns from API WITHOUT actions column
    const dynamicColumns: ColDef[] = columns.map((column) => ({
      field: column.key,
      headerName: column.label,
      width: getColumnWidth(150),
      minWidth: 120,
    }));

    // No actions column for birthdays
    return [...baseColumns, ...dynamicColumns];
  }, [
    columns,
    onReply,
    onComplete,
    isRemindersData,
    isUrgentTasksData,
    panelWidth,
    activeTab,
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      suppressSizeToFit: false,
      wrapText: false,
      autoHeight: false,
    }),
    []
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);

    // Delay sizing to ensure panel is ready
    setTimeout(() => {
      if (params.api && isPanelReady) {
        params.api.sizeColumnsToFit();
      }
    }, 150);
  };

  // Handle panel width changes and resize grid
  useEffect(() => {
    if (gridApi && isPanelReady && panelWidth) {
      const timer = setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [gridApi, isPanelReady, panelWidth]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (gridApi && isPanelReady) {
        setTimeout(() => {
          gridApi.sizeColumnsToFit();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridApi, isPanelReady]);

  // Calculate container height based on available space
  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = 120; // Approximate header height
      const availableHeight = window.innerHeight - headerHeight;
      setContainerHeight(Math.max(400, availableHeight));
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  return (
    <div
      className="ag-theme-alpine w-full hidden md:block px-4"
      style={{
        height: `${containerHeight}px`,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={tasks}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={20}
        headerHeight={40}
        rowHeight={48}
        animateRows={false}
        suppressCellFocus={true}
        suppressRowTransform={true}
        suppressColumnVirtualisation={false}
        suppressRowVirtualisation={false}
        suppressLoadingOverlay={true}
        suppressNoRowsOverlay={true}
        rowClassRules={{
          "ag-row-even": (params) => params.node.rowIndex! % 2 === 0,
          "ag-row-odd": (params) => params.node.rowIndex! % 2 === 1,
        }}
        onFirstDataRendered={(params) => {
          if (isPanelReady) {
            setTimeout(() => {
              params.api.sizeColumnsToFit();
            }, 50);
          }
        }}
      />
    </div>
  );
};