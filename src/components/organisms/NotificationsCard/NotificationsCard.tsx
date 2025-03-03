import React, { useEffect, useState } from "react";
import NotificationItem from "../../molecules/NotificationItem/NotificationItem";

interface Notification {
  id: number;
  type: "ALERT" | "TASK" | "MESSAGE" | "REMINDER";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  time: string;
}

const NotificationCard: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications([
        {
          id: 1,
          type: "ALERT",
          priority: "High",
          title: "Critical Lab Alert",
          description: "STAT: Patient Sarah M. shows K+ level of 6.8 mEq/L - Immediate action required",
          time: "47m ago",
        },
        {
          id: 2,
          type: "TASK",
          priority: "High",
          title: "4 unsigned orders",
          description: "Including critical imaging results",
          time: "1h ago",
        },
        {
          id: 3,
          type: "MESSAGE",
          priority: "Low",
          title: "Cardiology consultation report",
          description: "Report received for Patient Robert J.",
          time: "2h ago",
        },
        {
          id: 4,
          type: "REMINDER",
          priority: "Medium",
          title: "Preventive Care Due",
          description: "3 patients due for annual wellness visits this week",
          time: "4h ago",
        },
      ]);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))
      ) : (
        <p className="text-center text-gray-500">No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationCard;
