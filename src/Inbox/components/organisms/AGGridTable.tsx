import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
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

// RecurrenceCellRenderer - moved here to ensure proper usage
const RecurrenceCellRenderer: React.FC<{ value: string }> = ({ value }) => {
  const isRepeat = value?.toLowerCase() === "repeat";

  return (
    <div className="flex items-center gap-1">
      <span>{value}</span>
      {isRepeat && (
        <svg
          className="w-4 h-4 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </div>
  );
};

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

// Copay Cell Renderer Component
const CopayCellRenderer: React.FC<{ value: string }> = ({ value }) => {
  const displayValue = value || "$0.00";
  
  return (
    <div className="flex items-center text-sm font-medium text-gray-900">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4 mr-1 text-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      {displayValue}
    </div>
  );
};

// Person/User Icon Component with Avatar Circle
const PersonWithIcon: React.FC<{ name: string }> = ({ name }) => {
  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "?";
  };

  // If no name, don't show the icon or anything
  if (!name || name.trim() === "") {
    return <span className="text-sm text-gray-400">-</span>;
  }

  return (
    <div className="flex items-center">
      <div className="w-6 h-6 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-xs text-gray-600">
        {getInitial(name)}
      </div>
      <span className="text-sm text-gray-900">{name}</span>
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

export const AGGridTable = forwardRef<any, AGGridTableProps>(
  (
    {
      tasks,
      columns,
      onReply,
      onComplete,
      activeTab = "reminders",
      panelWidth,
    },
    ref
  ) => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [containerHeight, setContainerHeight] = useState(600);

    // Expose the grid API to parent component
    useImperativeHandle(ref, () => ({
      api: gridApi,
    }));

    // Check if we're dealing with reminders/urgent tasks (has subject/message columns) or birthdays
    const isRemindersData = columns.some(
      (col) => col.key === "subject" || col.key === "message"
    );

    // Check if this is urgent tasks data (high/medium/low priority reminders)
    const isUrgentTasksData = isRemindersData && activeTab === "reminders";

    // Calculate stable column widths to prevent layout shifts
    const getColumnWidth = (baseWidth: number) => {
      if (!panelWidth) return baseWidth;
      // Use more stable width calculation with less variance
      const availableWidth = panelWidth - 100; // Account for padding and scrollbar
      const scaleFactor = Math.max(0.9, Math.min(1.1, availableWidth / 1200)); // Reduced range: 90% to 110%
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

      // For reminders data (including urgent tasks), use custom cell renderers with fixed widths
      if (activeTab === "reminders" && isRemindersData) {
        const reminderColumns: ColDef[] = [
          {
            field: "subject",
            headerName: "Subject",
            width: getColumnWidth(280),
            minWidth: 200,
            cellRenderer: (params: any) => <TitleCell title={params.value} />,
            wrapText: false,
            autoHeight: false,
          },
          {
            field: "message",
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
            field: "due_date",
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
            cellRenderer: (params: any) => (
              <StatusBadge status={params.value} />
            ),
          },
          {
            field: "received_from",
            headerName: "Received from",
            width: getColumnWidth(180),
            minWidth: 150,
            cellRenderer: (params: any) => (
              <PersonWithIcon name={params.value} />
            ),
          },
          {
            field: "patient",
            headerName: "Patient",
            width: getColumnWidth(180),
            minWidth: 150,
            cellRenderer: (params: any) => (
              <PersonWithIcon name={params.value} />
            ),
          },
          {
            field: "actions",
            headerName: "Actions",
            width: getColumnWidth(130),
            minWidth: 120,
            cellRenderer: (params: any) => (
              <RemindersActionsCell
                taskId={params.data.id}
                onReply={onReply}
                onComplete={onComplete}
              />
            ),
            sortable: false,
            filter: false,
            resizable: true,
          },
        ];

        return [...baseColumns, ...reminderColumns];
      }

      // For agenda data, create columns with special handling for Person column, Recurrence column, and Copay column
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

          // Special handling for Recurrence column to show icon
          if (column.key === "recurrence_type") {
            return {
              field: column.key,
              headerName: column.label,
              width: getColumnWidth(150),
              minWidth: 120,
              cellRenderer: (params: any) => (
                <RecurrenceCellRenderer value={params.value} />
              ),
            };
          }

          // Special handling for Copay column to show currency icon
          if (column.key === "copay") {
            return {
              field: column.key,
              headerName: column.label,
              width: getColumnWidth(120),
              minWidth: 100,
              cellRenderer: (params: any) => (
                <CopayCellRenderer value={params.value} />
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
          width: getColumnWidth(120),
          minWidth: 110,
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
          resizable: true,
        };

        return [...baseColumns, ...agendaColumns, actionsColumn];
      }

      // For birthday data and other dynamic data, use columns from API WITHOUT actions column
      const dynamicColumns: ColDef[] = columns.map((column) => ({
        field: column.key,
        headerName: column.label,
        width: getColumnWidth(150),
        minWidth: 120,
      }));

      // Filter out any empty columns or columns with missing field data
      const validDynamicColumns = dynamicColumns.filter((col) => col.field && col.field.trim() !== '');

      return [...baseColumns, ...validDynamicColumns];
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
      // Remove automatic column sizing to prevent layout shifts
    };

    // Handle tab changes and data updates - resize columns to fit
    useEffect(() => {
      if (gridApi && tasks.length > 0) {
        const timer = setTimeout(() => {
          gridApi.sizeColumnsToFit();
        }, 150); // Small delay to ensure data is rendered
        
        return () => clearTimeout(timer);
      }
    }, [gridApi, activeTab, tasks.length, columns.length]);

    // Handle window resize with debouncing
    useEffect(() => {
      let resizeTimer: NodeJS.Timeout;
      
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (gridApi) {
            gridApi.sizeColumnsToFit();
          }
        }, 250); // Debounced resize
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);
      };
    }, [gridApi]);

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
        className="ag-theme-alpine w-full px-4"
        style={{
          height: `${containerHeight}px`,
          minHeight: `${containerHeight}px`,
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
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={false}
          suppressColumnMoveAnimation={true}
          suppressAnimationFrame={true}
          maintainColumnOrder={true}
          suppressLoadingOverlay={true}
          suppressNoRowsOverlay={true}
          rowClassRules={{
            "ag-row-even": (params) => params.node.rowIndex! % 2 === 0,
            "ag-row-odd": (params) => params.node.rowIndex! % 2 === 1,
          }}
          onFirstDataRendered={(params) => {
            // Initial column sizing on first render
            if (params.api) {
              setTimeout(() => {
                params.api.sizeColumnsToFit();
              }, 100);
            }
          }}
          onModelUpdated={(params) => {
            // Resize columns when data model updates (tab changes)
            if (params.api && tasks.length > 0) {
              setTimeout(() => {
                params.api.sizeColumnsToFit();
              }, 50);
            }
          }}
        />
      </div>
    );
  }
);