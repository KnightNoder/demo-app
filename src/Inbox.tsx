import { useState, useEffect } from "react";
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

const Inbox = () => {
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0); // Add agenda count state
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
  const [filters, setFilters] = useState<FilterState>({
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
  ]); // Add agendaCount dependency

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

  // Task cards configuration - now includes agenda count
  const taskCards: TaskCardConfig[] = getTaskCardsConfig(
    urgentTaskCounts,
    birthdayCount,
    agendaCount // Pass agenda count to task cards config
  );

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
    } catch (err) {
      console.error("Failed to fetch birthday count:", err);
      setError("Failed to load birthday count");
    }
  };

  // Fetch agenda data from API to get count
  const fetchAgendaCount = async () => {
    try {
      const response = await axiosClient.get<AgendaApiResponse>(
        "/inbox/upcoming-appointments"
      );

      // Use data.length instead of pagination.total as requested
      setAgendaCount(response.data.data.length);
    } catch (err) {
      console.error("Failed to fetch agenda count:", err);
      setError("Failed to load agenda count");
    }
  };

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

  // Fetch data on component mount - now includes agenda count
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([
          fetchBirthdayCount(),
          fetchUrgentTaskCounts(),
          fetchAgendaCount(), // Add agenda count fetch
        ]);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

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

  const handleNewTask = () => {
    console.log("New task clicked");
  };

  // Generic function to get button position
  const getButtonPosition = (
    buttonElementOrEvent?: HTMLElement | React.MouseEvent | Event
  ) => {
    if (buttonElementOrEvent) {
      let element: HTMLElement | null = null;

      // Handle different types of input
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

      // If we have a valid element, get its position
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

    // Fallback position
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

    // Apply type-based filters
    if (filters.customOnly) {
      cards = cards.filter((card) => card.id.includes("custom"));
    }

    if (filters.defaultOnly) {
      cards = cards.filter((card) => !card.id.includes("custom"));
    }

    // Apply sorting
    return sortCards(cards);
  };

  const handleReply = (taskId: string) => {
    console.log("Reply to task:", taskId);
  };

  const handleComplete = (taskId: string) => {
    console.log("Complete task:", taskId);
    // Refresh counts after completing a task
    fetchBirthdayCount();
    fetchAgendaCount();
  };

  const handleRefresh = () => {
    Promise.all([
      fetchBirthdayCount(),
      fetchUrgentTaskCounts(),
      fetchAgendaCount(), // Include agenda count in refresh
    ]).catch((err) => {
      console.error("Failed to refresh data:", err);
      setError("Failed to refresh data");
    });
  };

  // Get cards by priority - now includes agenda count
  const getCardsByPriority = (priority: string) => {
    return taskCards
      .filter((card) => card.priority === priority)
      .map((card) => {
        // Update birthday count dynamically
        if (card.id === "birthdays") {
          return { ...card, count: birthdayCount };
        }

        // Update agenda count dynamically
        if (card.id === "agenda" || card.id === "upcoming-appointments") {
          return { ...card, count: agendaCount };
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
    </div>
  );
};

export default Inbox;
