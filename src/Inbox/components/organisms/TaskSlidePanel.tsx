import React, { useEffect, useState } from "react";
import { AGGridTable } from "./AGGridTable"; // Import the real AG-Grid component
import { MessagesList } from "./MessagesList"; // Import Messages component
import { useTaskData } from "../../hooks/useTaskData";
import { Button } from "../atoms/Button";

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

// Slide-out Panel Component - Modified for dev tools style
export const TaskSlidePanel: React.FC<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isVisible: boolean;
  isLoading?: boolean;
  onClose: () => void;
  title: string;
  cardType?: string;
  onWidthChange?: (width: number) => void;
}> = ({
  tasks: initialTasks,
  columns: initialColumns,
  onReply,
  onComplete,
  isVisible,
  isLoading,
  onClose,
  title,
  cardType,
  onWidthChange,
}) => {
  const [admittedOnly, setAdmittedOnly] = useState(false);
  const [panelWidth, setPanelWidth] = useState(1201.2);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  

  // Use unified data hook for "All Reminders" case
  const {
    tasks: hookTasks,
    columns: hookColumns,
    loading: hookLoading,
    error: hookError,
    fetchData,
  } = useTaskData();


  // Use hook data for "All Reminders", passed data for other cases
  const tasks = cardType === "All Reminders" ? hookTasks : initialTasks;
  const columns = cardType === "All Reminders" ? hookColumns : initialColumns;
  const loading = cardType === "All Reminders" ? hookLoading : false;
  const error = cardType === "All Reminders" ? hookError : null;

  // Function to determine if the current card type represents reminders/urgent tasks
  const isRemindersOrUrgentTasks = (cardType: string) => {
    return (
      cardType === "All Reminders" ||
      cardType?.includes("Urgent Tasks") ||
      cardType?.includes("High Priority") ||
      cardType?.includes("Medium Priority") ||
      cardType?.includes("Low Priority") ||
      // Also check the title for these patterns
      title?.includes("Urgent Tasks") ||
      title?.includes("High Priority") ||
      title?.includes("Medium Priority") ||
      title?.includes("Low Priority")
    );
  };

  // Function to determine the correct activeTab value
  const getActiveTab = () => {
    if (isRemindersOrUrgentTasks(cardType || title)) {
      return "reminders"; // This will trigger the proper styling in AGGridTable
    }
    if (cardType === "Birthdays" || title === "Birthdays") {
      return "birthdays";
    }
    if (cardType === "Agenda" || title === "Agenda") {
      return "agenda";
    }
    if (cardType === "Applicants" || title === "Applicants") {
      return "applicants";
    }
    if (cardType === "Messages" || title === "Messages") {
      return "messages";
    }
    // Default to reminders for any urgent tasks
    return "reminders";
  };

  // Effect to handle different card types
  useEffect(() => {
    if (isVisible && cardType === "All Reminders") {
      fetchData("reminders");
    }
    // For other card types, the passed tasks and columns are used directly
  }, [isVisible, cardType, fetchData]);

  // Update parent component when panel width changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(panelWidth);
    }
  }, [panelWidth, onWidthChange]);

  // Add state to track if panel is fully loaded
  const [isPanelReady, setIsPanelReady] = useState(false);

  // Set panel ready after a small delay to ensure dimensions are stable
  useEffect(() => {
    if (isVisible && !loading && !isLoading) {
      const timer = setTimeout(() => {
        setIsPanelReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsPanelReady(false);
    }
  }, [isVisible, loading, isLoading]);

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

      const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setPanelWidth(calculatedWidth);
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
    const newFullScreen = !isFullScreen;
    setIsFullScreen(newFullScreen);
    if (newFullScreen) {
      setPanelWidth(window.innerWidth);
    } else {
      setPanelWidth(1201.2);
    }
  };

  return (
    <div
      className="bg-white border-l border-gray-200 shadow-lg relative flex flex-col h-screen transition-all duration-300 ease-in-out"
      style={{
        width: isFullScreen ? "100vw" : `${panelWidth}px`,
        minWidth: isFullScreen ? "100vw" : "514.8px",
        maxWidth: isFullScreen ? "100vw" : "50vw justify-right",
      }}
    >
      {/* Resize Handle - only show when not in fullscreen */}
      {!isFullScreen && (
        <div
          className="absolute left-0 top-0 bottom-0 w-6 cursor-ew-resize hover:bg-blue-200/20 group z-20"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-12 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2.5 border border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 border border-gray-200 hover:bg-gray-50 text-xs font-normal text-gray-600 bg-gray-50">
            {tasks.length} {title === "Messages" ? "messages" : "tasks"}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {title === "Messages" ? (
            <div className="flex items-center gap-2">
              <Button size="sm">
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
                  className="w-4 h-4 mr-2"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                New Message
              </Button>
              <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#00b0f0] text-[#00b0f0] shadow-sm hover:bg-[#00b0f0] hover:text-[#f8fafc] h-8 rounded-md px-3 text-xs">
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
                  className="w-4 h-4 mr-2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Inbox Groups
              </button>
            </div>
          ) : (
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
          )}
          <button
            className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-50"
            title={isFullScreen ? "Exit full screen" : "Enter full screen"}
            onClick={handleFullScreen}
          >
            {isFullScreen ? (
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
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" x2="21" y1="10" y2="3"></line>
                <line x1="3" x2="10" y1="21" y2="14"></line>
              </svg>
            ) : (
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
            )}
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
      <div className="flex-1 overflow-hidden p-4">
        {loading || isLoading ? (
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
                    fetchData("reminders");
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full" style={{ opacity: isPanelReady ? 1 : 0 }}>
            {title === "Messages" ? (
              <>
                {(() => {
                  console.log("TaskSlidePanel: Passing to MessagesList - tasks:", tasks);
                  console.log("TaskSlidePanel: Passing to MessagesList - columns:", columns);
                  return null;
                })()}
                <MessagesList
                  messages={tasks}
                  columns={columns}
                  onReply={onReply}
                  onComplete={onComplete}
                  panelWidth={panelWidth}
                />
              </>
            ) : (
              <AGGridTable
                tasks={tasks}
                columns={columns}
                onReply={onReply}
                onComplete={onComplete}
                activeTab={getActiveTab()} // Use the dynamic activeTab function
                isPanelReady={isPanelReady}
                panelWidth={panelWidth}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSlidePanel;