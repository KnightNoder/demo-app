// src/components/organisms/AllergiesCard/AllergiesCard.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  fetchAllergies} from "../../../features/allergySlice/allergyThunk";
import TabListHeader from "../../molecules/CardHeader/CardHeader";
import { AppDispatch, RootState } from "../../../store/store";

const AllergyTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allergies, loading, error } = useSelector((state: RootState) => state.allergies);

  useEffect(() => {
      dispatch(fetchAllergies());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState("Active");
  const tabs = [
    { label: "Active", count: allergies.length },
    { label: "Allergy", count: allergies.filter((allergy) => allergy.type == "allergy").length },
    { label: "Others", count: allergies.filter((allergy) => allergy.type != "allergy").length },
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
        <div className="w-full overflow-x-auto rounded-md">
          <table className="w-full text-xs">
            <thead className="top-0 bg-gray-50">
              <tr>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Allergen
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Type
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Severity
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Status
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Reactions
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Onset Date
                </th>
                <th className="h-7 pl-1 pr-2 text-[11px] font-medium text-gray-500 uppercase align-middle whitespace-nowrap">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {allergies.map((allergy) => (
                <tr key={allergy?.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-1 pr-2 text-xs font-medium align-middle">
                    {allergy.allergen}
                  </td>
                  <td className="py-1 pl-1 pr-2 text-xs align-middle">
                    <div className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-500 border border-gray-200 text-[10px]">
                      {allergy.type}
                    </div>
                  </td>
                  <td className="py-1 pl-1 pr-2 text-xs align-middle">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-700 text-[10px]">
                      {allergy.severity}
                    </div>
                  </td>
                  <td className="py-1 pl-1 pr-2 text-xs align-middle">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-700 text-[10px]">
                      Active
                    </div>
                  </td>
                  <td className="py-1 pl-1 pr-2 text-xs align-middle">
                    <div className="flex flex-wrap gap-1">
                      {allergy.reaction ? (
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-600 text-[10px]">
                          {allergy.reaction}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </td>
                  <td className="py-1 pl-1 pr-2 text-xs text-gray-500 align-middle">
                    {allergy.begdate}
                  </td>
                  <td className="py-1 pl-1 pr-2 text-xs text-gray-500 align-middle">
                    {allergy.enddate || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllergyTable;