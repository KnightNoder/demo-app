import { TaskFormData } from "../types/taskTypes";
import { TaskCardConfig } from "../utils/cardUtils";
import {
  fetchAgendaDataForPanel,
  fetchBirthdayDataForPanel,
  fetchUrgentTasksDataForPanel,
} from "./dataHandlers";

// Task action handlers
export const handleReply = (taskId: string) => {
  console.log("Reply to task:", taskId);
};

export const handleComplete = (taskId: string, refreshData: () => void) => {
  console.log("Complete task:", taskId);
  // Refresh counts after completing a task
  refreshData();
};

// Card click handler
export const handleCardClick = async (
  cardType: string,
  cardConfig: TaskCardConfig | undefined,
  setters: {
    setSelectedCardTasks: (tasks: any[]) => void;
    setSelectedCardColumns: (columns: any[]) => void;
    setSelectedCardTitle: (title: string) => void;
    setIsPanelVisible: (visible: boolean) => void;
    setError: (error: string | null) => void;
  }
) => {
  console.log(`${cardType} ${cardConfig} card clicked`);

  try {
    if (cardType === "Birthdays") {
      const { tasks, columns, title } = await fetchBirthdayDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelVisible(true);
    } else if (cardType === "Agenda" || cardType === "Upcoming Appointments") {
      const { tasks, columns, title } = await fetchAgendaDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelVisible(true);
    } else if (cardType === "Urgent Tasks" && cardConfig) {
      console.log(cardConfig.priority, "cardConfig.priority");
      const { tasks, columns, title } = await fetchUrgentTasksDataForPanel(
        cardConfig.priority as "high" | "medium" | "low"
      );
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelVisible(true);
    } else if (cardType === "All Reminders") {
      setters.setSelectedCardTasks([]);
      setters.setSelectedCardColumns([]);
      setters.setSelectedCardTitle(cardType);
      setters.setIsPanelVisible(true);
    } else {
      setters.setSelectedCardTasks([]);
      setters.setSelectedCardColumns([]);
      setters.setSelectedCardTitle(cardType);
      setters.setIsPanelVisible(true);
    }
  } catch (err) {
    setters.setError(err instanceof Error ? err.message : "An error occurred");
  }
};

// New task handlers
export const handleNewTask = (setIsNewTaskModalOpen: (open: boolean) => void) => {
  console.log("New task clicked - opening modal");
  setIsNewTaskModalOpen(true);
};

export const handleNewTaskSubmit = async (
  taskData: TaskFormData,
  refreshData: () => Promise<void>,
  setIsNewTaskModalOpen: (open: boolean) => void,
  setError: (error: string | null) => void
) => {
  console.log("New task submitted:", taskData);

  try {
    // Here you would typically make an API call to create the task
    // const response = await axiosClient.post("/tasks", taskData);

    // For now, just log the data and refresh the counts
    console.log("Task created successfully:", taskData);

    // Refresh data to reflect the new task
    await refreshData();

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

export const handleNewTaskModalClose = (setIsNewTaskModalOpen: (open: boolean) => void) => {
  setIsNewTaskModalOpen(false);
};