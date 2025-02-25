import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import AllergyTable from "../../molecules/AllergyTable/AllergyTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchAllergies } from "../../../features/allergySlice/allergyThunk"; 

interface AllergyCardProps {
  patientId: string | null;
}

const AllergiesCard: React.FC<AllergyCardProps> = ({ patientId }) => {
  const dispatch = useAppDispatch();
  const { allergies, loading, error } = useAppSelector((state) => state.allergies); 

  const [activeTab, setActiveTab] = useState("Active");

  const tabs = [
    { label: "Active", count: allergies.length },
    { label: "Allergy", count: allergies.length }, 
    { label: "Others", count: 0 },
  ];

  const tableHeaders = ["Allergen", "Severity", "Status", "Reactions", "Onset Date", "Last Updated"]; // Define headers

  useEffect(() => {
    if (patientId) {
      dispatch(fetchAllergies(patientId));
    }
  }, [dispatch, patientId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
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
          <p className="text-lg font-semibold text-red-500">Oops! Something went wrong.</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
        <Skeleton height={50} width={180} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        <AllergyTable allergies={allergies} loading={false} tableHeaders={tableHeaders} />
      </div>
    </div>
  );
};

export default AllergiesCard;
