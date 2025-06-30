import { useState, useEffect, useCallback } from "react";
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader";
import { TaskSlidePanel } from "./Inbox/components/organisms/TaskSlidePanel";
import {
  ApiColumn,
  ExtendedTask,
  TaskManagementContainer,
} from "./Inbox/components/organisms/TaskManagementContainer";
import FilterPopup, {
  FilterState,
} from "./Inbox/components/organisms/FilterPopup";
import SortPopup, { SortOption } from "./Inbox/components/organisms/SortPopup";
import PrioritySwimLanes from "./Inbox/components/organisms/PrioritySwimLanes";
import { getTaskCardsConfig } from "./Inbox/components/molecules/taskCardConfig";
import NewTaskModal from "./Inbox/components/organisms/NewTaskModal";

// Imported functions and hooks
import { usePolling } from "./Inbox/hooks/usePolling";
import { useScrollDetection } from "./Inbox/hooks/useScrollDetection";
import {
  fetchBirthdayCount,
  fetchAgendaCount,
  fetchUrgentTaskCounts,
} from "./Inbox/services/apiService";
import {
  getButtonPosition,
  formatTime,
} from "./Inbox/utils/uiUtils";
import {
  sortCards,
  filterCards,
  getCardsByPriority,
  TaskCardConfig,
} from "./Inbox/utils/cardUtils";
import {
  handleReply,
  handleComplete,
  handleCardClick,
  handleNewTask,
  handleNewTaskSubmit,
  handleNewTaskModalClose,
} from "./Inbox/handlers/eventHandlers";

// Define the correct type for urgent task counts
interface UrgentTaskCounts {
  high: number;
  medium: number;
  low: number;
  assigned_to_me: number;
  created_by_me: number;
}

const Inbox = () => {
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [agendaCount, setAgendaCount] = useState(0);
  const [urgentTaskCounts, setUrgentTaskCounts] = useState<UrgentTaskCounts>({
    high: 0,
    medium: 0,
    low: 0,
    assigned_to_me: 0,
    created_by_me: 0,
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
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [selectedCardTitle, setSelectedCardTitle] = useState("");
  const [panelWidth, setPanelWidth] = useState(1201.2);

  // New Task Modal state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Polling state
  const [isPolling, setIsPolling] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds default
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

  // Unified data fetching function for polling
  const fetchAllData = useCallback(
    async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        const results = await Promise.allSettled([
          fetchBirthdayCount().then(setBirthdayCount),
          fetchUrgentTaskCounts().then((counts) =>
            setUrgentTaskCounts({
              high: counts.high,
              medium: counts.medium,
              low: counts.low,
              assigned_to_me: counts.assigned_to_me || 0,
              created_by_me: counts.created_by_me || 0,
            })
          ),
          fetchAgendaCount().then(setAgendaCount),
        ]);

        // Check if any promises failed
        const hasError = results.some((result) => result.status === "rejected");

        if (hasError && !isInitialLoad) {
          const errors = results
            .filter((result) => result.status === "rejected")
            .map((result) => (result as PromiseRejectedResult).reason);

          polling.setPollingError(
            `Failed to update: ${errors.length} API(s) failed`
          );
          polling.setPollingStatus("error");
        } else {
          polling.setPollingStatus(isPolling ? "active" : "paused");
          polling.setLastUpdated(new Date());
          if (isInitialLoad) {
            setError(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (isInitialLoad) {
          setError("Failed to load data");
        } else {
          polling.setPollingError("Failed to update data");
          polling.setPollingStatus("error");
        }
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [isPolling]
  );

  // Use polling hook
  const polling = usePolling({
    pollingInterval,
    isPolling,
    fetchDataFunction: () => fetchAllData(false),
  });


  // Use scroll detection hook
  const { scrollableContainers, checkScrollable } = useScrollDetection([
    panelWidth,
    isPanelVisible,
    urgentTaskCounts,
    birthdayCount,
    agendaCount,
  ]);

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isIntervalDropdownOpen) {
        const target = event.target as HTMLElement;
        // More specific check for the polling interval dropdown
        if (!target.closest("[data-polling-dropdown]")) {
          setIsIntervalDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isIntervalDropdownOpen]);

  // Initialize data
  useEffect(() => {
    fetchAllData(true);
  }, []);

  // Task cards configuration
  const taskCards: TaskCardConfig[] = getTaskCardsConfig(
    urgentTaskCounts,
    birthdayCount,
    agendaCount
  );

  // Filter cards based on selected filters and sort
  const getFilteredCardsByPriority = (priority: string) => {
    const cards = getCardsByPriority(
      priority,
      taskCards,
      birthdayCount,
      agendaCount,
      urgentTaskCounts
    );
    const filteredCards = filterCards(cards, filters);
    return sortCards(filteredCards, currentSort);
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

  const handleRefresh = () => {
    fetchAllData(false);
  };

  // Handle interval change
  const handleIntervalChange = (newInterval: number) => {
    console.log("Changing polling interval from", pollingInterval, "to", newInterval);
    setPollingInterval(newInterval);
    setIsIntervalDropdownOpen(false);
    
    // Force re-render to ensure UI updates
    setTimeout(() => {
      console.log("Polling interval updated to:", newInterval);
    }, 100);
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

  // Check scrollability when data changes
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
    checkScrollable,
  ]);

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
          onNewTask={() => handleNewTask(setIsNewTaskModalOpen)}
          onFilter={handleFilter}
          onSort={handleSort}
          filters={filters}
        />

        {/* Compact Polling Status Indicator */}
        <div 
          className="fixed top-4 z-50 transition-all duration-300 ease-in-out"
          style={{
            right: isPanelVisible ? `${panelWidth + 24}px` : '24px',
          }}
        >
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-gray-100/50">
              <div className={`w-2 h-2 rounded-full ${
                polling.pollingStatus === "active" 
                  ? "bg-green-400 animate-pulse" 
                  : polling.pollingStatus === "error"
                  ? "bg-red-400"
                  : "bg-gray-300"
              }`}></div>
              <span className="text-xs font-medium text-gray-700">
                {polling.pollingStatus === "active" ? "Live" : 
                 polling.pollingStatus === "paused" ? "Paused" :
                 polling.pollingStatus === "error" ? "Error" : "Idle"}
              </span>
              
              {/* Controls dropdown */}
              <div className="relative" data-polling-dropdown>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIntervalDropdownOpen(!isIntervalDropdownOpen);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  title="Polling controls"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isIntervalDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[60]">
                    <div className="p-2 border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-700 mb-1">Status</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        {polling.lastUpdated && (
                          <span>Last: {formatTime(polling.lastUpdated)}</span>
                        )}
                        {polling.pollingError && (
                          <span className="text-red-500 truncate">{polling.pollingError}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-2 border-b border-gray-100">
                      <div className="text-xs font-medium text-gray-700 mb-2">Refresh Interval</div>
                      <div className="space-y-1">
                        {[
                          { value: 30000, label: "30 seconds" },
                          { value: 60000, label: "1 minute" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIntervalChange(option.value);
                            }}
                            className={`w-full px-2 py-1 text-xs text-left rounded hover:bg-gray-50 transition-colors ${
                              pollingInterval === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <div className="flex gap-1">
                        <button
                          onClick={polling.handleManualRefresh}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
                          title="Refresh now"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </button>
                        <button
                          onClick={() => {
                            polling.togglePolling();
                            setIsPolling(!isPolling);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
                          title={isPolling ? "Pause auto-refresh" : "Resume auto-refresh"}
                        >
                          {isPolling ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                              </svg>
                              Pause
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              Resume
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

        {/* Active Filters Status for Priority Swim Lanes */}
        {Object.values(filters).some(Boolean) && (
          <div className="px-4 mb-3">
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-blue-700 font-medium">Filtered by item count:</span>
                <div className="flex gap-1">
                  {filters.low && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      0-5 items
                    </span>
                  )}
                  {filters.medium && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      6-10 items
                    </span>
                  )}
                  {filters.high && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      11+ items
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFilters({
                    low: false,
                    medium: false,
                    high: false,
                    customOnly: false,
                    defaultOnly: false,
                  })}
                  className="ml-auto text-blue-600 hover:text-blue-800 text-xs underline"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Priority Swim Lanes */}
        <PrioritySwimLanes
          swimLanes={swimLanes}
          onCardClick={(cardType, cardConfig) =>
            handleCardClick(cardType, cardConfig, {
              setSelectedCardTasks,
              setSelectedCardColumns,
              setSelectedCardTitle,
              setIsPanelVisible,
              setIsPanelLoading,
              setError,
            })
          }
          scrollableContainers={scrollableContainers}
        />

        {/* Task Management Container */}
        <div className="w-full bg-[#f4f5fb]">
          <TaskManagementContainer
            onReply={handleReply}
            onComplete={(taskId) =>
              handleComplete(taskId, () => fetchAllData(false))
            }
          />
        </div>
      </div>

      {/* Task Slide Panel */}
      {isPanelVisible && (
        <TaskSlidePanel
          tasks={selectedCardTasks}
          columns={selectedCardColumns}
          onReply={handleReply}
          onComplete={(taskId) =>
            handleComplete(taskId, () => fetchAllData(false))
          }
          isVisible={isPanelVisible}
          isLoading={isPanelLoading}
          onClose={handleClosePanel}
          title={selectedCardTitle}
          cardType={selectedCardTitle}
          onWidthChange={handlePanelWidthChange}
        />
      )}

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => handleNewTaskModalClose(setIsNewTaskModalOpen)}
        onSubmit={(taskData) =>
          handleNewTaskSubmit(
            taskData,
            () => fetchAllData(false),
            setIsNewTaskModalOpen,
            setError
          )
        }
      />
    </div>
  );
};

export default Inbox;