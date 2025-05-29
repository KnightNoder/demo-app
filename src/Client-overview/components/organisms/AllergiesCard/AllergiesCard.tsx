import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import AllergyTable from "../../molecules/AllergyTable/AllergyTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchAllergies } from "../../../../features/allergySlice/allergyThunk"; 
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

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
  const sanitizedAllergies = Array.isArray(allergies) ? [...allergies] : [];

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
      <ErrorComponent
        title="Unable to Load Allergies"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={handleFetchAllergies}
      />
    );
  }

  if (!Array.isArray(allergies)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of allergies but received a different format."
        icon="warning"
        onRetry={handleFetchAllergies}
      />
    );
  }

  if (allergiesForDisplay.length === 0) {
    return (
      <div className="bg-white rounded-lg overflow-y-auto relative">
        <TabListHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <EmptyStateComponent
          title="No Allergies Found"
          message={
            activeTab === "All"
              ? "No allergies are available for this patient."
              : `No ${activeTab.toLowerCase()} allergies are available for this patient.`
          }
          isAnyModalOpen={isAnyModalOpen}
        />
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