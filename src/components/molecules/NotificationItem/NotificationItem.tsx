import React, { useState } from "react";

interface Notification {
  id: number;
  type: "ALERT" | "TASK" | "MESSAGE" | "REMINDER";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  time: string;
}

interface Props {
  notification: Notification;
}

const NotificationItem: React.FC<Props> = ({ notification }) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconMap = {
    ALERT: (
      <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>
    ),
    TASK: (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="12" y2="13" />
      </svg>
    ),
    MESSAGE: (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v12H5.5L4 18V4z" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="12" y2="12" />
      </svg>
    ),
    REMINDER: (
      <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8v4l2 2" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  };

  const borderColor = {
    ALERT: "border-l-yellow-500",
    TASK: "border-l-blue-500",
    MESSAGE: "border-l-blue-500",
    REMINDER: "border-l-purple-500",
  };

  const priorityColors = {
    High: "bg-red-200 text-red-700",
    Medium: "bg-yellow-200 text-yellow-700",
    Low: "bg-gray-200 text-gray-700",
  };

  return (
    <div
      className={`relative flex my-4 flex-col p-4 bg-white rounded-md shadow-md border-l-4 transition-all duration-200 ${borderColor[notification.type]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        {iconMap[notification.type]}
        <span className="text-sm font-semibold text-gray-700">
          {notification.type}
        </span>
        {notification.priority !== "Low" && (
          <span className={`px-2 py-1 text-xs rounded-md ${priorityColors[notification.priority]}`}>
            {notification.priority} Priority
          </span>
        )}
      </div>
      
      <h3 className="mt-1 font-semibold text-gray-900">{notification.title}</h3>
      <p className="text-sm text-gray-600">{notification.description}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-400">{notification.time}</div>

        {/* Buttons (Smooth transition using opacity and scale) */}
        <div
          className={`flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <button className="px-3 py-1 text-sm text-white transition-all duration-200 bg-blue-500 rounded-md hover:bg-blue-600">
            Mark as Read
          </button>
          <button className="px-3 py-1 text-sm text-blue-500 transition-all duration-200 border border-blue-500 rounded-md hover:bg-blue-100">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
