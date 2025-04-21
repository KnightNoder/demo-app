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

  const fetchVitalsData = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const response = await axiosClient.get(`/vitals?pid=${patientId}`);

      if (Array.isArray(response.data.data)) {
        setVitalsData(response.data.data);
      } else {
        setVitalsData([]);
      }
      setError(null);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while fetching vitals data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchVitalsData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg md:p-6">
        <div className="flex flex-col md:flex-row mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
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
            Unable to Load Vitals Data
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchVitalsData}
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

  const tabs = [
    { label: "Current" },
    { label: "Trends" },
    { label: "History" },
  ];

  // Show a message if there's no data
  if (vitalsData.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
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
            No Vitals Data Available
          </h3>
          <p className="text-sm text-gray-600">
            No vitals information is available for this patient.
          </p>
        </div>
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