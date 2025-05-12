import React, { useEffect, useState } from "react";
import NotificationItem from "../../molecules/NotificationItem/NotificationItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface NotificationCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

interface Notification {
  id: string;
  type: "ALERT" | "TASK" | "MESSAGE" | "REMINDER" | "APPOINTMENT";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  time: string;
  metadata?: any; // For additional data specific to notification types
}

interface ApiResponse {
  inbox_messages: InboxMessage[];
  inbox_reminders: InboxReminder[];
  person_reminders: PersonReminder[];
  patient_messages: PatientMessage[];
  appointment_reminders: AppointmentReminder[];
}

interface InboxMessage {
  id: number;
  date: string;
  message: string;
  user: string;
  activity: number;
  subject: string;
  assigned_to: string;
  message_status: string;
}

interface InboxReminder {
  id: number;
  message_text: string;
  sent_date: string;
  due_date: string;
  priority: string;
  type: string;
  notified_on: null | string;
}

interface PersonReminder {
  id: number | null;
  message_text: string | null;
  sent_date: string | null;
  due_date: string | null;
  priority: string;
  type: string | null;
  notified_on: null | string;
}

interface PatientMessage {
  message_id: number;
  secure_status: number;
  subject: string;
  body: string;
  message_time: string;
  fname: string;
  lname: string;
}

interface AppointmentReminder {
  id: number;
  date_of_appointment: string;
  time_of_appointment: string;
  practice_name: string;
  clienttell_response: string;
  pc_eventDate: string;
  fname: string;
  lname: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ patientId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);

  // Function to calculate time difference for display
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Format time range for appointments (e.g., "13:00:00-13:15:00" -> "1:00 PM - 1:15 PM")
  const formatTimeRange = (timeRange: string) => {
    if (!timeRange) return "Time not specified";

    const [startTime, endTime] = timeRange.split("-");

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":").map((num) => parseInt(num));
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    const formattedStart = formatTime(startTime);
    const formattedEnd = endTime ? formatTime(endTime) : "";

    return formattedEnd
      ? `${formattedStart} - ${formattedEnd}`
      : formattedStart;
  };

  // Format date for display (e.g., "2023-04-03" -> "Monday, April 3, 2023")
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not specified";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Transform API data to our notification format
  const transformApiDataToNotifications = (
    data: ApiResponse
  ): Notification[] => {
    const allNotifications: Notification[] = [];

    // Transform inbox_messages to notifications
    if (data.inbox_messages) {
      data.inbox_messages.forEach((msg, index) => {
        allNotifications.push({
          id: `message-${msg.id}-${index}`, // Changed prefix from task- to message-
          type: "MESSAGE", // Changed type from TASK to MESSAGE
          priority: "Medium", // Default priority
          title: msg.subject,
          description: msg.message,
          time: getTimeAgo(msg.date),
        });
      });
    }

    // Transform inbox_reminders to notifications
    if (data.inbox_reminders) {
      data.inbox_reminders.forEach((reminder, index) => {
        // Set type based on reminder.type
        const type =
          reminder.type === "telehealth" || reminder.type === "other"
            ? "ALERT"
            : "REMINDER";

        allNotifications.push({
          id: `${type.toLowerCase()}-${reminder.id}-${index}`,
          type,
          priority: reminder.priority as "High" | "Medium" | "Low",
          title: `${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Notification`,
          description: reminder.message_text || "No description provided",
          time: getTimeAgo(reminder.sent_date),
        });
      });
    }

    // Transform patient_messages to notifications
    if (data.patient_messages) {
      data.patient_messages.forEach((msg, index) => {
        allNotifications.push({
          id: `message-${msg.message_id}-${index}`,
          type: "MESSAGE",
          priority: "Low", // Default priority for messages
          title: msg.subject,
          description: `From: ${msg.fname} ${msg.lname} - ${msg.body.replace(/<[^>]*>/g, "")}`,
          time: getTimeAgo(msg.message_time),
        });
      });
    }

    // Add person_reminders, including empty ones to maintain accurate counts
    if (data.person_reminders) {
      data.person_reminders.forEach((reminder, index) => {
        // Only add if there's valid data
        if (reminder.id !== null && reminder.message_text) {
          allNotifications.push({
            id: `person-reminder-${reminder.id}-${index}`,
            type: "REMINDER",
            priority:
              reminder.priority === "N/A"
                ? "Low"
                : (reminder.priority as "High" | "Medium" | "Low"),
            title: reminder.type
              ? `${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Reminder`
              : "Personal Reminder",
            description: reminder.message_text,
            time: reminder.sent_date
              ? getTimeAgo(reminder.sent_date)
              : "Unknown",
          });
        }
      });
    }

    // Transform appointment_reminders to notifications
    if (data.appointment_reminders) {
      data.appointment_reminders.forEach((appt, index) => {
        // Calculate if the appointment is upcoming (in the future)
        const apptDate = new Date(`${appt.date_of_appointment}T00:00:00`);
        const now = new Date();
        const isUpcoming = apptDate > now;

        // Extract time from the time range
        const timeRange = formatTimeRange(appt.time_of_appointment);

        // Format the appointment date
        const formattedDate = formatDate(appt.date_of_appointment);

        // Create a description that includes all relevant appointment info
        const description = `${formattedDate} at ${timeRange} - ${appt.practice_name}`;

        allNotifications.push({
          id: `appointment-${appt.id}-${index}`,
          type: "APPOINTMENT",
          // Higher priority for upcoming appointments
          priority: isUpcoming ? "High" : "Medium",
          title: `Appointment with ${appt.fname} ${appt.lname}`,
          description: description,
          time: getTimeAgo(appt.pc_eventDate || appt.date_of_appointment),
          metadata: {
            ...appt,
            isUpcoming,
          },
        });
      });
    }

    return allNotifications;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/notifications?patient_id=${patientId}`
      );

      // Store the API data
      setApiData(response.data);

      // Transform API data to notification format
      const transformedNotifications = transformApiDataToNotifications(
        response.data
      );

      setNotifications(transformedNotifications);
      setFilteredNotifications(transformedNotifications);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchNotifications();
    }
  }, [patientId]);

  // Effect for filtering notifications based on active tab
  // Effect for filtering notifications based on active tab
  useEffect(() => {
    if (!apiData) return;

    // Generate IDs for each source, so we can trace back where each notification came from
    const sourceIdMap = {
      inbox_messages: notifications?.filter((note) =>
        note.id.startsWith("task-")
      ),
      patient_messages: notifications?.filter((note) =>
        note.id.startsWith("message-")
      ),
      inbox_reminders: notifications?.filter(
        (note) =>
          note.id.startsWith("reminder-") || note.id.startsWith("alert-")
      ),
      person_reminders: notifications?.filter((note) =>
        note.id.startsWith("person-reminder-")
      ),
      appointment_reminders: notifications?.filter((note) =>
        note.id.startsWith("appointment-")
      ),
    };

    if (activeTab === "All") {
      // Show all notifications
      setFilteredNotifications(notifications);
    } else if (activeTab === "GT Alerts") {
      // No specific source for alerts yet, show empty
      setFilteredNotifications([]);
    } else if (activeTab === "Tasks") {
      // No specific source for tasks yet, show empty
      setFilteredNotifications([]);
    } else if (activeTab === "Messages") {
      // Concat inbox_messages and patient_messages
      const messages = [
        ...sourceIdMap.inbox_messages,
        ...sourceIdMap.patient_messages,
      ];
      setFilteredNotifications(messages);
    } else if (activeTab === "Reminders") {
      // Concat inbox_reminders, person_reminders, and appointment_reminders
      const reminders = [
        ...sourceIdMap.inbox_reminders,
        ...sourceIdMap.person_reminders,
        ...sourceIdMap.appointment_reminders,
      ];
      setFilteredNotifications(reminders);
    }
  }, [activeTab, notifications, apiData]);

  // Generate IDs for each source, for counting
  const sourceIdMap = notifications
    ? {
        inbox_messages: notifications?.filter((note) =>
          note.id.startsWith("task-")
        ),
        patient_messages: notifications?.filter((note) =>
          note.id.startsWith("message-")
        ),
        inbox_reminders: notifications?.filter(
          (note) =>
            note.id.startsWith("reminder-") || note.id.startsWith("alert-")
        ),
        person_reminders: notifications?.filter((note) =>
          note.id.startsWith("person-reminder-")
        ),
        appointment_reminders: notifications?.filter((note) =>
          note.id.startsWith("appointment-")
        ),
      }
    : {
        inbox_messages: [],
        patient_messages: [],
        inbox_reminders: [],
        person_reminders: [],
        appointment_reminders: [],
      };

  // Count notifications for each tab
  const counts = {
    All: notifications ? notifications.length : 0,
    "GT Alerts": 0, // No specific source yet
    Tasks: 0, // No specific source yet
    Messages:
      sourceIdMap.inbox_messages.length + sourceIdMap.patient_messages.length,
    Reminders:
      sourceIdMap.inbox_reminders.length + sourceIdMap.person_reminders.length,
    Appointments: sourceIdMap.appointment_reminders.length,
  };

  const tabs = [
    { label: "All", count: counts.All },
    { label: "GT Alerts", count: counts["GT Alerts"] },
    { label: "Tasks", count: counts.Tasks },
    { label: "Messages", count: counts.Messages },
    { label: "Reminders", count: counts.Reminders + counts.Appointments },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={150} />
          <Skeleton height={40} width={150} />
          <Skeleton height={40} width={150} />
        </div>

        <div className="mt-4">
          <Skeleton height={80} style={{ marginTop: "10px" }} />
          <Skeleton height={80} style={{ marginTop: "10px" }} />
          <Skeleton height={80} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Unable to Load Notifications"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={fetchNotifications}
      />
    );
  }

  if (!apiData || !notifications) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected notification data but received an invalid format."
        icon="warning"
        onRetry={fetchNotifications}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))
      ) : (
        <EmptyStateComponent
          title="No Notifications Available"
          message={
            activeTab === "All"
              ? "There are no notifications for this patient."
              : `There are no ${activeTab} for this patient.`
          }
        />
      )}
    </div>
  );
};

export default NotificationCard;