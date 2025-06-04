import { useState, useEffect } from "react";
import {
  CheckIcon,
  ClockIcon,
  PlayIcon,
} from "./Inbox/components/assets/Icons";
import { Icon } from "./Inbox/components/atoms/Icon";
import { TaskCard } from "./Inbox/components/organisms/TaskCard";
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

  // Fetch birthday data from API
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

      const birthdayData = response.data.data;
      const transformedTasks = birthdayData.map(transformBirthdayToTask);

      setBirthdayTasks(transformedTasks);
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

      {/* Task Cards Grid */}
      <div className="w-full max-w-full px-4">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <TaskCard
            title="Birthdays"
            count={birthdayCount}
            icon={<PlayIcon />}
            onClick={() => handleCardClick("Birthdays")}
            variant="urgent"
          />

          <TaskCard
            title="Review Forms"
            count={8}
            icon={
              <Icon size="md">
                <PlayIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Review Forms")}
            variant="normal"
          />

          <TaskCard
            title="Review Prescriptions"
            count={7}
            icon={
              <Icon size="md">
                <PlayIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Review Prescriptions")}
            variant="normal"
          />

          <TaskCard
            title="Pending Too Long"
            count={2}
            icon={
              <Icon size="md">
                <CheckIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Pending Too Long")}
            variant="normal"
          />

          <TaskCard
            title="Treatment Reviews"
            count={0}
            icon={<ClockIcon />}
            onClick={() => handleCardClick("Treatment Reviews")}
            variant="normal"
          />
        </div>
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
