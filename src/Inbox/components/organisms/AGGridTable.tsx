import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Task } from './TaskDetailCard';
import { TaskPriority } from '../molecules/TaskPriority';
import { TaskStatus } from '../molecules/TaskStatus';
import { TaskActions } from '../molecules/TaskAction';
import { TimeDisplay } from '../molecules/TimeDisplay';
import { PersonDisplay } from '../molecules/PersonDisplay';

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

const ActionsRenderer: React.FC<ActionsRendererProps> = ({ data, onReply, onComplete }) => {
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
  onGridReady 
}) => {
  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'checkbox',
      headerName: '',
      width: 35,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      lockPosition: true,
      suppressMenu: true,
      sortable: false,
      filter: false,
      resizable: false
    },
    {
      field: 'title',
      headerName: 'Subject',
      width: 200,
      cellRenderer: TitleRenderer,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'description',
      headerName: 'Message',
      width: 250,
      cellRenderer: DescriptionRenderer,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      cellRenderer: PriorityRenderer,
      sortable: true,
      filter: 'agSetColumnFilter'
    },
    {
      field: 'dueDate',
      headerName: 'Due',
      width: 120,
      cellRenderer: DueDateRenderer,
      sortable: true,
      filter: 'agTextColumnFilter',
      sort: 'asc'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellRenderer: StatusRenderer,
      sortable: true,
      filter: 'agSetColumnFilter'
    },
    {
      field: 'assignedTo',
      headerName: 'Received from',
      width: 150,
      cellRenderer: AssignedToRenderer,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'person',
      headerName: 'Person',
      width: 150,
      cellRenderer: PersonRenderer,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      cellRenderer: (props: ICellRendererParams) => 
        ActionsRenderer({ ...props, onReply, onComplete }),
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true
    }
  ], [onReply, onComplete]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    flex: 0,
    minWidth: 100
  }), []);

  return (
    <div className="hidden sm:block w-full overflow-x-auto">
      <div className="min-w-[1200px] h-[calc(100vh-350px)]">
        <div 
          className="ag-theme-alpine ag-theme-custom w-full h-full rounded-lg shadow-sm animate-fade-in" 
          style={{ 
            width: '100%', 
            height: '100%', 
            // '--ag-borders-secondary': 'none',
            // '--ag-line-height': '48px'
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
          />
        </div>
      </div>
    </div>
  );
};