import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import MedicationItem from "../../molecules/MedicationItem/MedicationItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchMedications } from "../../../features/medications/medicationsThunk";
import Icons from "../../../assets/Icons/Icons";

interface MedicationsCardProps {
  patientId: string | null;
}

const MedicationsCard: React.FC<MedicationsCardProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const { medications, loading, error } = useAppSelector(
    (state) => state.medications
  );

  const [activeTab, setActiveTab] = useState("Active");

  // Filter medications based on refill value
  const activeMedications = medications.filter((med) => med.refill === "0");
  const otcMedications = medications.filter((med) => med.refill !== "0");

  const tabs = [
    { label: "Active", count: activeMedications.length },
    { label: "OTC", count: otcMedications.length },
  ];

  const handleFetchMedications = () => {
    if (patientId) {
      dispatch(fetchMedications(patientId));
    }
  };

  useEffect(() => {
    handleFetchMedications();
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
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
            Unable to Load Medications
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleFetchMedications}
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

  // Determine which medications to display based on active tab
  const filteredMedications =
    activeTab === "Active" ? activeMedications : otcMedications;

  return (
    <div className="bg-white rounded-lg overflow-y-auto relative">
      <div className="sticky top-0 z-20 bg-white">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
      <div className="mt-4 space-y-4 overflow-y-auto">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med, index) => (
            <MedicationItem key={index} medication={med} />
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
              No Medications Found
            </h3>
            <p className="text-sm text-gray-600">
              {activeTab === "Active"
                ? "No active medications are available for this patient."
                : "No over-the-counter medications are available for this patient."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsCard;