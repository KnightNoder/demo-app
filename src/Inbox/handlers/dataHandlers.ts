import { InboxService } from "../services/inboxService";
import { ExtendedTask, ApiColumn } from "../components/organisms/TaskManagementContainer";

// Fetch full agenda data for slide panel
export const fetchAgendaDataForPanel = async (): Promise<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  title: string;
}> => {
  try {
    const { tasks, columns } = await InboxService.fetchAgendaDataForPanel();
    return {
      tasks,
      columns,
      title: "Agenda",
    };
  } catch (err) {
    throw new Error("Failed to load agenda data");
  }
};

// Fetch full birthday data for slide panel
export const fetchBirthdayDataForPanel = async (): Promise<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  title: string;
}> => {
  try {
    const { tasks, columns } = await InboxService.fetchBirthdayDataForPanel();
    return {
      tasks,
      columns,
      title: "Birthdays",
    };
  } catch (err) {
    throw new Error("Failed to load birthday data");
  }
};

// Fetch urgent tasks data for slide panel
export const fetchUrgentTasksDataForPanel = async (
  priority: "high" | "medium" | "low"
): Promise<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  title: string;
}> => {
  try {
    const { tasks, columns, title } =
      await InboxService.fetchUrgentTasksDataForPanel(priority);
    return {
      tasks,
      columns,
      title,
    };
  } catch (err) {
    throw new Error("Failed to load urgent tasks data");
  }
};