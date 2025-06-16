import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import { ExtendedTask, ApiColumn } from "./TaskManagementContainer";
import { formatDueDate } from "../../../utils/utils";

interface AGGridTableProps {
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  activeTab?: string;
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
      {priority?.charAt(0).toUpperCase() + priority?.slice(1) || "Unknown"}
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
        return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
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

// Person/User Icon Component
const PersonWithIcon: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center text-sm text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 mr-2 text-gray-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
    {name || "Unknown"}
  </div>
);

// Due Date with Clock Icon
const DueDateWithIcon: React.FC<{ dueDate: string }> = ({ dueDate }) => (
  <div className="flex items-center text-sm text-gray-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5 mr-2 text-gray-500"
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

// Actions Component
const ActionsCell: React.FC<{
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
      className="text-gray-400 hover:text-gray-600 p-2 rounded-sm hover:bg-gray-50"
      onClick={() => onComplete(taskId)}
      title="Complete task"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-6 w-6 text-green-500 hover:text-green-600"
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
  activeTab = "reminders", // Default to reminders tab
}) => {
  // Check if we're dealing with reminders (has subject/message columns) or birthdays
  const isRemindersData = columns.some(
    (col) => col.key === "subject" || col.key === "message"
  );

  const columnDefs = useMemo((): ColDef[] => {
    // Base columns that always exist
    let baseColumns: ColDef[] = [];
    baseColumns = [
      {
        field: "checkbox",
        headerName: "",
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: "left",
        sortable: false,
        filter: false,
        resizable: false,
      },
    ];
    if (activeTab == "birthdays") {
      baseColumns = [];
    }

    // For reminders data, use custom cell renderers
    if (isRemindersData) {
      const reminderColumns: ColDef[] = [
        {
          field: "title",
          headerName: "Subject",
          width: 300,
          cellRenderer: (params: any) => <TitleCell title={params.value} />,
        },
        {
          field: "description",
          headerName: "Message",
          width: 300,
          cellRenderer: (params: any) => (
            <DescriptionCell description={params.value} />
          ),
        },
        {
          field: "priority",
          headerName: "Priority",
          width: 150,
          cellRenderer: (params: any) => (
            <PriorityBadge priority={params.value} />
          ),
        },
        {
          field: "dueDate",
          headerName: "Due",
          width: 200,
          cellRenderer: (params: any) => (
            <DueDateWithIcon dueDate={formatDueDate(params.value)} />
          ),
        },
        {
          field: "status",
          headerName: "Status",
          width: 150,
          cellRenderer: (params: any) => <StatusBadge status={params.value} />,
        },
        {
          field: "assignedTo",
          headerName: "Received from",
          width: 200,
          cellRenderer: (params: any) => <PersonWithIcon name={params.value} />,
        },
        {
          field: "person",
          headerName: "Person",
          width: 200,
          cellRenderer: (params: any) => <PersonWithIcon name={params.value} />,
        },
        {
          field: "actions",
          headerName: "Actions",
          width: 150,
          cellRenderer: (params: any) => (
            <ActionsCell
              taskId={params.data.id}
              onReply={onReply}
              onComplete={onComplete}
            />
          ),
          sortable: false,
          filter: false,
          pinned: "right",
        },
      ];

      return [...baseColumns, ...reminderColumns];
    }

    // For birthday data or other data, use dynamic columns from API
    const dynamicColumns: ColDef[] = columns.map((column) => ({
      field: column.key,
      headerName: column.label,
      width: 150,
      flex: 1,
    }));

    const actionsColumn: ColDef = {
      field: "actions",
      headerName: "Actions",
      width: 150,
      cellRenderer: (params: any) => (
        <ActionsCell
          taskId={params.data.id}
          onReply={onReply}
          onComplete={onComplete}
        />
      ),
      sortable: false,
      filter: false,
      pinned: "right",
    };

    return [...baseColumns, ...dynamicColumns, actionsColumn];
  }, [columns, onReply, onComplete, isRemindersData]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
    }),
    []
  );

  const onGridReady = (params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div
      className="ag-theme-alpine w-full hidden md:block"
      style={{ height: "600px" }}
    >
      <AgGridReact
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
        rowClassRules={{
          "ag-row-even": (params) => params.node.rowIndex! % 2 === 0,
          "ag-row-odd": (params) => params.node.rowIndex! % 2 === 1,
        }}
      />
    </div>
  );
};
