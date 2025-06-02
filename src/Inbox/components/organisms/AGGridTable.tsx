import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Task } from "./TaskDetailCard";
import { TaskPriority } from "../molecules/TaskPriority";
import { TaskStatus } from "../molecules/TaskStatus";
import { TaskActions } from "../molecules/TaskAction";
import { TimeDisplay } from "../molecules/TimeDisplay";
import { PersonDisplay } from "../molecules/PersonDisplay";

export interface AGGridTableProps {
  tasks: Task[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onGridReady?: (event: GridReadyEvent) => void;
}

// Cell Renderers
const TitleRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="text-sm font-medium text-gray-900 truncate" title={value}>
      {value || <span className="text-gray-400 italic">No subject</span>}
    </div>
  );
};

const DescriptionRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="text-sm text-gray-600 line-clamp-2" title={value}>
      {value}
    </div>
  );
};

const PriorityRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return <TaskPriority priority={value} />;
};

const StatusRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return <TaskStatus status={value} />;
};

const DueDateRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return <TimeDisplay time={value} />;
};

const AssignedToRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return <PersonDisplay name={value} variant="assigned" />;
};

const PersonRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  return <PersonDisplay name={value} variant="person" />;
};

interface ActionsRendererProps extends ICellRendererParams {
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

const ActionsRenderer: React.FC<ActionsRendererProps> = ({
  data,
  onReply,
  onComplete,
}) => {
  return (
    <TaskActions
      onReply={() => onReply(data.id)}
      onComplete={() => onComplete(data.id)}
    />
  );
};

export const AGGridTable: React.FC<AGGridTableProps> = ({
  tasks,
  onReply,
  onComplete,
  onGridReady,
}) => {
  const columnDefs: ColDef[] = useMemo(
    () => [
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
        flex: 2,
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
        flex: 2,
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
          if (!valueA) return 1; // null dates go to end
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
    ],
    [onReply, onComplete]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  return (
    <div className="hidden sm:block w-full">
      <div className="w-full h-[calc(100vh-350px)]">
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
            onGridReady={onGridReady}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            pagination={true}
            paginationPageSize={20}
            domLayout="autoHeight"
            animateRows={true}
            enableRangeSelection={true}
            suppressMenuHide={false}
            getRowId={(params) => params.data.id}
            suppressHorizontalScroll={true}
          />
        </div>
      </div>
    </div>
  );
};
