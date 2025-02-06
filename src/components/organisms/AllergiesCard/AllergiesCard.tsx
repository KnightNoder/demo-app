import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store"; // Import necessary hooks
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import AllergyTable from "../../molecules/AllergyTable/AllergyTable";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles
import { fetchAllergies } from "../../../features/allergySlice/allergyThunk"; // Import the thunk

const AllergiesCard: React.FC = () => {
  const dispatch = useAppDispatch(); // Dispatch action from redux
  const { allergies, loading, error } = useAppSelector((state) => state.allergies); // Get state from redux

  const [activeTab, setActiveTab] = useState("Active");

  // Tabs data, can be modified based on your need
  const tabs = [
    { label: "Active", count: allergies.length },
    { label: "Allergy", count: allergies.length }, // Adjust count dynamically
    { label: "Others", count: 0 },
  ];

  // Fetch allergies data when the component mounts
  useEffect(() => {
    dispatch(fetchAllergies()); // Dispatch fetchAllergies action
  }, [dispatch]);

  // Loading state: display skeleton loader while fetching data
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
        {/* Skeleton loader for TabListHeader */}
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>

        {/* Skeleton loader for Allergy Table */}
        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  // Error state: display error skeleton with error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 mx-auto bg-white rounded-lg">
        {/* Error Skeleton */}
        <div className="flex flex-col items-center mb-4">
          <Skeleton circle height={40} width={40} />
          <div className="mt-4">
            <Skeleton height={30} width={200} />
          </div>
          <div className="mt-2">
            <Skeleton height={20} width={250} />
          </div>
        </div>
        {/* Display Error Message */}
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-red-500">Oops! Something went wrong.</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        {/* Optional: Skeleton for retry action */}
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        <AllergyTable allergies={allergies} loading={false} />
      </div>
    </div>
  );
};

export default AllergiesCard;
