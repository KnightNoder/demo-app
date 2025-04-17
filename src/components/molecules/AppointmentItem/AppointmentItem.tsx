import React from "react";
import Icons from "../../../assets/Icons/Icons";

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
  status?: string[];
  note?: string;
}

interface AppointmentItemProps {
  appointment: Appointment;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header row with title and category tags */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-normal text-[#020817]">
          {appointment.title}
        </h2>
        <div className="flex space-x-1">
          {/* {appointment.category && (
            <span className="px-2 py-0.5 text-xs font-light text-gray-600 bg-gray-100 rounded-md">
              {appointment.category.name}
            </span>
          )} */}
          {/* {appointment.status?.map((status) => (
            <span
              key={status}
              className="px-2 py-0.5 text-xs font-light text-gray-600 bg-gray-100 rounded-md"
            >
              {status}
            </span>
          ))} */}
        </div>
      </div>

      {/* Date and time row */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <Icons variant="appointment-calender" />
        <span className="font-light">
          {appointment.event_date} at {appointment.start_time}
        </span>
      </div>

      {/* Provider row */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <Icons variant="doctor" />
        <span className="font-light">
          Dr. {appointment.provider.first_name} {appointment.provider.last_name}
          {appointment.provider.specialization &&
            ` • ${appointment.provider.specialization}`}
        </span>
      </div>

      {/* Location row */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <Icons variant="location" className="!w-3 !h-3" />
        <span className="font-light">
          {appointment.facility.name}
          {appointment.facility.room && ` - ${appointment.facility.room}`}
        </span>
      </div>

      {/* Note section - standardized with icon row pattern */}
      {appointment.note && (
        <div className="flex items-start gap-2 mt-2 text-xs text-gray-600">
          <span className="font-normal text-[#020817]">Note:</span>
          <span className="font-light">{appointment.note}</span>
        </div>
      )}
    </div>
  );
};

export default AppointmentItem;