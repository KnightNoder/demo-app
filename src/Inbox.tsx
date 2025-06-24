import { useState, useEffect, useCallback, useRef } from "react";
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader";
import { TaskSlidePanel } from "./Inbox/components/organisms/TaskSlidePanel";
import {
  ApiColumn,
  ExtendedTask,
  TaskManagementContainer,
} from "./Inbox/components/organisms/TaskManagementContainer";
import axiosClient from "./api/axiosClient";
import FilterPopup, {
  FilterState,
} from "./Inbox/components/organisms/FilterPopup";
import SortPopup, { SortOption } from "./Inbox/components/organisms/SortPopup";
import PrioritySwimLanes from "./Inbox/components/organisms/PrioritySwimLanes";
import { getTaskCardsConfig } from "./Inbox/components/molecules/taskCardConfig";
import { InboxService } from "./Inbox/services/inboxService";
import { BirthdayApiResponse } from "./types";
import NewTaskModal, {
  TaskFormData,
} from "./Inbox/components/organisms/NewTaskModal";

interface UrgentTaskCountApiResponse {
  success: boolean;
  data: {
    high: number;
    medium: number;
    low: number;
  };
}

// Interface for agenda/appointments data from API
interface AgendaData {
  pc_eid: number;
  pc_eventDate: string;
  formatted_start_time: string;
  formatted_end_time: string;
  appointment_type: string;
  recurrence_type: string;
  patient_name: string;
  provider: string;
  category: string;
  facility: string;
}

// Interface for agenda API response
interface AgendaApiResponse {
  columns: ApiColumn[];
  data: AgendaData[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
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

// Polling status type
type PollingStatus = "active" | "paused" | "error" | "idle";

const Inbox = () => {
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
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

  // New Task Modal state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Polling state
  const [isPolling, setIsPolling] = useState(true);
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds default
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);
  const [isIntervalDropdownOpen, setIsIntervalDropdownOpen] = useState(false);

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    low: false,
    medium: false,
    high: false,
    customOnly: false,
    defaultOnly: false,
  });
  const [filterButtonPosition, setFilterButtonPosition] = useState({
    top: 0,
    right: 0,
  });

  // Sort state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>(
    "priority-high-to-low"
  );
  const [sortButtonPosition, setSortButtonPosition] = useState({
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

  // Fetch birthday data from API to get count
  const fetchBirthdayCount = async () => {
    try {
      const response = await axiosClient.get<BirthdayApiResponse>(
        "/inbox/birthdays",
        {
          params: {
            per_page: 1,
          },
        }
      );
      setBirthdayCount(response.data.pagination.total);
      return response.data.pagination.total;
    } catch (err) {
      console.error("Failed to fetch birthday count:", err);
      throw err;
    }
  };

  // Fetch agenda data from API to get count
  const fetchAgendaCount = async () => {
    try {
      const response = await axiosClient.get<AgendaApiResponse>(
        "/inbox/upcoming-appointments"
      );
      setAgendaCount(response.data.data.length);
      return response.data.data.length;
    } catch (err) {
      console.error("Failed to fetch agenda count:", err);
      throw err;
    }
  };

  // Fetch urgent task counts
  const fetchUrgentTaskCounts = async () => {
    try {
      const response =
        await axiosClient.get<UrgentTaskCountApiResponse>("/tasks/summary");
      setUrgentTaskCounts(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch urgent task counts:", err);
      throw err;
    }
  };

  // Unified data fetching function for polling
  const fetchAllData = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
          setPollingStatus("idle");
        } else {
          setPollingStatus("active");
        }

        setPollingError(null);

        const results = await Promise.allSettled([
          fetchBirthdayCount(),
          fetchUrgentTaskCounts(),
          fetchAgendaCount(),
        ]);

        // Check if any promises failed
        const hasError = results.some((result) => result.status === "rejected");

        if (hasError && !isInitialLoad) {
          const errors = results
            .filter((result) => result.status === "rejected")
            .map((result) => (result as PromiseRejectedResult).reason);

          setPollingError(`Failed to update: ${errors.length} API(s) failed`);
          setPollingStatus("error");
        } else {
          setPollingStatus(isPolling ? "active" : "paused");
          setLastUpdated(new Date());
          if (isInitialLoad) {
            setError(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (isInitialLoad) {
          setError("Failed to load data");
        } else {
          setPollingError("Failed to update data");
          setPollingStatus("error");
        }
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [isPolling]
  );

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isPolling) {
        fetchAllData(false);
      }
    }, pollingInterval);
  }, [fetchAllData, pollingInterval, isPolling]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Toggle polling
  const togglePolling = () => {
    setIsPolling((prev) => {
      const newPollingState = !prev;
      if (newPollingState) {
        setPollingStatus("active");
        // Immediately fetch data when resuming
        fetchAllData(false);
      } else {
        setPollingStatus("paused");
      }
      return newPollingState;
    });
  };

  // Manual refresh
  const handleManualRefresh = () => {
    fetchAllData(false);
  };

  // Initialize data and polling
  useEffect(() => {
    fetchAllData(true);
  }, []);

  // Setup polling when isPolling changes
  useEffect(() => {
    if (isPolling) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [isPolling, startPolling, stopPolling]);

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isIntervalDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".relative")) {
          setIsIntervalDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isIntervalDropdownOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // Check all containers when panel width changes or when data loads
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Checking scrollability for all lanes...");
      swimLanes.forEach((lane) => {
        checkScrollable(lane.priority);
      });
      console.log("Scrollable containers:", Array.from(scrollableContainers));
    }, 200);

    return () => clearTimeout(timer);
  }, [
    panelWidth,
    isPanelVisible,
    urgentTaskCounts,
    birthdayCount,
    agendaCount,
  ]);

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
  const taskCards: TaskCardConfig[] = getTaskCardsConfig(
    urgentTaskCounts,
    birthdayCount,
    agendaCount
  );

  // Fetch full agenda data for slide panel
  const fetchAgendaDataForPanel = async () => {
    try {
      const { tasks, columns } = await InboxService.fetchAgendaDataForPanel();
      setSelectedCardTasks(tasks);
      setSelectedCardColumns(columns);
      setSelectedCardTitle("Agenda");
      setIsPanelVisible(true);
    } catch (err) {
      setError("Failed to load agenda data");
    }
  };

  // Fetch full birthday data for slide panel
  const fetchBirthdayDataForPanel = async () => {
    try {
      const { tasks, columns } = await InboxService.fetchBirthdayDataForPanel();
      setSelectedCardTasks(tasks);
      setSelectedCardColumns(columns);
      setSelectedCardTitle("Birthdays");
      setIsPanelVisible(true);
    } catch (err) {
      setError("Failed to load birthday data");
    }
  };

  // Fetch urgent tasks data for slide panel
  const fetchUrgentTasksDataForPanel = async (
    priority: "high" | "medium" | "low"
  ) => {
    try {
      const { tasks, columns, title } =
        await InboxService.fetchUrgentTasksDataForPanel(priority);
      setSelectedCardTasks(tasks);
      setSelectedCardColumns(columns);
      setSelectedCardTitle(title);
      setIsPanelVisible(true);
    } catch (err) {
      setError("Failed to load urgent tasks data");
    }
  };

  const handleCardClick = async (
    cardType: string,
    cardConfig?: TaskCardConfig
  ) => {
    console.log(`${cardType} ${cardConfig} card clicked`);

    if (cardType === "Birthdays") {
      await fetchBirthdayDataForPanel();
    } else if (cardType === "Agenda" || cardType === "Upcoming Appointments") {
      await fetchAgendaDataForPanel();
    } else if (cardType === "Urgent Tasks" && cardConfig) {
      console.log(cardConfig.priority, "cardConfig.priority");
      await fetchUrgentTasksDataForPanel(
        cardConfig.priority as "high" | "medium" | "low"
      );
    } else if (cardType === "All Reminders") {
      setSelectedCardTasks([]);
      setSelectedCardColumns([]);
      setSelectedCardTitle(cardType);
      setIsPanelVisible(true);
    } else {
      setSelectedCardTasks([]);
      setSelectedCardColumns([]);
      setSelectedCardTitle(cardType);
      setIsPanelVisible(true);
    }
  };

  // Updated handleNewTask to open modal
  const handleNewTask = () => {
    console.log("New task clicked - opening modal");
    setIsNewTaskModalOpen(true);
  };

  // Handle new task form submission
  const handleNewTaskSubmit = async (taskData: TaskFormData) => {
    console.log("New task submitted:", taskData);

    try {
      // Here you would typically make an API call to create the task
      // const response = await axiosClient.post("/tasks", taskData);

      // For now, just log the data and refresh the counts
      console.log("Task created successfully:", taskData);

      // Refresh data to reflect the new task
      await fetchAllData(false);

      // Close the modal
      setIsNewTaskModalOpen(false);

      // Optionally show a success message
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to create task:", err);
      // Handle error - could show error message to user
      setError("Failed to create task");
    }
  };

  // Handle modal close
  const handleNewTaskModalClose = () => {
    setIsNewTaskModalOpen(false);
  };

  // Generic function to get button position
  const getButtonPosition = (
    buttonElementOrEvent?: HTMLElement | React.MouseEvent | Event
  ) => {
    if (buttonElementOrEvent) {
      let element: HTMLElement | null = null;

      if (
        buttonElementOrEvent instanceof Event ||
        "currentTarget" in buttonElementOrEvent
      ) {
        element = (buttonElementOrEvent as any).currentTarget as HTMLElement;
      } else if (
        buttonElementOrEvent &&
        "getBoundingClientRect" in buttonElementOrEvent
      ) {
        element = buttonElementOrEvent as HTMLElement;
      }

      if (element && typeof element.getBoundingClientRect === "function") {
        try {
          const rect = element.getBoundingClientRect();
          return {
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
          };
        } catch (error) {
          console.warn("Could not get button position:", error);
        }
      }
    }

    return { top: 60, right: 20 };
  };

  const handleFilter = (
    buttonElementOrEvent?: HTMLElement | React.MouseEvent | Event
  ) => {
    if (buttonElementOrEvent && !isFilterOpen) {
      const position = getButtonPosition(buttonElementOrEvent);
      setFilterButtonPosition(position);
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filterType: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleSort = (
    buttonElementOrEvent?: HTMLElement | React.MouseEvent | Event
  ) => {
    if (buttonElementOrEvent && !isSortOpen) {
      const position = getButtonPosition(buttonElementOrEvent);
      setSortButtonPosition(position);
    }
    setIsSortOpen(!isSortOpen);
  };

  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    setIsSortOpen(false);
    console.log("Sort changed to:", sortOption);
  };

  const handleSortClose = () => {
    setIsSortOpen(false);
  };

  // Sorting function for cards
  const sortCards = (cards: TaskCardConfig[]): TaskCardConfig[] => {
    const sortedCards = [...cards];

    switch (currentSort) {
      case "priority-high-to-low":
        return sortedCards.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1, other: 0 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

      case "priority-low-to-high":
        return sortedCards.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1, other: 0 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

      case "count-high-to-low":
        return sortedCards.sort((a, b) => b.count - a.count);

      case "count-low-to-high":
        return sortedCards.sort((a, b) => a.count - b.count);

      case "label-a-to-z":
        return sortedCards.sort((a, b) => a.title.localeCompare(b.title));

      case "label-z-to-a":
        return sortedCards.sort((a, b) => b.title.localeCompare(a.title));

      default:
        return sortedCards;
    }
  };

  // Filter cards based on selected filters
  const getFilteredCardsByPriority = (priority: string) => {
    let cards = getCardsByPriority(priority);

    if (filters.low || filters.medium || filters.high) {
      cards = cards.filter((card) => {
        const count = card.count;
        if (filters.low && count >= 0 && count <= 5) return true;
        if (filters.medium && count >= 6 && count <= 10) return true;
        if (filters.high && count >= 11) return true;
        return false;
      });
    }

    if (filters.customOnly) {
      cards = cards.filter((card) => card.id.includes("custom"));
    }

    if (filters.defaultOnly) {
      cards = cards.filter((card) => !card.id.includes("custom"));
    }

    return sortCards(cards);
  };

  const handleReply = (taskId: string) => {
    console.log("Reply to task:", taskId);
  };

  const handleComplete = (taskId: string) => {
    console.log("Complete task:", taskId);
    // Refresh counts after completing a task
    fetchAllData(false);
  };

  const handleRefresh = () => {
    fetchAllData(false);
  };

  // Get cards by priority
  const getCardsByPriority = (priority: string) => {
    return taskCards
      .filter((card) => card.priority === priority)
      .map((card) => {
        if (card.id === "birthdays") {
          return { ...card, count: birthdayCount };
        }

        if (card.id === "agenda" || card.id === "upcoming-appointments") {
          return { ...card, count: agendaCount };
        }

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
              count = card.count;
          }
          return { ...card, count };
        }

        return card;
      });
  };

  // Priority swim lane configuration with filtered and sorted cards
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
      color: "yellow",
      dotColor: "bg-yellow-500",
      textColor: "text-yellow-500",
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

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get interval display text
  const getIntervalText = (interval: number) => {
    switch (interval) {
      case 10000:
        return "10s";
      case 30000:
        return "30s";
      case 60000:
        return "1m";
      case 300000:
        return "5m";
      default:
        return "30s";
    }
  };

  // Handle interval change
  const handleIntervalChange = (newInterval: number) => {
    setPollingInterval(newInterval);
    setIsIntervalDropdownOpen(false);
  };

  // Get status display info
  const getStatusInfo = () => {
    switch (pollingStatus) {
      case "active":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: "🔄",
          text: "Auto-refreshing",
        };
      case "paused":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: "⏸️",
          text: "Paused",
        };
      case "error":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: "❌",
          text: "Error",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: "⏹️",
          text: "Idle",
        };
    }
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

  const statusInfo = getStatusInfo();

  return (
    <div className="flex h-full bg-[#f4f5fb] text-[#020817]">
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

        {/* Polling Status Bar */}
        <div className="px-4 mb-4">
          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{statusInfo.icon}</span>
              <div>
                <span className={`font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
                {lastUpdated && (
                  <span className="text-sm text-gray-500 ml-2">
                    Last updated: {formatTime(lastUpdated)}
                  </span>
                )}
                {pollingError && (
                  <div className="text-sm text-red-600 mt-1">
                    {pollingError}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Polling interval dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsIntervalDropdownOpen(!isIntervalDropdownOpen)
                  }
                  disabled={pollingStatus === "active"}
                  className="flex items-center space-x-1 px-3 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Change polling interval"
                >
                  <span>⏱️ {getIntervalText(pollingInterval)}</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${isIntervalDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isIntervalDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-gray-300 rounded shadow-lg z-50">
                    {[
                      { value: 10000, label: "10s" },
                      { value: 30000, label: "30s" },
                      { value: 60000, label: "1m" },
                      { value: 300000, label: "5m" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleIntervalChange(option.value)}
                        className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-100 transition-colors ${
                          pollingInterval === option.value
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual refresh button */}
              <button
                onClick={handleManualRefresh}
                disabled={pollingStatus === "active"}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Manual refresh"
              >
                🔄 Refresh
              </button>

              {/* Pause/Resume button */}
              <button
                onClick={togglePolling}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  isPolling
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isPolling ? "⏸️ Pause" : "▶️ Resume"}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Popup */}
        <FilterPopup
          isOpen={isFilterOpen}
          position={filterButtonPosition}
          filters={filters}
          onClose={handleFilterClose}
          onFilterChange={handleFilterChange}
        />

        {/* Sort Popup */}
        <SortPopup
          isOpen={isSortOpen}
          position={sortButtonPosition}
          currentSort={currentSort}
          onClose={handleSortClose}
          onSortChange={handleSortChange}
        />

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
        <PrioritySwimLanes
          swimLanes={swimLanes}
          onCardClick={handleCardClick}
          scrollableContainers={scrollableContainers}
        />

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

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={handleNewTaskModalClose}
        onSubmit={handleNewTaskSubmit}
      />
    </div>
  );
};

export default Inbox;
