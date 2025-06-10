import React, { useEffect, useState } from 'react';

// Extended task interface with index signature for dynamic properties
interface ExtendedTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  person: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'in-progress';
  type: string;
  [key: string]: any;
}

// API Column interface
interface ApiColumn {
  key: string;
  label: string;
}


// Mock data for demonstration
// const mockTasks: ExtendedTask[] = [
//   {
//     id: '1',
//     title: 'Crisis intervention plan review',
//     description: 'Crisis intervention plan',
//     assignedTo: 'Lisa Thompson',
//     person: 'Lisa Thompson',
//     dueDate: 'Today',
//     priority: 'high',
//     status: 'pending',
//     type: 'Treatment'
//   },
//   {
//     id: '2',
//     title: 'Reminder: Check in with high-risk patient',
//     description: 'High-risk patient check-in',
//     assignedTo: 'System',
//     person: '',
//     dueDate: 'Today',
//     priority: 'high',
//     status: 'pending',
//     type: 'Reminder'
//   },
//   {
//     id: '3',
//     title: 'High risk assessment for Kevin L.',
//     description: 'High risk assessment',
//     assignedTo: 'System',
//     person: '',
//     dueDate: 'Today',
//     priority: 'high',
//     status: 'pending',
//     type: 'Assessment'
//   },
//   {
//     id: '4',
//     title: 'DrFirst: Controlled substance monitoring alert',
//     description: 'Controlled substance monitoring alert',
//     assignedTo: 'System',
//     person: '',
//     dueDate: 'Today',
//     priority: 'high',
//     status: 'pending',
//     type: 'Dr First Notifications'
//   },
//   {
//     id: '5',
//     title: 'Document crisis intervention',
//     description: 'Document crisis intervention',
//     assignedTo: 'System',
//     person: '',
//     dueDate: 'Today',
//     priority: 'high',
//     status: 'pending',
//     type: 'Clinical'
//   }
// ];

// const mockColumns: ApiColumn[] = [
//   { key: 'title', label: 'Subject' },
//   { key: 'description', label: 'Message' },
//   { key: 'type', label: 'Type' },
//   { key: 'priority', label: 'Priority' },
//   { key: 'dueDate', label: 'Due' },
//   { key: 'status', label: 'Status' },
//   { key: 'assignedTo', label: 'Received from' },
//   { key: 'person', label: 'Person' }
// ];

// AGGrid Table Component (reusable component that can be used in both slide panel and TaskManagementContainer)
const AGGridTable: React.FC<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}> = ({ tasks, columns, onReply, onComplete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  

  return (
    <div className="hidden sm:block h-full overflow-x-auto">
      <div className="min-w-[1200px] h-full">
        <div className="ag-theme-alpine ag-theme-custom w-full h-full rounded-lg" >
          <div style={{ height: '100%' }}>
            <div className="ag-root-wrapper ag-ltr ag-layout-auto-height">
              <div className="ag-root-wrapper-body ag-focus-managed ag-layout-auto-height">
                <div className="ag-root ag-unselectable ag-layout-auto-height">
                  {/* Header */}
                  <div className="ag-header ag-pivot-off ag-header-allow-overflow" style={{ height: '41px', minHeight: '41px' }}>
                    <div className="ag-pinned-left-header" style={{ width: '35px', minWidth: '35px', maxWidth: '35px' }}>
                      <div className="ag-header-row ag-header-row-column" style={{ height: '40px', top: '0px', width: '35px' }}>
                        <div className="ag-header-cell ag-column-first ag-header-cell-sortable ag-focus-managed">
                          <input type="checkbox" className="ag-input-field-input ag-checkbox-input" />
                        </div>
                      </div>
                    </div>
                    <div className="ag-header-viewport">
                      <div className="ag-header-container" style={{ width: '1380px' }}>
                        <div className="ag-header-row ag-header-row-column" style={{ height: '40px', top: '0px', width: '1380px' }}>
                          {columns.map((column, index) => (
                            <div
                              key={column.key}
                              className="ag-header-cell ag-header-cell-sortable ag-focus-managed"
                              style={{ 
                                top: '0px', 
                                height: '40px', 
                                width: index === 0 ? '200px' : index === 1 ? '250px' : '150px',
                                left: index === 0 ? '0px' : index === 1 ? '200px' : `${200 + 250 + (index - 2) * 150}px`
                              }}
                            >
                              <div className="ag-header-cell-comp-wrapper">
                                <div className="ag-cell-label-container">
                                  <div className="ag-header-cell-label">
                                    <span className="ag-header-cell-text">{column.label}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div
                            className="ag-header-cell ag-column-last ag-header-cell-sortable ag-focus-managed"
                            style={{ 
                              top: '0px', 
                              height: '40px', 
                              width: '120px',
                              left: '1260px'
                            }}
                          >
                            <div className="ag-header-cell-comp-wrapper">
                              <div className="ag-cell-label-container">
                                <div className="ag-header-cell-label">
                                  <span className="ag-header-cell-text">Actions</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="ag-body ag-layout-auto-height">
                    <div className="ag-body-viewport ag-row-animation ag-layout-auto-height" style={{ width: 'calc(100% + 0px)' }}>
                      {/* Left pinned column */}
                      <div className="ag-pinned-left-cols-container" style={{ height: `${tasks.length * 48}px`, width: '35px', maxWidth: '35px', minWidth: '35px' }}>
                        {tasks.map((task, index) => (
                          <div
                            key={`checkbox-${task.id}`}
                            className={`ag-row ag-row-level-0 ag-row-position-absolute ${index % 2 === 0 ? 'ag-row-even' : 'ag-row-odd'} ${index === 0 ? 'ag-row-first' : ''} ${index === tasks.length - 1 ? 'ag-row-last' : ''}`}
                            style={{ transform: `translateY(${index * 48}px)`, height: '48px' }}
                          >
                            <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-last-left-pinned ag-column-first" style={{ left: '0px', width: '35px' }}>
                              <div className="ag-cell-wrapper">
                                <div className="ag-selection-checkbox">
                                  <input type="checkbox" className="ag-input-field-input ag-checkbox-input" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Center columns */}
                      <div className="ag-center-cols-viewport" style={{ height: `${tasks.length * 48}px` }}>
                        <div className="ag-center-cols-container" style={{ width: '1380px', height: `${tasks.length * 48}px` }}>
                          {tasks.map((task, index) => (
                            <div
                              key={task.id}
                              className={`ag-row ag-row-level-0 ag-row-position-absolute ${index % 2 === 0 ? 'ag-row-even' : 'ag-row-odd'} ${index === 0 ? 'ag-row-first' : ''} ${index === tasks.length - 1 ? 'ag-row-last' : ''}`}
                              style={{ transform: `translateY(${index * 48}px)`, height: '48px' }}
                            >
                              {/* Subject */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '0px', width: '200px' }}>
                                <div className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600" title={task.title}>
                                  {task.title}
                                </div>
                              </div>
                              
                              {/* Message */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '200px', width: '250px' }}>
                                <div className="text-sm text-gray-600 line-clamp-2 hover:line-clamp-none cursor-pointer py-2" title={task.description}>
                                  {task.description}
                                </div>
                              </div>
                              
                              {/* Type */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '450px', width: '150px' }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                    {/* {getTypeIcon(task.type)} */}
                                  </div>
                                  <span className="text-sm text-gray-600">{task.type}</span>
                                </div>
                              </div>
                              
                              {/* Priority */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '600px', width: '120px' }}>
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border hover:bg-gray-50 text-sm h-6 ${getPriorityColor(task.priority)}`}>
                                  {task.priority === 'high' ? 'High Priority' : 
                                   task.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                                </div>
                              </div>
                              
                              {/* Due */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '720px', width: '120px' }}>
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-gray-500">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  {task.dueDate}
                                </div>
                              </div>
                              
                              {/* Status */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '840px', width: '120px' }}>
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border hover:bg-gray-50 text-sm h-6 ${getStatusColor(task.status)}`}>
                                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </div>
                              </div>
                              
                              {/* Assigned To */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '960px', width: '150px' }}>
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-gray-600">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                  </svg>
                                  {task.assignedTo}
                                </div>
                              </div>
                              
                              {/* Person */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-cell-value" style={{ left: '1110px', width: '150px' }}>
                                {task.person && (
                                  <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer" title={`View patient chart for ${task.person}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-gray-600">
                                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    {task.person}
                                  </div>
                                )}
                              </div>
                              
                              {/* Actions */}
                              <div className="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-column-last ag-cell-value" style={{ left: '1260px', width: '120px' }}>
                                <div className="flex gap-1 justify-end">
                                  <button
                                    onClick={() => onReply(task.id)}
                                    className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent rounded-md text-blue-600 hover:text-blue-800 px-2 py-0.5 text-xs h-6"
                                  >
                                    Reply
                                  </button>
                                  <button
                                    onClick={() => onComplete(task.id)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-50"
                                    title="Complete task"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                      <path d="m9 11 3 3L22 4"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slide-out Panel Component (NEW - this is what you add to your existing code)
export const TaskSlidePanel: React.FC<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isVisible: boolean;
  onClose: () => void;
  title: string;
}> = ({ tasks, columns, onReply, onComplete, isVisible, onClose, title }) => {
  const [admittedOnly, setAdmittedOnly] = useState(false);
  const [panelWidth, setPanelWidth] = useState(1201.2);
  const [isResizing, setIsResizing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
  if (isVisible) {
    // Small delay to ensure DOM is ready, then start animation
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  } else {
    setIsAnimating(false);
  }
}, [isVisible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 514.8;
      const maxWidth = window.innerWidth * 0.9;
      
      setPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className={`flex-1 bg-[#000000CC] transition-all duration-500 ease-out ${
            isAnimating ? 'bg-opacity-90' : 'bg-opacity-0'
          }`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="bg-white border-l shadow-lg transition-all duration-500 ease-out relative flex flex-col"
        style={{ 
          width: `${panelWidth}px`, 
          minWidth: '514.8px', 
          maxWidth: '90vw',
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
          opacity: isAnimating ? 1 : 0
        }}
          >
        {/* Resize Handle */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-6 cursor-ew-resize hover:bg-blue-200/20 transition-colors group z-20"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
              <circle cx="9" cy="12" r="1"></circle>
              <circle cx="9" cy="5" r="1"></circle>
              <circle cx="9" cy="19" r="1"></circle>
              <circle cx="15" cy="12" r="1"></circle>
              <circle cx="15" cy="5" r="1"></circle>
              <circle cx="15" cy="19" r="1"></circle>
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2.5 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-gray-200 hover:bg-gray-50 text-xs font-normal text-gray-600 bg-gray-50">
              {tasks.length} tasks
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={admittedOnly}
                onClick={() => setAdmittedOnly(!admittedOnly)}
                className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                  admittedOnly ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                  admittedOnly ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
              <label className="text-sm text-gray-600 flex items-center gap-1.5 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"></path>
                  <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
                  <path d="M12 4v6"></path>
                  <path d="M2 18h20"></path>
                </svg>
                Admitted Patients Only
              </label>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50" 
              title="Enter full screen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" x2="14" y1="3" y2="10"></line>
                <line x1="3" x2="10" y1="21" y2="14"></line>
              </svg>
            </button>
            <button 
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50" 
              title="Close panel"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <AGGridTable
              tasks={tasks}
              columns={columns}
              onReply={onReply}
              onComplete={onComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};