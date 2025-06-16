import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { AGGridTable } from "./AGGridTable"; // Import the real AG-Grid component

// Extended task interface with index signature for dynamic properties
interface ExtendedTask {
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

// API Column interface
interface ApiColumn {
  key: string;
  label: string;
}

// Interface for reminders/tasks API response
interface TasksApiResponse {
  data: any[];
  pagination?: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

// Slide-out Panel Component - NO TRANSITIONS
export const TaskSlidePanel: React.FC<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isVisible: boolean;
  onClose: () => void;
  title: string;
  cardType?: string; // Add cardType to identify which card was clicked
}> = ({
  tasks: initialTasks,
  columns: initialColumns,
  onReply,
  onComplete,
  isVisible,
  onClose,
  title,
  cardType,
}) => {
  const [admittedOnly, setAdmittedOnly] = useState(false);
  const [panelWidth, setPanelWidth] = useState(1201.2);
  const [isResizing, setIsResizing] = useState(false);
  const [tasks, setTasks] = useState<ExtendedTask[]>(initialTasks);
  const [columns, setColumns] = useState<ApiColumn[]>(initialColumns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fetch reminders/tasks data for "All Reminders" card
  const fetchRemindersData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<TasksApiResponse>("/tasks");

      // Transform response data to ExtendedTask format with flattened nested objects
      const transformedTasks = response.data.data.map(
        (task: any, index: number) => ({
          id: task.id?.toString() || index.toString(),
          title: task.subject || "No Title",
          description: task.message || "No Description",
          assignedTo: task.received_from?.name || "System",
          person: task.patient?.name || "",
          dueDate: task.due_date || "Today",
          priority: task.priority?.toLowerCase() || "medium",
          status: task.status?.toLowerCase() || "pending",
          type: task.type || "Reminder",
          // Flatten nested objects for display
          subject: task.subject,
          message: task.message,
          start_date: task.start_date,
          due_date: task.due_date,
          received_from: task.received_from?.name, // Extract name from object
          patient: task.patient?.name, // Extract name from object
          patient_pid: task.patient?.pid, // Extract pid separately
        })
      );

      setTasks(transformedTasks);

      // Generate columns based on flattened structure
      const columnDefinitions: ApiColumn[] = [
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message" },
        { key: "start_date", label: "Start Date" },
        { key: "due_date", label: "Due Date" },
        { key: "priority", label: "Priority" },
        { key: "status", label: "Status" },
        { key: "type", label: "Type" },
        { key: "received_from", label: "Received From" },
        { key: "patient", label: "Patient" },
        { key: "patient_pid", label: "Patient PID" },
      ];

      setColumns(columnDefinitions);
    } catch (err) {
      console.error("Failed to fetch reminders data:", err);
      setError("Failed to load reminders data");
      setTasks([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle different card types
  useEffect(() => {
    if (isVisible && cardType === "All Reminders") {
      fetchRemindersData();
    } else if (isVisible) {
      // For other card types, use the passed tasks and columns
      setTasks(initialTasks);
      setColumns(initialColumns);
    }
  }, [isVisible, cardType, initialTasks, initialColumns]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

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
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!isVisible) return null;

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop - no transition */}
      <div className="flex-1" onClick={onClose} />

      {/* Panel - no transition */}
      <div
        className="bg-white border-l shadow-lg relative flex flex-col"
        style={{
          width: isFullScreen ? "100vw" : `${panelWidth}px`,
          minWidth: isFullScreen ? "100vw" : "514.8px",
          maxWidth: isFullScreen ? "100vw" : "90vw",
        }}
      >
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-6 cursor-ew-resize hover:bg-blue-200/20 group z-20"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gray-400"
            >
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
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 border border-gray-200 hover:bg-gray-50 text-xs font-normal text-gray-600 bg-gray-50">
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
                className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-200 ease-in-out ${
                  admittedOnly ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    admittedOnly ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <label className="text-sm text-gray-600 flex items-center gap-1.5 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
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
              onClick={handleFullScreen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Loading {title.toLowerCase()}...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between w-full max-w-md">
                <span>{error}</span>
                <button
                  onClick={() => {
                    if (cardType === "All Reminders") {
                      fetchRemindersData();
                    }
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <AGGridTable
                tasks={tasks}
                columns={columns}
                onReply={onReply}
                onComplete={onComplete}
                activeTab={
                  cardType === "All Reminders" ? "reminders" : "birthdays"
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskSlidePanel;
