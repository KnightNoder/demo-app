import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppointmentItem from "../../molecules/AppointmentItem/AppointmentItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import axiosClient from "../../../api/axiosClient";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

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
  isAnyModalOpen?: boolean;
  patientId: string | null;
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
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
        return appointments?.filter((appointment) => {
          const eventDate = new Date(appointment.event_date);
          return eventDate >= now;
        });
      case "Past":
        return appointments?.filter((appointment) => {
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
  const upcomingCount = appointments?.filter(
    (appointment) => new Date(appointment.event_date) >= new Date()
  ).length;

  const pastCount = appointments?.filter(
    (appointment) => new Date(appointment.event_date) < new Date()
  ).length;

  const tabs = [
    { label: "Upcoming", count: upcomingCount },
    { label: "Past", count: pastCount },
    { label: "All", count: appointments?.length },
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
      <ErrorComponent
        title="Unable to Load Appointments"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={fetchAppointments}
      />
    );
  }

  if (!Array.isArray(appointments)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of appointments but received a different format."
        icon="warning"
        onRetry={fetchAppointments}
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

      <div className="mt-4 space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments?.map((appointment) => (
            <AppointmentItem key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <EmptyStateComponent
            title="No Appointments Found"
            message={
              activeTab === "All"
                ? "There are no appointments scheduled for this patient."
                : activeTab === "Upcoming"
                  ? "There are no upcoming appointments scheduled for this patient."
                  : "There are no past appointments for this patient."
            }
            isAnyModalOpen={isAnyModalOpen}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentsCard;