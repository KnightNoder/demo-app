import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import AllergyTable from "../../molecules/AllergyTable/AllergyTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchAllergies } from "../../../features/allergySlice/allergyThunk"; 

interface AllergyCardProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

const AllergiesCard: React.FC<AllergyCardProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const dispatch = useAppDispatch();
  const { allergies, loading, error } = useAppSelector(
    (state) => state.allergies
  );

  const [activeTab, setActiveTab] = useState("Active");

  // Filter allergies based on end date
  const today = new Date();

  // Make sure we're working with a clean array by creating a new array
  // This prevents issues if allergies are being mutated elsewhere
  const sanitizedAllergies = [...allergies];

  const activeAllergies = sanitizedAllergies.filter((allergy) => {
    // If allergy has an end date and it's after today, or if it has no end date
    return !allergy?.enddate || new Date(allergy?.enddate) > today;
  });

  const inactiveAllergies = sanitizedAllergies.filter((allergy) => {
    // If allergy has an end date and it's before today
    return allergy.enddate && new Date(allergy.enddate) <= today;
  });

  // Determine which allergies to display based on active tab
  // Force this to be a NEW array reference each time to help with rendering
  const allergiesForDisplay = (() => {
    switch (activeTab) {
      case "Active":
        return [...activeAllergies];
      case "Inactive":
        return [...inactiveAllergies];
      case "All":
      default:
        return [...sanitizedAllergies];
    }
  })();

  const tabs = [
    { label: "Active", count: activeAllergies.length },
    { label: "Inactive", count: inactiveAllergies.length },
    { label: "All", count: sanitizedAllergies.length },
  ];

  const tableHeaders = [
    "Allergen",
    "Severity",
    "Status",
    "Reactions",
    "Onset Date",
    "Last Updated",
  ];

  // Function to fetch allergies data
  const handleFetchAllergies = () => {
    if (patientId) {
      dispatch(fetchAllergies(patientId));
    }
  };

  useEffect(() => {
    handleFetchAllergies();
  }, [dispatch, patientId]);

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
      <div className="flex flex-col items-center justify-center p-6 mx-auto bg-white rounded-lg ">
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
            Unable to Load Allergies
          </h3>
          <p className="text-sm text-gray-600">
            {typeof error === "string"
              ? error
              : "An unexpected error occurred while fetching data."}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleFetchAllergies}
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
      <div className="mt-4">
        {/* Add a key to force re-render when tab changes */}
        <AllergyTable
          key={`allergy-table-${activeTab}`}
          allergies={allergiesForDisplay}
          loading={false}
          tableHeaders={tableHeaders}
          isAnyModalOpen={isAnyModalOpen}
        />
      </div>
    </div>
  );
};

export default AllergiesCard;