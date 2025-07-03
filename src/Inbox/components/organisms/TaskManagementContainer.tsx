import React, { useState, useMemo, useEffect, useRef } from "react";
import { TaskTableHeader } from "./TaskTableHeader";
import { AGGridTable } from "./AGGridTable";
import { MobileTaskList } from "./MobileTaskList";
import { useTaskData } from "../../hooks/useTaskData";

// Extended task interface with index signature for dynamic properties
export interface ExtendedTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  person: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "in-progress" | "Read" | "New" | "Done";
  type: string;
  [key: string]: any; // This allows dynamic property access
}

// Import the ApiColumn interface
export interface ApiColumn {
  key: string;
  label: string;
  cellRenderer?: React.ComponentType<any>; // Add cellRenderer support
}

interface TaskManagementContainerProps {
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onTaskClick: (task: ExtendedTask) => void;
}

export const TaskManagementContainer: React.FC<
  TaskManagementContainerProps
> = ({ onReply, onComplete, onTaskClick }) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("reminders"); // Default to reminders
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref for AG Grid to access export functionality
  const gridRef = useRef<any>(null);

  // Use unified data hook
  const {
    tasks,
    columns,
    loading,
    error,
    fetchData,
  } = useTaskData();

  // Fetch data based on active tab (debounced to prevent excessive API calls)
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchTabData = async () => {
        try {
          await fetchData(activeTab as "reminders" | "birthdays" | "agenda" | "messages");
        } catch (err) {
          console.error(`Failed to fetch ${activeTab} data:`, err);
        }
      };

      fetchTabData();
    }, 150); // Debounce to prevent rapid tab switching from causing multiple API calls

    return () => clearTimeout(timer);
  }, [activeTab]); // Removed fetchData dependency to prevent re-fetching

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Dynamic search across all column keys from API
      const searchLower = searchValue.toLowerCase();

      // Search in standard task fields
      const standardFieldsMatch =
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignedTo?.toLowerCase().includes(searchLower) ||
        task.person?.toLowerCase().includes(searchLower);

      // Search in dynamic columns from API
      const dynamicFieldsMatch = columns.some((column) => {
        const fieldValue = task[column.key];
        return (
          fieldValue && String(fieldValue).toLowerCase().includes(searchLower)
        );
      });

      return standardFieldsMatch || dynamicFieldsMatch;
    });
  }, [tasks, searchValue, columns]);

  const handleTaskClick = (task: ExtendedTask) => {
    onTaskClick(task);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchValue(""); // Clear search when switching tabs
  };

  const handleFiltersClick = () => {
    console.log("Filters clicked");
  };

  const handleToggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    if (newExpandedState && containerRef.current) {
      // Optimized scroll behavior to prevent cursor jumps
      const checkAndScroll = () => {
        const container = containerRef.current;
        
        if (container) {
          const containerRect = container.getBoundingClientRect();
          // Only scroll if container is significantly out of view
          const viewportHeight = window.innerHeight;
          const isOutOfView = containerRect.bottom > viewportHeight || containerRect.top < 0;
          
          if (isOutOfView) {
            const scrollOffset = window.pageYOffset + containerRect.top - 80;
            
            window.scrollTo({
              top: Math.max(0, scrollOffset),
              behavior: "smooth",
            });
          }
        }
      };

      // Reduced delay to minimize user perception
      setTimeout(checkAndScroll, 100);
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (gridRef.current && gridRef.current.api) {
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `${activeTab}_${currentDate}.csv`;

      gridRef.current.api.exportDataAsCsv({
        fileName: filename,
        columnSeparator: ",",
        processCellCallback: (params: any) => {
          // Handle nested objects and format data properly
          if (params.value === null || params.value === undefined) {
            return "";
          }
          return String(params.value);
        },
      });
    }
  };

  const retryFetch = () => {
    const fetchTabData = async () => {
      try {
        await fetchData(activeTab as "reminders" | "birthdays" | "agenda" | "messages");
      } catch (err) {
        console.error(`Failed to fetch ${activeTab} data:`, err);
      }
    };

    fetchTabData();
  };

  return (
    <div className="w-full bg-gray-50 p-4">
      <div
        ref={containerRef}
        className="w-full mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-2 animate-scale-in"
      >
        {/* TaskTableHeader should never show loading - it's just UI controls */}
        <TaskTableHeader
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onFiltersClick={handleFiltersClick}
          onExportCSV={handleExportCSV}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
        />

        {/* Show content when expanded - maintain consistent height */}
        {isExpanded && (
          <>
            {/* Error state with consistent height */}
            {error && !loading && (
              <div className="w-full mb-4 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    onClick={retryFetch}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Table container with consistent height */}
            <div className="relative">
              {/* Loading overlay - positioned absolutely to maintain height */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading {activeTab}...</p>
                  </div>
                </div>
              )}

              {/* Table content - always rendered to maintain height */}
              <AGGridTable
                ref={gridRef}
                tasks={filteredTasks}
                columns={columns}
                onReply={onReply}
                onComplete={onComplete}
                onTaskClick={handleTaskClick}
                activeTab={activeTab}
                isPanelReady={true}
                panelWidth={1200}
              />

              <MobileTaskList
                tasks={filteredTasks}
                onReply={onReply}
                onComplete={onComplete}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskManagementContainer;