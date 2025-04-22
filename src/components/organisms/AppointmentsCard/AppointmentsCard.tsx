import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppointmentItem from "../../molecules/AppointmentItem/AppointmentItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";

interface Appointment {
  id: number;
  title: string;
  description: string;
  event_date: string;
  end_date: string;
  duration: number;
  start_time: string;
  end_time: string;
  recurrence_type: number;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
  };
  provider: {
    id: number;
    first_name: string;
    last_name: string;
  };
  facility: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

interface AppointmentsCardProps {
  patientId: string | null;
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({ patientId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Upcoming");

  const fetchAppointments = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const response = await axiosClient.get(`/appointments/${patientId}/`);
      setAppointments(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  const getFilteredAppointments = () => {
    const now = new Date();

    switch (activeTab) {
      case "Upcoming":
        return appointments.filter((appointment) => {
          const eventDate = new Date(appointment.event_date);
          return eventDate >= now;
        });
      case "Past":
        return appointments.filter((appointment) => {
          const eventDate = new Date(appointment.event_date);
          return eventDate < now;
        });
      case "All":
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  // Update tab counts based on filtered data
  const upcomingCount = appointments.filter(
    (appointment) => new Date(appointment.event_date) >= new Date()
  ).length;

  const pastCount = appointments.filter(
    (appointment) => new Date(appointment.event_date) < new Date()
  ).length;

  const tabs = [
    { label: "Upcoming", count: upcomingCount },
    { label: "Past", count: pastCount },
    { label: "All", count: appointments.length },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>

        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
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
            Unable to Load Appointments
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchAppointments}
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
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <div className="mt-4 space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentItem key={appointment.id} appointment={appointment} />
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
              No Appointments Found
            </h3>
            <p className="text-sm text-gray-600">
              {activeTab === "All"
                ? "There are no appointments scheduled for this patient."
                : activeTab === "Upcoming"
                  ? "There are no upcoming appointments scheduled for this patient."
                  : "There are no past appointments for this patient."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsCard;