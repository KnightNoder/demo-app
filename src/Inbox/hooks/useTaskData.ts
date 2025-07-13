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

interface ApplicantData {
  name: string;
  movein_facility_id: string;
  movein_date: string;
  physical_approval_date: string;
  approved_date: string;
  elgname: string | null;
  sex: string;
  phone: string | null;
  address: string;
}

interface ApplicantApiResponse {
  data: ApplicantData[];
  columns: ApiColumn[];
}

interface MessageData {
  id: number;
  from: string;
  patient: string;
  type: string;
  body: string;
  date: string;
  status: string;
  form_link: string | null;
}

interface MessageApiResponse {
  data: MessageData[];
  columns: ApiColumn[];
  success: boolean;
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
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

// Cache for preventing duplicate API calls
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 60000; // 1 minute cache

// Helper function to get cached data
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key: string, data: any, ttl: number = CACHE_TTL) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

// Main hook
export const useTaskData = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [columns, setColumns] = useState<ApiColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchType, setLastFetchType] = useState<string>("");

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

  // Fetch applicants data
  const fetchApplicantsData = useCallback(async () => {
    const cacheKey = 'applicants';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData && lastFetchType === cacheKey) {
      setTasks(cachedData.tasks);
      setColumns(cachedData.columns);
      setLoading(false); // Ensure loading is set to false when using cached data
      return cachedData;
    }
    
    try {
      setLoading(true);
      setError(null);
      setLastFetchType(cacheKey);

      const response = await axiosClient.get<ApplicantApiResponse>("/applicants");

      const transformedTasks = response.data.data.map(
        (applicant: ApplicantData, index: number) => ({
          id: `applicant-${index}`,
          title: `Applicant: ${applicant.name}`,
          description: `Moving to ${applicant.movein_facility_id}`,
          assignedTo: "System",
          person: applicant.name,
          dueDate: applicant.movein_date,
          priority: "medium" as const,
          status: "pending" as const,
          type: "applicant" as const,
          // Include all original applicant data for dynamic column access
          ...applicant,
        })
      );

      setTasks(transformedTasks);

      // Use columns from API response with capitalized labels
      const capitalizedColumns = response.data.columns.map((column) => ({
        ...column,
        label: capitalizeLabel(column.label),
      }));

      setColumns(capitalizedColumns);
      const result = { tasks: transformedTasks, columns: capitalizedColumns };
      setCachedData(cacheKey, result);
      return result;
    } catch (err) {
      console.error("Failed to fetch applicants data:", err);
      setError("Failed to load applicants data");
      setTasks([]);
      setColumns([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lastFetchType]);

  // Fetch messages data
  const fetchMessagesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<MessageApiResponse>(
        "/inbox/messages",
        {
          params: {
            format: "inbox_list",
            per_page: 100,
          },
        }
      );

      const transformedTasks = response.data.data.map(
        (message: MessageData) => ({
          id: message.id.toString(),
          title: `${message.type}: ${message.patient}`,
          description:
            message.body ||
            `Message from ${message.from} regarding ${message.patient}`,
          assignedTo: message.from,
          person: message.patient,
          dueDate: message.date,
          priority: "medium" as const,
          status:
            message.status === "Done" || message.status === "Read"
              ? ("completed" as const)
              : ("pending" as const),
          type: message.type,
          // Include all original message data for dynamic column access
          from: message.from,
          patient: message.patient,
          messageType: message.type,
          body: message.body,
          content: message.body, // Map body to content for column display
          date: message.date,
          messageStatus:
            message.status === "Done" || message.status === "Read"
              ? "read"
              : "unread",
          originalStatus: message.status, // Keep original status for reference
          form_link: message.form_link,
        })
      );
      console.log(transformedTasks);

      setTasks(transformedTasks);

      // Use columns from API response
      let messageColumns: ApiColumn[] = response.data.columns;
      
      // Update column mappings for messages
      messageColumns = messageColumns.map(column => {
        if (column.key === 'status') {
          return { ...column, key: 'messageStatus' };
        }
        // Change any column with "Content" label to "Message"
        if (column.label && column.label.toLowerCase().includes('content')) {
          return { ...column, label: 'Message' };
        }
        return column;
      });

      // Remove the "Messages" column
      messageColumns = messageColumns.filter(
        (column) => column.key !== "messages"
      );

      // Add the "Actions" column
      messageColumns.push({
        key: "actions",
        label: "Actions",
        // Add a custom cell renderer for the buttons
        cellRenderer: () =>
          `<div class="flex justify-end gap-2">
            <button class="text-gray-400 hover:text-amber-600 p-2 rounded-sm hover:bg-amber-50" title="Mark as Client Grievance">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-warning h-6 w-6 text-amber-500 hover:text-amber-600">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V7Z"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
            <button class="text-gray-400 hover:text-blue-600 p-2 rounded-sm hover:bg-blue-50" title="Mark as read">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-6 w-6 text-blue-500 hover:text-blue-600">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>`,
      });

      setColumns(messageColumns);
      return { tasks: transformedTasks, columns: messageColumns };
    } catch (err) {
      console.error("Failed to fetch messages data:", err);
      setError("Failed to load messages data");
      setTasks([]);
      setColumns([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unified fetch function that takes a data type
  const fetchData = useCallback(async (dataType: "reminders" | "birthdays" | "agenda" | "applicants" | "messages") => {
    switch (dataType) {
      case "reminders":
        return fetchRemindersData();
      case "birthdays":
        return fetchBirthdayData();
      case "agenda":
        return fetchAgendaData();
      case "applicants":
        return fetchApplicantsData();
      case "messages":
        return fetchMessagesData();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }, [fetchRemindersData, fetchBirthdayData, fetchAgendaData, fetchApplicantsData, fetchMessagesData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  return {
    tasks,
    columns,
    loading,
    error,
    fetchData,
    fetchRemindersData,
    fetchBirthdayData,
    fetchAgendaData,
    fetchApplicantsData,
    fetchMessagesData,
    setTasks,
    setColumns,
    setError,
    clearCache,
  };
};