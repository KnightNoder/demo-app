import { useState, useEffect } from "react";
import { PlayIcon } from "./Inbox/components/assets/Icons";
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader";
import { TaskSlidePanel } from "./Inbox/components/organisms/TaskSlidePanel";
import {
  ExtendedTask,
  TaskManagementContainer,
} from "./Inbox/components/organisms/TaskManagementContainer";
import axiosClient from "./api/axiosClient";

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

// Interface for column definition from API
export interface ApiColumn {
  key: string;
  label: string;
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

interface UrgentTaskCountApiResponse {
  success: boolean;
  data: {
    high: number;
    medium: number;
    low: number;
  };
}

// Task card configuration
interface TaskCardConfig {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  variant: "urgent" | "normal";
  priority: "high" | "medium" | "low" | "other";
  testId: string;
}

// Function to capitalize first letter of each word
const capitalizeLabel = (label: string): string => {
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Inbox = () => {
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [urgentTaskCounts, setUrgentTaskCounts] = useState({
    high: 0,
    medium: 0,
    low: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardTasks, setSelectedCardTasks] = useState<ExtendedTask[]>(
    []
  );
  const [selectedCardColumns, setSelectedCardColumns] = useState<ApiColumn[]>(
    []
  );
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [selectedCardTitle, setSelectedCardTitle] = useState("");
  const [panelWidth, setPanelWidth] = useState(1201.2);
  const [scrollableContainers, setScrollableContainers] = useState<Set<string>>(
    new Set()
  );

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    low: false, // 0-5 items
    medium: false, // 6-10 items
    high: false, // 11+ items
    customOnly: false,
    defaultOnly: false,
  });
  const [filterButtonPosition, setFilterButtonPosition] = useState({
    top: 0,
    right: 0,
  });

  // Function to check if container is scrollable
  const checkScrollable = (containerId: string) => {
    const container = document.querySelector(
      `[data-swim-lane="${containerId}"] .overflow-x-auto`
    );
    if (container) {
      const isScrollable = container.scrollWidth > container.clientWidth;
      console.log(
        `Lane ${containerId}: scrollWidth=${container.scrollWidth}, clientWidth=${container.clientWidth}, isScrollable=${isScrollable}`
      );
      setScrollableContainers((prev) => {
        const newSet = new Set(prev);
        if (isScrollable) {
          newSet.add(containerId);
        } else {
          newSet.delete(containerId);
        }
        return newSet;
      });
    }
  };

  // Check all containers when panel width changes or when data loads
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Checking scrollability for all lanes...");
      swimLanes.forEach((lane) => {
        checkScrollable(lane.priority);
      });
      console.log("Scrollable containers:", Array.from(scrollableContainers));
    }, 200); // Increased timeout to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [panelWidth, isPanelVisible, urgentTaskCounts, birthdayCount]);

  // Add resize observer to check scrollability when window resizes
  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized, rechecking scrollability...");
      setTimeout(() => {
        swimLanes.forEach((lane) => {
          checkScrollable(lane.priority);
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Task cards configuration
  const taskCards: TaskCardConfig[] = [
    // High Priority
    {
      id: "urgent-tasks",
      title: "Urgent Tasks",
      count: urgentTaskCounts.high,
      icon: <PlayIcon />,
      variant: "urgent",
      priority: "high",
      testId: "task-block-expedite-queue",
    },
    {
      id: "review-forms-high",
      title: "Review Forms",
      count: 8,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      variant: "normal",
      priority: "high",
      testId: "task-block-needs-review",
    },
    {
      id: "review-prescriptions",
      title: "Review Prescriptions",
      count: 7,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "high",
      testId: "task-block-prescriptions",
    },
    {
      id: "pending-too-long",
      title: "Pending Too Long",
      count: 2,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "high",
      testId: "task-block-aging-tasks",
    },
    {
      id: "treatment-reviews",
      title: "Treatment Reviews",
      count: 0,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "high",
      testId: "task-block-treatment-reviews",
    },
    // Medium Priority
    {
      id: "urgent-tasks",
      title: "Urgent Tasks",
      count: urgentTaskCounts.medium,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "medium",
      testId: "task-block-expedite-queue",
    },
    {
      id: "review-forms-medium",
      title: "Review Forms",
      count: 12,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      variant: "normal",
      priority: "medium",
      testId: "task-block-needs-review-medium",
    },
    {
      id: "all-reminders",
      title: "All Reminders",
      count:
        urgentTaskCounts.high + urgentTaskCounts.medium + urgentTaskCounts.low,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "medium",
      testId: "task-block-suggested-actions",
    },
    {
      id: "assigned-to-me",
      title: "Assigned to Me",
      count: 0,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      variant: "normal",
      priority: "medium",
      testId: "task-block-assigned-to-me",
    },
    {
      id: "tasks-created-by-me",
      title: "Tasks Created by Me",
      count: 0,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "medium",
      testId: "task-block-created-by-me",
    },
    // Low Priority
    {
      id: "urgent-tasks",
      title: "Urgent Tasks",
      count: urgentTaskCounts.low,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "low",
      testId: "task-block-expedite-queue",
    },
    {
      id: "birthdays",
      title: "Birthdays",
      count: birthdayCount,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "low",
      testId: "task-block-fyi-zone",
    },
    // Everything Else
    {
      id: "messages",
      title: "Messages",
      count: 12,
      icon: <PlayIcon />,
      variant: "normal",
      priority: "other",
      testId: "task-block-messages",
    },
    {
      id: "agenda",
      title: "Agenda",
      count: 5,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      variant: "normal",
      priority: "other",
      testId: "task-block-agenda",
    },
  ];

  // Fetch birthday data from API to get count
  const fetchBirthdayCount = async () => {
    try {
      const response = await axiosClient.get<BirthdayApiResponse>(
        "/inbox/birthdays",
        {
          params: {
            per_page: 1, // Just need one record to get the total count
          },
        }
      );

      setBirthdayCount(response.data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch birthday count:", err);
      setError("Failed to load birthday count");
    }
  };

  // Fetch full birthday data for slide panel
  const fetchBirthdayDataForPanel = async () => {
    try {
      const response = await axiosClient.get<BirthdayApiResponse>(
        "/inbox/birthdays",
        {
          params: {
            per_page: 1000, // Get all birthday records
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

      // Use columns from API response with capitalized labels
      const capitalizedColumns = response.data.columns.map((column) => ({
        ...column,
        label: capitalizeLabel(column.label),
      }));

      setSelectedCardTasks(transformedTasks);
      setSelectedCardColumns(capitalizedColumns);
      setSelectedCardTitle("Birthdays");
      setIsPanelVisible(true);
    } catch (err) {
      console.error("Failed to fetch birthday data for panel:", err);
      setError("Failed to load birthday data");
    }
  };

  const fetchUrgentTaskCounts = async () => {
    try {
      const response = await axiosClient.get<UrgentTaskCountApiResponse>(
        "/tasks/priority-summary"
      );
      setUrgentTaskCounts(response.data.data);
    } catch (err) {
      console.error("Failed to fetch urgent task counts:", err);
      setError("Failed to load urgent task counts");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Promise.all to fetch both API calls concurrently
        await Promise.all([fetchBirthdayCount(), fetchUrgentTaskCounts()]);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Add this function in the Inbox component after fetchBirthdayDataForPanel

  // Fetch urgent tasks data for slide panel
  const fetchUrgentTasksDataForPanel = async (
    priority: "high" | "medium" | "low"
  ) => {
    try {
      const priorityMap = {
        high: 1,
        medium: 2,
        low: 3,
      };

      const response = await axiosClient.get<TasksApiResponse>("/tasks", {
        params: {
          priority: priorityMap[priority],
        },
      });

      // Transform response data to ExtendedTask format with flattened nested objects
      const transformedTasks = response.data.data.map(
        (task: any, index: number) => ({
          id: task.id?.toString() || index.toString(),
          title: task.subject || "No Title",
          description: task.message || "No Description",
          assignedTo: task.received_from?.name || "System",
          person: task.patient?.name || "",
          dueDate: task.due_date || "Today",
          priority: task.priority?.toLowerCase() || priority,
          status: task.status?.toLowerCase() || "pending",
          type: task.type || "Reminder",
          // Flatten nested objects for display
          subject: task.subject,
          message: task.message,
          start_date: task.start_date,
          due_date: task.due_date,
          received_from: task.received_from?.name,
          patient: task.patient?.name,
          patient_pid: task.patient?.pid,
        })
      );

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

      setSelectedCardTasks(transformedTasks);
      setSelectedCardColumns(columnDefinitions);
      setSelectedCardTitle(
        `Urgent Tasks - ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`
      );
      setIsPanelVisible(true);
    } catch (err) {
      console.error("Failed to fetch urgent tasks data for panel:", err);
      setError("Failed to load urgent tasks data");
    }
  };

  // Add TasksApiResponse interface if not already defined
  interface TasksApiResponse {
    data: any[];
  }

  const handleCardClick = async (
    cardType: string,
    cardConfig?: TaskCardConfig
  ) => {
    console.log(`${cardType} ${cardConfig} card clicked`);

    if (cardType === "Birthdays") {
      // Fetch full birthday data and show in slide panel
      await fetchBirthdayDataForPanel();
    } else if (cardType === "Urgent Tasks" && cardConfig) {
      // Fetch urgent tasks data based on priority
      console.log(cardConfig.priority, "cardConfig.priority");
      await fetchUrgentTasksDataForPanel(
        cardConfig.priority as "high" | "medium" | "low"
      );
    } else if (cardType === "All Reminders") {
      // For All Reminders, let TaskSlidePanel handle the API call
      setSelectedCardTasks([]);
      setSelectedCardColumns([]);
      setSelectedCardTitle(cardType);
      setIsPanelVisible(true);
    } else {
      // For other cards, use mock data
      setSelectedCardTasks(mockTasks);
      setSelectedCardColumns(mockColumns);
      setSelectedCardTitle(cardType);
      setIsPanelVisible(true);
    }
  };

  const handleNewTask = () => {
    console.log("New task clicked");
  };

  const handleFilter = (buttonElement?: HTMLElement) => {
    if (buttonElement && !isFilterOpen) {
      // Get the button's position relative to viewport
      const rect = buttonElement.getBoundingClientRect();
      setFilterButtonPosition({
        top: rect.bottom + 8, // 8px below the button
        right: window.innerWidth - rect.right, // Distance from right edge
      });
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filterType: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  // Filter cards based on selected filters
  const getFilteredCardsByPriority = (priority: string) => {
    let cards = getCardsByPriority(priority);

    // Apply count-based filters
    if (filters.low || filters.medium || filters.high) {
      cards = cards.filter((card) => {
        const count = card.count;
        if (filters.low && count >= 0 && count <= 5) return true;
        if (filters.medium && count >= 6 && count <= 10) return true;
        if (filters.high && count >= 11) return true;
        return false;
      });
    }

    // Apply type-based filters (placeholder for now - you can expand this)
    if (filters.customOnly) {
      // Add logic for custom cards if needed
      cards = cards.filter((card) => card.id.includes("custom"));
    }

    if (filters.defaultOnly) {
      // Add logic for default cards if needed
      cards = cards.filter((card) => !card.id.includes("custom"));
    }

    return cards;
  };

  const handleSort = () => {
    console.log("Sort clicked");
  };

  const handleReply = (taskId: string) => {
    console.log("Reply to task:", taskId);
  };

  const handleComplete = (taskId: string) => {
    console.log("Complete task:", taskId);
    // Optionally refresh data after completing a task
    fetchBirthdayCount();
  };

  const handleRefresh = () => {
    Promise.all([fetchBirthdayCount(), fetchUrgentTaskCounts()]).catch(
      (err) => {
        console.error("Failed to refresh data:", err);
        setError("Failed to refresh data");
      }
    );
  };

  // Get cards by priority
  const getCardsByPriority = (priority: string) => {
    return taskCards
      .filter((card) => card.priority === priority)
      .map((card) => {
        // Update birthday count dynamically
        if (card.id === "birthdays") {
          return { ...card, count: birthdayCount };
        }

        // Update urgent task counts dynamically based on priority
        if (card.title === "Urgent Tasks") {
          let count = 0;
          switch (priority) {
            case "high":
              count = urgentTaskCounts.high;
              break;
            case "medium":
              count = urgentTaskCounts.medium;
              break;
            case "low":
              count = urgentTaskCounts.low;
              break;
            default:
              count = card.count; // fallback to original count
          }
          return { ...card, count };
        }

        return card;
      });
  };

  const mockColumns: ApiColumn[] = [
    { key: "title", label: "Subject" },
    { key: "description", label: "Message" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due" },
    { key: "status", label: "Status" },
    { key: "assignedTo", label: "Received from" },
    { key: "person", label: "Person" },
  ];

  const mockTasks: ExtendedTask[] = [
    {
      id: "1",
      title: "Crisis intervention plan review",
      description: "Crisis intervention plan",
      assignedTo: "Lisa Thompson",
      person: "Lisa Thompson",
      dueDate: "Today",
      priority: "high",
      status: "pending",
      type: "Treatment",
    },
    {
      id: "2",
      title: "Reminder: Check in with high-risk patient",
      description: "High-risk patient check-in",
      assignedTo: "System",
      person: "",
      dueDate: "Today",
      priority: "high",
      status: "pending",
      type: "Reminder",
    },
    {
      id: "3",
      title: "High risk assessment for Kevin L.",
      description: "High risk assessment",
      assignedTo: "System",
      person: "",
      dueDate: "Today",
      priority: "high",
      status: "pending",
      type: "Assessment",
    },
    {
      id: "4",
      title: "DrFirst: Controlled substance monitoring alert",
      description: "Controlled substance monitoring alert",
      assignedTo: "System",
      person: "",
      dueDate: "Today",
      priority: "high",
      status: "pending",
      type: "Dr First Notifications",
    },
    {
      id: "5",
      title: "Document crisis intervention",
      description: "Document crisis intervention",
      assignedTo: "System",
      person: "",
      dueDate: "Today",
      priority: "high",
      status: "pending",
      type: "Clinical",
    },
  ];

  // Priority swim lane configuration with filtered cards
  const swimLanes = [
    {
      priority: "high",
      title: "High Priority",
      color: "red",
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      cards: getFilteredCardsByPriority("high"),
    },
    {
      priority: "medium",
      title: "Medium Priority",
      color: "amber",
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      cards: getFilteredCardsByPriority("medium"),
    },
    {
      priority: "low",
      title: "Low Priority",
      color: "green",
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      cards: getFilteredCardsByPriority("low"),
    },
    {
      priority: "other",
      title: "Everything Else",
      color: "blue",
      dotColor: "bg-blue-500",
      textColor: "text-blue-700",
      cards: getFilteredCardsByPriority("other"),
    },
  ];

  const handleClosePanel = () => {
    setIsPanelVisible(false);
  };

  const handlePanelWidthChange = (newWidth: number) => {
    setPanelWidth(newWidth);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#f4f5fb] text-[#020817] flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Fetching your Inbox messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f5fb] text-[#020817]">
      {/* Main Inbox Content */}
      <div
        className="flex-1 overflow-auto transition-all duration-300 ease-in-out"
        style={{
          width: isPanelVisible ? `calc(100% - ${panelWidth}px)` : "100%",
          maxWidth: isPanelVisible ? `calc(100% - ${panelWidth}px)` : "100%",
        }}
      >
        <TaskHeader
          onNewTask={handleNewTask}
          onFilter={handleFilter}
          onSort={handleSort}
        />

        {/* Filter Popup */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="fixed z-50 overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 min-w-[12rem]"
              style={{
                top: `${filterButtonPosition.top}px`,
                right: `${filterButtonPosition.right}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2 py-1.5 text-sm font-semibold">
                Filter by:
              </div>

              {/* Count-based filters */}
              <div
                role="menuitemcheckbox"
                aria-checked={filters.low}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => handleFilterChange("low")}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {filters.low && (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                Low (0-5)
              </div>

              <div
                role="menuitemcheckbox"
                aria-checked={filters.medium}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => handleFilterChange("medium")}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {filters.medium && (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                Medium (6-10)
              </div>

              <div
                role="menuitemcheckbox"
                aria-checked={filters.high}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => handleFilterChange("high")}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {filters.high && (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                High (11+)
              </div>

              {/* Separator */}
              <div
                role="separator"
                className="-mx-1 my-1 h-px bg-gray-200"
              ></div>

              {/* Type-based filters */}
              <div
                role="menuitemcheckbox"
                aria-checked={filters.customOnly}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => handleFilterChange("customOnly")}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {filters.customOnly && (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                Custom only
              </div>

              <div
                role="menuitemcheckbox"
                aria-checked={filters.defaultOnly}
                className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
                onClick={() => handleFilterChange("defaultOnly")}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {filters.defaultOnly && (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                Default only
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-full px-4 mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRefresh}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Priority Swim Lanes */}
        <div className="space-y-2 md:space-y-4 px-4">
          {swimLanes.map((lane) => (
            <div key={lane.priority}>
              <h3
                className={`text-base font-medium ${lane.textColor} mb-1 flex items-center gap-2 px-2 md:px-0`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${lane.dotColor}`}
                  ></div>
                  {lane.title}
                </div>
                <span className="text-sm text-gray-500">
                  ({lane.cards.length} items)
                </span>
              </h3>
              <div className="relative group">
                <div className="absolute inset-0 pointer-events-none"></div>
                <div className="overflow-x-auto scrollbar-hide relative">
                  <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 md:gap-4 pb-2 md:pb-4 px-2 pt-2">
                    {lane.cards.map((card) => (
                      <div
                        key={card.id}
                        className="cursor-pointer w-full sm:w-[180px] md:w-[220px] flex-shrink-0 p-0.5"
                      >
                        <div
                          className="relative rounded-xl border-2 border-white ring-2 ring-inset ring-white/80 bg-gradient-to-br from-pink-50 via-blue-50 to-blue-50 hover:scale-[1.03] hover:border-blue-200 hover:z-10 transition-all duration-200 cursor-pointer group p-3 h-full flex flex-col"
                          tabIndex={0}
                          aria-label={card.title}
                          data-testid={card.testId}
                          onClick={() => handleCardClick(card.title, card)}
                        >
                          <div className="absolute inset-0 rounded-xl bg-white/70 pointer-events-none z-0 group-hover:bg-white/80"></div>
                          <div className="flex items-center gap-2 z-10 relative">
                            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                              <div className="text-gray-500">{card.icon}</div>
                            </div>
                            <span className="text-gray-800 font-medium text-sm md:text-xs lg:text-sm text-left line-clamp-2">
                              {card.title}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between items-end z-10 relative">
                            <div>
                              <span
                                className={`text-3xl font-${card.variant === "urgent" ? "bold" : "normal"} ${
                                  card.variant === "urgent"
                                    ? "text-red-600"
                                    : lane.priority === "high"
                                      ? "text-orange-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {card.count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel navigation - fade gradients */}
                <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f4f5fb] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>
                <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f4f5fb] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"></div>

                {/* Carousel navigation - left arrow */}
                <button
                  className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    const container =
                      e.currentTarget.parentElement?.querySelector(
                        ".overflow-x-auto"
                      );
                    if (container) {
                      container.scrollBy({ left: -220, behavior: "smooth" });
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>

                {/* Carousel navigation - right arrow */}
                <button
                  className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all duration-200 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    const container =
                      e.currentTarget.parentElement?.querySelector(
                        ".overflow-x-auto"
                      );
                    if (container) {
                      container.scrollBy({ left: 220, behavior: "smooth" });
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Task Management Container */}
        <div className="w-full bg-[#f4f5fb]">
          <TaskManagementContainer
            onReply={handleReply}
            onComplete={handleComplete}
          />
        </div>
      </div>

      {/* Task Slide Panel */}
      {isPanelVisible && (
        <TaskSlidePanel
          tasks={selectedCardTasks}
          columns={selectedCardColumns}
          onReply={handleReply}
          onComplete={handleComplete}
          isVisible={isPanelVisible}
          onClose={handleClosePanel}
          title={selectedCardTitle}
          cardType={selectedCardTitle}
          onWidthChange={handlePanelWidthChange}
        />
      )}
    </div>
  );
};

export default Inbox;