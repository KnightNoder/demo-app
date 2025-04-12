import React, { useEffect, useState } from "react";
import NotificationItem from "../../molecules/NotificationItem/NotificationItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";

interface NotificationCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

interface Notification {
  id: number;
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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosClient.get(
          `/notifications?patient_id=${patientId}`
        );

        // For demo purposes, we're using the pasted data
        setApiData(response.data);

        // Transform API data to notification format
        const transformedNotifications = transformApiDataToNotifications(
          response.data
        );
        setNotifications(transformedNotifications);
        setFilteredNotifications(transformedNotifications);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notifications");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Transform API data to our notification format
  const transformApiDataToNotifications = (
    data: ApiResponse
  ): Notification[] => {
    const allNotifications: Notification[] = [];

    // Transform inbox_messages to TASK notifications
    if (data.inbox_messages) {
      data.inbox_messages.forEach((msg) => {
        allNotifications.push({
          id: msg.id,
          type: "TASK",
          priority: "Medium", // Default priority
          title: msg.subject,
          description: msg.message,
          time: getTimeAgo(msg.date),
        });
      });
    }

    // Transform inbox_reminders to REMINDER or ALERT notifications based on type
    if (data.inbox_reminders) {
      data.inbox_reminders.forEach((reminder) => {
        const type =
          reminder.type === "telehealth" || reminder.type === "other"
            ? "ALERT"
            : "REMINDER";

        allNotifications.push({
          id: reminder.id,
          type,
          priority: reminder.priority as "High" | "Medium" | "Low",
          title: `${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Notification`,
          description: reminder.message_text || "No description provided",
          time: getTimeAgo(reminder.sent_date),
        });
      });
    }

    // Transform patient_messages to MESSAGE notifications
    if (data.patient_messages) {
      data.patient_messages.forEach((msg) => {
        allNotifications.push({
          id: msg.message_id,
          type: "MESSAGE",
          priority: "Low", // Default priority for messages
          title: msg.subject,
          description: `From: ${msg.fname} ${msg.lname} - ${msg.body.replace(/<[^>]*>/g, "")}`,
          time: getTimeAgo(msg.message_time),
        });
      });
    }

    // Only add person_reminders if they have valid data
    if (data.person_reminders) {
      data.person_reminders.forEach((reminder) => {
        if (reminder.id && reminder.message_text) {
          allNotifications.push({
            id: reminder.id,
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

  // Effect for filtering notifications based on active tab
  useEffect(() => {
    if (!apiData) return;

    if (activeTab === "All") {
      setFilteredNotifications(notifications);
    } else if (activeTab === "GT Alerts") {
      const alerts = notifications.filter((note) => note.type === "ALERT");
      setFilteredNotifications(alerts);
    } else if (activeTab === "Tasks") {
      const tasks = notifications.filter((note) => note.type === "TASK");
      setFilteredNotifications(tasks);
    } else if (activeTab === "Messages") {
      const messages = notifications.filter((note) => note.type === "MESSAGE");
      setFilteredNotifications(messages);
    } else if (activeTab === "Reminders") {
      const reminders = notifications.filter(
        (note) => note.type === "REMINDER"
      );
      setFilteredNotifications(reminders);
    }
  }, [activeTab, notifications, apiData]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  // Count notifications for each tab
  const counts = {
    All: notifications.length,
    "GT Alerts": notifications.filter((note) => note.type === "ALERT").length,
    Tasks: notifications.filter((note) => note.type === "TASK").length,
    Messages: notifications.filter((note) => note.type === "MESSAGE").length,
    Reminders: notifications.filter((note) => note.type === "REMINDER").length,
  };

  const tabs = [
    { label: "All", count: counts.All },
    { label: "GT Alerts", count: counts["GT Alerts"] },
    { label: "Tasks", count: counts.Tasks },
    { label: "Messages", count: counts.Messages },
    { label: "Reminders", count: counts.Reminders },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
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
        <p className="p-4 text-center text-gray-500">
          No notifications available.
        </p>
      )}
    </div>
  );
};

export default NotificationCard;