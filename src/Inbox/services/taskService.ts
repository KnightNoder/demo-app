// src/services/inbox/taskService.ts
import axiosClient from "../../api/axiosClient";

interface UrgentTaskCountApiResponse {
  success: boolean;
  data: {
    high: number;
    medium: number;
    low: number;
  };
}

export const fetchUrgentTaskCounts = async (): Promise<{
  high: number;
  medium: number;
  low: number;
}> => {
  try {
    const response = await axiosClient.get<UrgentTaskCountApiResponse>(
      "/tasks/priority-summary"
    );
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch urgent task counts:", err);
    throw new Error("Failed to load urgent task counts");
  }
};

export const fetchUrgentTasksDataForPanel = async (
  priority: "high" | "medium" | "low"
): Promise<{
  tasks: any[];
  columns: any[];
  title: string;
}> => {
  try {
    const priorityMap = {
      high: 1,
      medium: 2,
      low: 3,
    };

    const response = await axiosClient.get<any>("/tasks", {
      params: {
        priority: priorityMap[priority],
      },
    });

    const transformedTasks = response.data.data.map(
      (task: any, index: number) => ({
        id: task.id?.toString() || index.toString(),
        title: task.subject || "None",
        description: task.message || "No Description",
        assignedTo: task.received_from?.name || "System",
        person: task.patient?.name || "",
        dueDate: task.due_date || "Today",
        priority: task.priority?.toLowerCase() || priority,
        status: task.status?.toLowerCase() || "pending",
        type: task.type || "Reminder",
        subject: task.subject,
        message: task.message,
        start_date: task.start_date,
        due_date: task.due_date,
        received_from: task.received_from?.name,
        patient: task.patient?.name,
        patient_pid: task.patient?.pid,
      })
    );

    const columnDefinitions = [
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

    return {
      tasks: transformedTasks,
      columns: columnDefinitions,
      title: `Urgent Tasks - ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`,
    };
  } catch (err) {
    console.error("Failed to fetch urgent tasks data for panel:", err);
    throw new Error("Failed to load urgent tasks data");
  }
};

