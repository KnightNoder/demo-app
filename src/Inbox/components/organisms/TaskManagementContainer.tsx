import React, { useState, useMemo, useEffect } from "react";
import { TaskTableHeader } from "./TaskTableHeader";
import { AGGridTable } from "./AGGridTable";
import { MobileTaskList } from "./MobileTaskList";
import axiosClient from "../../../api/axiosClient";

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

// Interface for birthday data from API
interface BirthdayData {
  pid: number;
  name: string;
  DOB: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  phone_home: string;
  loc: string | null;
  room: string | null;
}

// Interface for API response
interface BirthdayApiResponse {
  columns: ApiColumn[];
  data: BirthdayData[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

// Interface for reminders/tasks API response
interface TasksApiResponse {
  data: any[];
  // Add other properties as needed based on your API response
}

export interface TaskManagementContainerProps {
  onReply: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

// Function to capitalize first letter of each word
const capitalizeLabel = (label: string): string => {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const TaskManagementContainer: React.FC<
  TaskManagementContainerProps
> = ({ onReply, onComplete }) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("reminders"); // Default to reminders
  const [isExpanded, setIsExpanded] = useState(true);
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [columns, setColumns] = useState<ApiColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reminders/tasks data
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
          // ...task, // Include all original properties, but the flattened ones above will override nested objects
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

  // Fetch birthday data
  const fetchBirthdayData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<BirthdayApiResponse>(
        "/inbox/birthdays",
        {
          params: {
            per_page: 1000,
          },
        }
      );

      // Transform birthday data to task format
      const transformedTasks = response.data.data.map(
        (birthday: BirthdayData) => ({
          id: birthday.pid.toString(),
          title: `Birthday: ${birthday.name}`,
          description: `DOB: ${birthday.DOB}`,
          assignedTo: birthday.name,
          person: birthday.name,
          dueDate: birthday.DOB,
          priority: "medium" as const,
          status: "pending" as const,
          type: "birthday" as const,
          // Include all original birthday data for dynamic column access
          ...birthday,
        })
      );

      setTasks(transformedTasks);

      // Use columns from API response with capitalized labels
      const capitalizedColumns = response.data.columns.map((column) => ({
        ...column,
        label: capitalizeLabel(column.label),
      }));

      setColumns(capitalizedColumns);
    } catch (err) {
      console.error("Failed to fetch birthday data:", err);
      setError("Failed to load birthday data");
      setTasks([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "reminders") {
      fetchRemindersData();
    } else if (activeTab === "birthdays") {
      fetchBirthdayData();
    }
  }, [activeTab]);

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
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 p-4">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p>Loading {activeTab}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 p-4">
      <div className="w-full mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-2 animate-scale-in">
        <TaskTableHeader
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onFiltersClick={handleFiltersClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isExpanded={isExpanded}
          onToggleExpanded={handleToggleExpanded}
        />

        {error && (
          <div className="w-full mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => {
                  if (activeTab === "reminders") {
                    fetchRemindersData();
                  } else {
                    fetchBirthdayData();
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            <AGGridTable
              tasks={filteredTasks}
              columns={columns}
              onReply={onReply}
              onComplete={onComplete}
              activeTab={activeTab}
            />

            <MobileTaskList
              tasks={filteredTasks}
              onReply={onReply}
              onComplete={onComplete}
            />
          </>
        )}
      </div>
    </div>
  );
};
