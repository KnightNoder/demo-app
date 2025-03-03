import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppointmentItem from "../../molecules/AppointmentItem/AppointmentItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";

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
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Upcoming");
  

  useEffect(() => {
    // if (patientId) {
    //   setLoading(true);
    //   fetch(`/api/appointments?patientId=${patientId}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setAppointments(data.data);
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       setError(err.message);
    //       setLoading(false);
    //     });
    // }
    setAppointments([{
      "id": 39,
      "title": "Assessment",
      "description": "Routine Checkup",
      "event_date": "2024-02-12",
      "end_date": "2024-02-29",
      "duration": 60,
      "start_time": "01:00 PM",
      "end_time": "02:00 PM",
      "recurrence_type": 1,
      "patient": {
        "id": 1002,
        "first_name": "Test",
        "last_name": "Patient"
      },
      "provider": {
        "id": 1,
        "first_name": "Ensoftek",
        "last_name": "Administrator"
      },
      "facility": {
        "id": 13,
        "name": "Yashoda"
      },
      "category": {
        "id": 17,
        "name": "Assessment"
      }
    }
  ])
  }, [patientId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
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
      <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-red-500">Oops! Something went wrong.</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  const tabs = [
    { label: "Upcoming", count: 2  },
    { label: "Past", count: 0 },
    { label: "All", count: 2 },

  ];

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      
      <div className="mt-4 space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentItem key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="w-full p-4 text-center text-gray-500">No Appointments found</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsCard;
