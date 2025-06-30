import { TaskFormData } from "../types/taskTypes";
import { TaskCardConfig } from "../utils/cardUtils";
import {
  fetchAgendaDataForPanel,
  fetchBirthdayDataForPanel,
  fetchUrgentTasksDataForPanel,
  fetchApplicantsDataForPanel,
} from "./dataHandlers";
import {
  fetchAssignedTasksDataForPanel,
  fetchCreatedByMeTasksDataForPanel,
} from "../services/taskService";

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
    setIsPanelLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  }
) => {
  console.log(
    `${cardType === "Tasks created by me"} ${cardType} ${cardConfig} card clicked`
  );

  // Set loading state and show panel immediately
  setters.setIsPanelLoading(true);
  setters.setIsPanelVisible(true);
  setters.setSelectedCardTitle(cardType);

  try {
    if (cardType === "Birthdays") {
      const { tasks, columns, title } = await fetchBirthdayDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelLoading(false);
    } else if (cardType === "Agenda" || cardType === "Upcoming Appointments") {
      const { tasks, columns, title } = await fetchAgendaDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelLoading(false);
    } else if (cardType === "Urgent Tasks" && cardConfig) {
      console.log(cardConfig.priority, "cardConfig.priority");
      const { tasks, columns, title } = await fetchUrgentTasksDataForPanel(
        cardConfig.priority as "high" | "medium" | "low"
      );
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelLoading(false);
    } else if (cardType === "Assigned to Me") {
      const { tasks, columns, title } = await fetchAssignedTasksDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelLoading(false);
    } else if (cardType === "Tasks Created by Me") {
      const { tasks, columns, title } =
        await fetchCreatedByMeTasksDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelLoading(false);
    } else if (cardType === "Applicants") {
      const { tasks, columns, title } = await fetchApplicantsDataForPanel();
      setters.setSelectedCardTasks(tasks);
      setters.setSelectedCardColumns(columns);
      setters.setSelectedCardTitle(title);
      setters.setIsPanelLoading(false);
    } else if (cardType === "All Reminders") {
      setters.setSelectedCardTasks([]);
      setters.setSelectedCardColumns([]);
      setters.setSelectedCardTitle(cardType);
      setters.setIsPanelLoading(false);
    } else {
      setters.setSelectedCardTasks([]);
      setters.setSelectedCardColumns([]);
      setters.setSelectedCardTitle(cardType);
      setters.setIsPanelLoading(false);
    }
  } catch (err) {
    setters.setIsPanelLoading(false);
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