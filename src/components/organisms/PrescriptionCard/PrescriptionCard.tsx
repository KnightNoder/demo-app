import React, { useEffect, useState } from "react";
import PrescriptionItem from "../../molecules/PrescriptionItem/PrescriptionItem";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosClient from "../../../api/axiosClient";
import Icons from "../../../assets/Icons/Icons";

interface PrescriptionCardProps {
  patientId: string | null;
}

interface Prescription {
  id: number;
  drug_display: string;
  dosage: string;
  form: string;
  route: string;
  interval: string;
  doseother: string;
  note: string;
  quantity: string;
  quantityunit: string;
  active: number;
  ndcid: string;
  refills: number;
  start_date: string;
  provider: {
    id: number;
    name: string;
  };
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Active");

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/prescriptions/${patientId}/`);
      setPrescriptions(response.data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

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
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-red-500 bg-red-100 rounded-full">
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
            Unable to Load Prescriptions
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchPrescriptions}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <Icons variant="retry" />
            Retry
          </div>
        </button>
      </div>
    );
  }

  if (!Array.isArray(prescriptions)) {
    return (
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-4 text-orange-500 bg-orange-100 rounded-full">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Data Format Error
          </h3>
          <p className="text-sm text-gray-600">
            Expected an array of prescriptions but received a different format.
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={fetchPrescriptions}
          className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="flex items-center">
            <Icons variant="retry" />
            Retry
          </div>
        </button>
      </div>
    );
  }

  const activeCount = prescriptions.filter(
    (prescription) => prescription.active === 1
  ).length;

  const tabs = [
    { label: "Active", count: activeCount },
    { label: "High Risk", count: 0 },
    { label: "Needs Review", count: 0 },
    { label: "All", count: prescriptions.length },
  ];

  const filteredPrescriptions =
    activeTab === "All"
      ? prescriptions
      : activeTab === "Active"
        ? prescriptions.filter((prescription) => prescription.active === 1)
        : [];

  if (filteredPrescriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-y-auto relative">
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
            No Prescriptions Found
          </h3>
          <p className="text-sm text-gray-600">
            {activeTab === "All"
              ? "No prescriptions are available for this patient."
              : `No ${activeTab.toLowerCase()} prescriptions are available for this patient.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-y-auto relative">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4 space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <PrescriptionItem key={prescription.id} prescription={prescription} />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionCard;