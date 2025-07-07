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

    const response = await axiosClient.get<MessageApiResponse>(
      "/inbox/messages",
      {
        params: {
          format: "inbox_list",
          per_page: 100,
        },
      }
    );

    const transformedTasks: ExtendedTask[] = response.data.data.map(
      (message: MessageData) => ({
        id: message.id.toString(),
        title: `${message.type}: ${message.patient}`,
        description: message.body || `Message from ${message.from} regarding ${message.patient}`,
        assignedTo: message.from,
        person: message.patient,
        dueDate: message.date,
        priority: "medium" as const,
        status:
          message.status === "Done" ||
          message.status === "Read"
            ? ("completed" as const)
            : ("pending" as const),
        type: message.type,
        // Include all original message data for dynamic column access
        message: `${message.type}: ${message.patient}`,
        from: message.from,
        patient: message.patient,
        messageType: message.type,
        body: message.body,
        content: message.body, // Map body to content for column display
        date: message.date,
        messageStatus:
          message.status === "Done" ||
          message.status === "Read"
            ? "read"
            : "unread",
        form_link: message.form_link,
      })
    );

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
    });

    return {
      tasks: transformedTasks,
      columns: messageColumns,
      title: "Messages",
    };
  } catch (err) {
    throw new Error("Failed to load messages data");
  }
};