import React, { useEffect, useState } from "react";
import NotificationItem from "../../molecules/NotificationItem/NotificationItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface NotificationCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

interface Notification {
  id: string;
  type: "ALERT" | "TASK" | "MESSAGE" | "REMINDER";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  time: string;
}

interface ApiResponse {
  inbox_messages: InboxMessage[];
  inbox_reminders: InboxReminder[];
  person_reminders: PersonReminder[];
  patient_messages: PatientMessage[];
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

const NotificationCard: React.FC<NotificationCardProps> = ({
  patientId,
  // isAnyModalOpen,
}) => {
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

  // Transform API data to our notification format
  const transformApiDataToNotifications = (
    data: ApiResponse
  ): Notification[] => {
    const allNotifications: Notification[] = [];

    // Transform inbox_messages to notifications
    if (data.inbox_messages) {
      data.inbox_messages.forEach((msg, index) => {
        allNotifications.push({
          id: `task-${msg.id}-${index}`,
          type: "TASK", // Keeping the type for UI display consistency
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

    return allNotifications;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/notifications?patient_id=${patientId}`
      );
      console.log(response, "not api data");

      // Store the API data
      setApiData(response.data);

      // Transform API data to notification format
      const transformedNotifications = transformApiDataToNotifications(
        response.data
      );
      console.log(transformedNotifications, "transformed notifications");

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
  useEffect(() => {
    if (!apiData) return;

    // Generate IDs for each source, so we can trace back where each notification came from
    const sourceIdMap = {
      inbox_messages: notifications.filter((note) =>
        note.id.startsWith("task-")
      ),
      patient_messages: notifications.filter((note) =>
        note.id.startsWith("message-")
      ),
      inbox_reminders: notifications.filter(
        (note) =>
          note.id.startsWith("reminder-") || note.id.startsWith("alert-")
      ),
      person_reminders: notifications.filter((note) =>
        note.id.startsWith("person-reminder-")
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
      // Concat inbox_reminders and person_reminders
      const reminders = [
        ...sourceIdMap.inbox_reminders,
        ...sourceIdMap.person_reminders,
      ];
      setFilteredNotifications(reminders);
    }
  }, [activeTab, notifications, apiData]);

  // Generate IDs for each source, for counting
  const sourceIdMap = notifications
    ? {
        inbox_messages: notifications.filter((note) =>
          note.id.startsWith("task-")
        ),
        patient_messages: notifications.filter((note) =>
          note.id.startsWith("message-")
        ),
        inbox_reminders: notifications.filter(
          (note) =>
            note.id.startsWith("reminder-") || note.id.startsWith("alert-")
        ),
        person_reminders: notifications.filter((note) =>
          note.id.startsWith("person-reminder-")
        ),
      }
    : {
        inbox_messages: [],
        patient_messages: [],
        inbox_reminders: [],
        person_reminders: [],
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
  };

  const tabs = [
    { label: "All", count: counts.All },
    { label: "GT Alerts", count: counts["GT Alerts"] },
    { label: "Tasks", count: counts.Tasks },
    { label: "Messages", count: counts.Messages },
    { label: "Reminders", count: counts.Reminders },
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
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg ">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-red-500 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Unable to Load Notifications
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg ">
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
        <div className="p-6 text-center bg-white rounded-lg">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-blue-500 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            No Notifications Available
          </h3>
          <p className="text-sm text-gray-600">
            {activeTab === "All"
              ? "There are no notifications for this patient."
              : `There are no ${activeTab} for this patient.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;