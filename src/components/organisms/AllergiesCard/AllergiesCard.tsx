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

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAllergies(patientId));
    }
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
      <div className="flex flex-col items-center justify-center px-4 pb-4 mx-auto bg-white rounded-lg">
        <div className="flex flex-col items-center mb-4">
          <Skeleton circle height={40} width={40} />
          <div className="mt-4">
            <Skeleton height={30} width={200} />
          </div>
          <div className="mt-2">
            <Skeleton height={20} width={250} />
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-red-500">
            Oops! Something went wrong.
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
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