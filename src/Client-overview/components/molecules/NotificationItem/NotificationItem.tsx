import React, { useState } from "react";

interface Notification {
  id: string;
  type: "ALERT" | "TASK" | "MESSAGE" | "REMINDER" | "APPOINTMENT";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  time: string;
  metadata?: any; // Optional field for additional data
}

interface Props {
  notification: Notification;
}

const NotificationItem: React.FC<Props> = ({ notification }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define icons for each notification type
  const iconMap = {
    ALERT: (
      <svg
        className="w-4 h-4 text-yellow-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>
    ),
    TASK: (
      <svg
        className="w-4 h-4 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="12" y2="13" />
      </svg>
    ),
    MESSAGE: (
      <svg
        className="w-4 h-4 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16v12H5.5L4 18V4z" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="12" y2="12" />
      </svg>
    ),
    REMINDER: (
      <svg
        className="w-4 h-4 text-purple-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 8v4l2 2" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    APPOINTMENT: (
      <svg
        className="w-4 h-4 text-green-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    ),
  };

  // Define border colors for each notification type
  const borderColor = {
    ALERT: "border-l-yellow-500",
    TASK: "border-l-blue-500",
    MESSAGE: "border-l-blue-500",
    REMINDER: "border-l-purple-500",
    APPOINTMENT: "border-l-green-500",
  };

  // Define background/text colors for each priority level
  const priorityColors = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-yellow-50 text-yellow-600",
    Low: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      className={`relative flex my-3 mx-3 flex-col p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all duration-200 ${
        borderColor[notification.type]
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header - Type and Priority */}
      <div className="flex items-center gap-2">
        {iconMap[notification.type]}
        <span className="text-xs font-normal text-[#020817]">
          {notification.type}
        </span>
        {notification.priority !== "Low" && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-extralight ${
              priorityColors[notification.priority]
            }`}
          >
            {notification.priority} Priority
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-normal text-[#020817]">
        {notification.title}
      </h3>

      {/* Description */}
      <p className="mt-1 text-xs font-light text-gray-600">
        {notification.description.length > 100
          ? `${notification.description.substring(0, 100)}...`
          : notification.description}
      </p>

      {/* Footer - Time and Actions */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs font-extralight text-gray-500">
          {notification.time}
        </div>

        {/* Action Buttons - visible on hover */}
        <div
          className={`flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Conditional rendering for appointment-specific action */}
          {/* {notification.type === "APPOINTMENT" ? (
            <button className="px-2 py-0.5 text-xs text-white transition-all duration-200 bg-green-600 rounded-md hover:bg-green-700">
              Manage Appointment
            </button>
          ) : (
            <button className="px-2 py-0.5 text-xs text-white transition-all duration-200 bg-[#00b8e6] rounded-md hover:bg-blue-600">
              Mark as Read
            </button>
          )} */}
          {/* <button className="px-2 py-0.5 text-xs text-[#00b8e6] transition-all duration-200 border border-[#00b8e6] rounded-md hover:bg-blue-100">
            View Details
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;