import { InboxService } from "../services/inboxService";
import { ExtendedTask, ApiColumn } from "../components/organisms/TaskManagementContainer";
import axiosClient from "../../api/axiosClient";

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

// Fetch applicants data for slide panel
export const fetchApplicantsDataForPanel = async (): Promise<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  title: string;
}> => {
  try {
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

    const response = await axiosClient.get<ApplicantApiResponse>("/applicants");

    const transformedTasks: ExtendedTask[] = response.data.data.map(
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

    // Capitalize column labels
    const capitalizedColumns = response.data.columns.map((column) => ({
      ...column,
      label: column.label
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }));

    return {
      tasks: transformedTasks,
      columns: capitalizedColumns,
      title: "Applicants",
    };
  } catch (err) {
    throw new Error("Failed to load applicants data");
  }
};

// Fetch messages data for slide panel
export const fetchMessagesDataForPanel = async (): Promise<{
  tasks: ExtendedTask[];
  columns: ApiColumn[];
  title: string;
}> => {
  try {
    interface MessageData {
      id: string;
      message: string;
      from: string;
      person: string;
      type: string;
      date: string;
      status: string;
    }

    interface MessageApiResponse {
      data: MessageData[];
      columns?: ApiColumn[];
    }

    const response = await axiosClient.get<MessageApiResponse>("/inbox/messages", {
      params: {
        format: "inbox_list",
        per_page: 1000
      }
    });

    const transformedTasks: ExtendedTask[] = response.data.data.map(
      (message: MessageData, index: number) => ({
        id: message.id || `message-${index}`,
        title: message.message || "No subject",
        description: message.message || "No message content",
        assignedTo: message.from || "System",
        person: message.person || "",
        dueDate: message.date || "",
        priority: "medium" as const,
        status: message.status?.toLowerCase() === "unread" ? ("pending" as const) : ("completed" as const),
        type: "message" as const,
        // Include all original message data for dynamic column access
        message: message.message,
        from: message.from,
        messageType: message.type,
        date: message.date,
        messageStatus: message.status,
      })
    );

    // Define columns based on the HTML structure
    const messageColumns: ApiColumn[] = [
      { key: "message", label: "Message" },
      { key: "from", label: "From" },
      { key: "person", label: "Person" },
      { key: "type", label: "Type" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status" },
    ];

    return {
      tasks: transformedTasks,
      columns: messageColumns,
      title: "Messages",
    };
  } catch (err) {
    throw new Error("Failed to load messages data");
  }
};