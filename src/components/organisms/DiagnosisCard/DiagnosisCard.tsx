import React, { useEffect, useState, useMemo } from "react";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import { DiagnosisTable } from "../../molecules/DiagnosisTable/DiagnosisTable";
import { fetchDiagnosis } from "../../../features/diagnosisSlice/diagnosisThunk";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface MedicalProblemsListProps {
  patientId?: string | null;
  isAnyModalOpen?: boolean;
}

const MedicalProblemsList: React.FC<MedicalProblemsListProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const dispatch = useAppDispatch();
  const { diagnosis, loading, error } = useAppSelector(
    (state) => state.diagnosis
  );

  const [activeTab, setActiveTab] = useState("Active");

  // Filter diagnoses based on the active tab
  const filteredDiagnosis = useMemo(() => {
    if (!diagnosis) return [];

    const now = new Date();

    switch (activeTab) {
      case "Active":
        // Show diagnoses whose modified_on is less than now
        return diagnosis.filter((item) => {
          const modifiedDate = new Date(item.modified_on);
          return modifiedDate < now;
        });
      case "Resolved":
        // Show diagnoses whose modified_on is greater than now
        return diagnosis.filter((item) => {
          const modifiedDate = new Date(item.modified_on);
          return modifiedDate > now;
        });
      case "All":
      default:
        // Show all diagnoses
        return diagnosis;
    }
  }, [diagnosis, activeTab]);

  // Update the tabs to show the correct counts
  const tabs = useMemo(() => {
    if (!diagnosis) return [];

    const now = new Date();

    const activeDiagnoses = diagnosis.filter((item) => {
      const modifiedDate = new Date(item.modified_on);
      return modifiedDate < now;
    });

    const resolvedDiagnoses = diagnosis.filter((item) => {
      const modifiedDate = new Date(item.modified_on);
      return modifiedDate > now;
    });

    return [
      { label: "Active", count: activeDiagnoses.length },
      { label: "Resolved", count: resolvedDiagnoses.length },
      { label: "All", count: diagnosis.length },
    ];
  }, [diagnosis]);

  // Function to fetch diagnosis data
  const handleFetchDiagnosis = () => {
    if (patientId) {
      dispatch(fetchDiagnosis(patientId));
    }
  };

  useEffect(() => {
    handleFetchDiagnosis();
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="p-4 mx-auto bg-white rounded-lg">
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
            Unable to Load Medical Problems
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleFetchDiagnosis}
          className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
    <div className="pb-4 mx-auto bg-white rounded-lg">
      <TabListHeader
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        <DiagnosisTable
          diagnosis={filteredDiagnosis}
          isAnyModalOpen={isAnyModalOpen}
        />
      </div>
    </div>
  );
};

export default MedicalProblemsList;