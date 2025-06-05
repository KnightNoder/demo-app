import { useState, useEffect } from "react";
import {
  // CheckIcon,
  // ClockIcon,
  PlayIcon,
} from "./Inbox/components/assets/Icons";
// import { Icon } from "./Inbox/components/atoms/Icon";
// import { TaskCard } from "./Inbox/components/organisms/TaskCard";
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader";
import { TaskManagementContainer } from "./Inbox/components/organisms/TaskManagementContainer";
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

// Transform birthday data to task format (keeping original task structure for compatibility)
const transformBirthdayToTask = (birthday: BirthdayData): any => ({
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
});

const Inbox = () => {
  const [birthdayTasks, setBirthdayTasks] = useState<any[]>([]);
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [apiColumns, setApiColumns] = useState<ApiColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Task cards configuration
  const taskCards: TaskCardConfig[] = [
    // High Priority
    {
      id: "urgent-tasks",
      title: "Urgent Tasks",
      count: 9,
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
      count: 12,
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
      id: "birthdays",
      title: "Birthdays",
      count: birthdayCount, // This will be dynamic from API
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

  // Fetch birthday data from API
  const fetchBirthdayData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<BirthdayApiResponse>(
        "/inbox/birthdays",
        {
          params: {
            per_page: 10000,
          },
        }
      );

      const birthdayData = response.data.data;

      const transformedTasks = birthdayData.map(transformBirthdayToTask);

      setBirthdayTasks(transformedTasks);
      console.log(birthdayTasks.length, "Birthday Tasks Length");
      
      setBirthdayCount(response.data.pagination.total);
      setApiColumns(response.data.columns); // Store column definitions
    } catch (err) {
      console.error("Failed to fetch birthday data:", err);
      setError("Failed to load birthday data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBirthdayData();
  }, []);

  const handleCardClick = (cardType: string) => {
    console.log(`${cardType} card clicked`);
    if (cardType === "Birthdays") {
      // Optionally refresh birthday data when card is clicked
      fetchBirthdayData();
    }
  };

  const handleNewTask = () => {
    console.log("New task clicked");
  };

  const handleFilter = () => {
    console.log("Filter clicked");
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
    fetchBirthdayData();
  };

  const handleRefresh = () => {
    fetchBirthdayData();
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
        return card;
      });
  };

  // Priority swim lane configuration
  const swimLanes = [
    {
      priority: "high",
      title: "High Priority",
      color: "red",
      dotColor: "bg-red-500",
      textColor: "text-red-700",
      cards: getCardsByPriority("high"),
    },
    {
      priority: "medium",
      title: "Medium Priority",
      color: "amber",
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      cards: getCardsByPriority("medium"),
    },
    {
      priority: "low",
      title: "Low Priority",
      color: "green",
      dotColor: "bg-green-500",
      textColor: "text-green-700",
      cards: getCardsByPriority("low"),
    },
    {
      priority: "other",
      title: "Everything Else",
      color: "blue",
      dotColor: "bg-blue-500",
      textColor: "text-blue-700",
      cards: getCardsByPriority("other"),
    },
  ];

  if (loading && birthdayTasks.length === 0) {
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
    <div className="w-full bg-[#f4f5fb] text-[#020817]">
      <TaskHeader
        onNewTask={handleNewTask}
        onFilter={handleFilter}
        onSort={handleSort}
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
                        onClick={() => handleCardClick(card.title)}
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
            </div>
          </div>
        ))}

        {/* Add New Label Button */}
        {/* <div className="relative mb-10  overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white/50 flex items-center h-[60px] cursor-pointer hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all duration-300 group mt-8 w-[220px] p-0.5">
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-4 w-4 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                ></path>
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-700">Add New Label</h3>
          </div>
        </div> */}
      </div>

      {/* Task Management Container */}
      <div className="w-full bg-[#f4f5fb]">
        <TaskManagementContainer
          tasks={birthdayTasks}
          columns={apiColumns}
          onReply={handleReply}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default Inbox;