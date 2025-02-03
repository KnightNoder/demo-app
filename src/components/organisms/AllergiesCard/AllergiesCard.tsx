import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllergies } from "../../../features/allergySlice/allergyThunk";
import TabListHeader from "../../molecules/CardHeader/CardHeader";
import { AppDispatch, RootState } from "../../../store/store";
import AllergyTable from "../../molecules/AllergyTable/AllergyTable";

const AllergiesCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allergies, loading, error } = useSelector((state: RootState) => state.allergies);

  useEffect(() => {
    dispatch(fetchAllergies());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState("Active");
  const tabs = [
    { label: "Active", count: allergies.length },
    { label: "Allergy", count: allergies.filter((allergy) => allergy.type === "allergy").length },
    { label: "Others", count: allergies.filter((allergy) => allergy.type !== "allergy").length },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="mt-4">
        <AllergyTable allergies={allergies} />
      </div>
    </div>
  );
};

export default AllergiesCard;
