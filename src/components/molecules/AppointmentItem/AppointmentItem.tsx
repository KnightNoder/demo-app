import React from "react";

interface Appointment {
  id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  provider: {
    first_name: string;
    last_name: string;
    specialization?: string;
  };
  facility: {
    name: string;
    room?: string;
  };
  category: {
    name: string;
  };
  status?: string[]; // Example: ["routine", "scheduled"]
  note?: string;
}

interface AppointmentItemProps {
  appointment: Appointment;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment }) => {
  return (
    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {appointment.title}
        </h2>
        <div className="flex space-x-2">
          {appointment.status?.map((status) => (
            <span
              key={status}
              className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
            >
              {status}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-2 text-sm text-gray-600">
        <svg
          className="w-4 h-4 mr-2 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7v4m8-4v4M4 10h16M4 6h16M4 14h16M4 18h16M8 14h8M8 18h8"
          ></path>
        </svg>
        {appointment.event_date} at {appointment.start_time}
      </div>

      <div className="flex items-center mt-2 text-sm text-gray-700">
        <svg
          className="w-4 h-4 mr-2 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14c4 0 6 2 6 6M6 20c0-4 2-6 6-6m0-6a3 3 0 110-6 3 3 0 010 6z"
          ></path>
        </svg>
        Dr. {appointment.provider.first_name} {appointment.provider.last_name}
        {appointment.provider.specialization &&
          ` • ${appointment.provider.specialization}`}
      </div>

      <div className="flex items-center mt-2 text-sm text-gray-700">
        <svg
          className="w-4 h-4 mr-2 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2C8 2 5 5 5 9c0 4.5 7 11 7 11s7-6.5 7-11c0-4-3-7-7-7z"
          ></path>
          <circle cx="12" cy="9" r="2"></circle>
        </svg>
        {appointment.facility.name}
        {appointment.facility.room && ` - ${appointment.facility.room}`}
      </div>

      {appointment.note && (
        <p className="mt-2 text-xs text-gray-500">{appointment.note}</p>
      )}
    </div>
  );
};

export default AppointmentItem;
