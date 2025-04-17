import React, { useState } from "react";
// import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
// import axiosClient from "../../../api/axiosClient";





const BillingWidget
: React.FC = ({  }) => {
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Upcoming");

  // useEffect(() => {
  //   if (patientId) {
  //     setLoading(true);
  //     axiosClient
  //       .get(`/appointments/${patientId}/`)
  //       .then((response) => {
  //         setAppointments(response.data.data);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setError(err.response?.data?.message || err.message);
  //         setLoading(false);
  //       });
  //   }
  // }, [patientId]);

  // const getFilteredAppointments = () => {
  //   const now = new Date();

  //   switch (activeTab) {
  //     case "Upcoming":
  //       return appointments.filter((appointment) => {
  //         const eventDate = new Date(appointment.event_date);
  //         return eventDate >= now;
  //       });
  //     case "Past":
  //       return appointments.filter((appointment) => {
  //         const eventDate = new Date(appointment.event_date);
  //         return eventDate < now;
  //       });
  //     case "All":
  //     default:
  //       return appointments;
  //   }
  // };

  // const filteredAppointments = getFilteredAppointments();

  // // Update tab counts based on filtered data
  // const upcomingCount = appointments.filter(
  //   (appointment) => new Date(appointment.event_date) >= new Date()
  // ).length;

  // const pastCount = appointments.filter(
  //   (appointment) => new Date(appointment.event_date) < new Date()
  // ).length;

  const tabs = [
    { label: "Transactions", count: 0 },
    { label: "Claims", count: 0 },
    { label: "Statments", count: 0 },
    { label: "Insurance", count: 0 },
    { label: "Payment Receipts", count: 0 },
    { label: "Prior Authorization", count: 0 },
    { label: "Credit Cards", count: 0 },
  ];

  // if (loading) {
  //   return (
  //     <div className="bg-white rounded-lg">
  //       <div className="flex mb-4 gap-1.5 justify-between">
  //         <Skeleton height={40} width={220} />
  //         <Skeleton height={40} width={220} />
  //       </div>

  //       <div className="mt-4">
  //         <Skeleton height={120} style={{ marginTop: "10px" }} />
  //         <Skeleton height={120} style={{ marginTop: "10px" }} />
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
  //       <div className="mt-4 text-center">
  //         <p className="text-lg font-semibold text-red-500">
  //           Oops! Something went wrong.
  //         </p>
  //         <p className="mt-2 text-gray-600">{error}</p>
  //       </div>
  //       <Skeleton height={50} width={180} />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
    </div>
  );
};

export default BillingWidget;