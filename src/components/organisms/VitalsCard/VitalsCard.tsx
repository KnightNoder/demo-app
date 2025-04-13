import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import VitalsOverview from "../../molecules/Vitals/Overview";
import VitalsTrend from "../../molecules/Vitals/Trends";
import VitalsTable from "../../molecules/Vitals/Table";
import axiosClient from "../../../api/axiosClient";

interface VitalsCardProps {
  patientId: string | null;
}

const VitalsCard: React.FC<VitalsCardProps> = ({ patientId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Current");
  const [vitalsData, setVitalsData] = useState<any[]>([]);

  // Transform data to match VitalsTable expected format
  const transformedVitalsData = vitalsData.map((item) => ({
    timestamp: item.date,
    time: item.time, // Add if available in your API response
    date: item.date,
    bp_systolic: item.BP_systolic,
    bp_diastolic: item.BP_diastolic,
    heart_rate: item.pulse,
    temperature: item.temperature,
    oxygen_saturation: item.SP02_room_air_without_oxygen,
    respiratory_rate: item.respiration,
    pain_level: item.pain,
  }));

  useEffect(() => {
    if (patientId) {
      setLoading(true);

      axiosClient
        .get(`/vitals?pid=${patientId}`)
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            setVitalsData(response.data.data);
          } else {
            setVitalsData([]);
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg md:p-6">
        <div className="flex flex-col md:flex-row mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>
        <div className="mt-4">
          <Skeleton height={120} className="mt-2" />
          <Skeleton height={120} className="mt-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 px-4 pb-4 mx-auto bg-white rounded-lg md:p-6">
        <div className="mt-4 text-center">
          <p className="text-sm font-normal text-[#020817]">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-xs font-light text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  // Show a message if there's no data
  if (vitalsData.length === 0) {
    return (
      <div className="bg-white rounded-lg md:p-6">
        <div className="flex justify-center items-center p-8">
          <p className="text-xs font-light text-gray-600">
            No vitals data available for this patient
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: "Current" },
    { label: "Trends" },
    { label: "History" },
  ];

  return (
    <div className="bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        {activeTab === "Current" && vitalsData.length > 0 && (
          <VitalsOverview vitalData={vitalsData[0]} />
        )}
        {activeTab === "Trends" && <VitalsTrend vitalsDataArray={vitalsData} />}
        {activeTab === "History" && (
          <VitalsTable vitalsDataArray={transformedVitalsData} />
        )}
      </div>
    </div>
  );
};

export default VitalsCard;