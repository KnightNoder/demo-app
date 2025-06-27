import { useState, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
import { ExtendedTask, ApiColumn } from "../components/organisms/TaskManagementContainer";

// Interfaces for API responses
interface TasksApiResponse {
  data: any[];
  pagination?: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

interface BirthdayData {
  pid: number;
  name: string;
  DOB: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

interface BirthdayApiResponse {
  data: BirthdayData[];
  columns: ApiColumn[];
}

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
  copay: string;
}

interface AgendaApiResponse {
  data: AgendaData[];
  columns?: ApiColumn[];
}

// Utility functions
const capitalizeLabel = (label: string): string => {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getAppointmentPriority = (
  appointmentType: string,
  recurrenceType: string
): "high" | "medium" | "low" => {
  if (
    appointmentType?.toLowerCase().includes("urgent") ||
    appointmentType?.toLowerCase().includes("emergency")
  ) {
    return "high";
  }
  if (recurrenceType?.toLowerCase() === "repeat") {
    return "medium";
  }
  return "low";
};

// Main hook
export const useTaskData = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [columns, setColumns] = useState<ApiColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reminders/tasks data
  const fetchRemindersData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<TasksApiResponse>("/tasks?per_page=1000");

      // Transform response data to ExtendedTask format
      const transformedTasks = response.data.data.map(
        (task: any, index: number) => ({
          id: task.id?.toString() || index.toString(),
          // Required fields for ExtendedTask interface
          title: task.subject || "",
          description: task.message || "No Description",
          assignedTo: task.received_from?.name || "System",
          person: task.patient?.name || "",
          dueDate: task.due_date || "Today",
          priority: task.priority?.toLowerCase() || "medium",
          status: task.status?.toLowerCase() || "pending",
          type: task.type || "Reminder",
          // Additional fields for column mapping
          subject: task.subject || "",
          message: task.message || "No Description",
          start_date: task.start_date,
          due_date: task.due_date,
          received_from: task.received_from?.name || "System",
          patient: task.patient?.name || "",
          patient_pid: task.patient?.pid,
        })
      );

      setTasks(transformedTasks);

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

      setColumns(columnDefinitions);
      return { tasks: transformedTasks, columns: columnDefinitions };
    } catch (err) {
      console.error("Failed to fetch reminders data:", err);
      setError("Failed to load reminders data");
      setTasks([]);
      setColumns([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch birthday data
  const fetchBirthdayData = useCallback(async () => {
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

      setTasks(transformedTasks);

      // Use columns from API response with capitalized labels
      const capitalizedColumns = response.data.columns.map((column) => ({
        ...column,
        label: capitalizeLabel(column.label),
      }));

      setColumns(capitalizedColumns);
      return { tasks: transformedTasks, columns: capitalizedColumns };
    } catch (err) {
      console.error("Failed to fetch birthday data:", err);
      setError("Failed to load birthday data");
      setTasks([]);
      setColumns([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch agenda data
  const fetchAgendaData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<AgendaApiResponse>(
        "/inbox/upcoming-appointments",
        {
          params: {
            per_page: 10000,
          },
        }
      );

      const transformedTasks = response.data.data.map(
        (appointment: AgendaData) => ({
          id: appointment.pc_eid.toString(),
          title: `${appointment.appointment_type}: ${appointment.patient_name || "Group Session"}`,
          description: `${appointment.category} at ${appointment.facility}`,
          assignedTo: appointment.provider,
          person: appointment.patient_name || "Group",
          dueDate: formatDateForDisplay(appointment.pc_eventDate),
          priority: getAppointmentPriority(
            appointment.appointment_type,
            appointment.recurrence_type
          ),
          status: "pending" as const,
          type: "appointment" as const,
          // Include all original appointment data for dynamic column access
          pc_eid: appointment.pc_eid,
          pc_eventDate: appointment.pc_eventDate,
          formatted_start_time: appointment.formatted_start_time,
          formatted_end_time: appointment.formatted_end_time,
          appointment_type: appointment.appointment_type,
          recurrence_type: appointment.recurrence_type,
          patient_name: appointment.patient_name,
          name: appointment.patient_name,
          provider: appointment.provider,
          category: appointment.category,
          facility: appointment.facility,
          copay: appointment.copay,
          time_range: `${appointment.formatted_start_time} - ${appointment.formatted_end_time}`,
        })
      );

      setTasks(transformedTasks);

      // Check if API response includes columns, otherwise use enhanced columns
      if (response.data.columns && response.data.columns.length > 0) {
        const capitalizedColumns = response.data.columns.map((column) => ({
          ...column,
          label: capitalizeLabel(column.label),
        }));
        setColumns(capitalizedColumns);
        return { tasks: transformedTasks, columns: capitalizedColumns };
      } else {
        // Enhanced column definitions with copay
        const enhancedColumns: ApiColumn[] = [
          { key: "pc_eventDate", label: "Date" },
          { key: "time_range", label: "Time" },
          { key: "appointment_type", label: "Appointment Type" },
          { key: "recurrence_type", label: "Recurrence" },
          { key: "patient_name", label: "Patient" },
          { key: "provider", label: "Provider" },
          { key: "category", label: "Category" },
          { key: "facility", label: "Facility" },
          { key: "copay", label: "Copay" },
        ];
        setColumns(enhancedColumns);
        return { tasks: transformedTasks, columns: enhancedColumns };
      }
    } catch (err) {
      console.error("Failed to fetch agenda data:", err);
      setError("Failed to load agenda data");
      setTasks([]);
      setColumns([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unified fetch function that takes a data type
  const fetchData = useCallback(async (dataType: "reminders" | "birthdays" | "agenda") => {
    switch (dataType) {
      case "reminders":
        return fetchRemindersData();
      case "birthdays":
        return fetchBirthdayData();
      case "agenda":
        return fetchAgendaData();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }, [fetchRemindersData, fetchBirthdayData, fetchAgendaData]);

  return {
    tasks,
    columns,
    loading,
    error,
    fetchData,
    fetchRemindersData,
    fetchBirthdayData,
    fetchAgendaData,
    setTasks,
    setColumns,
    setError,
  };
};