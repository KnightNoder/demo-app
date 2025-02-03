import React, { useState } from "react";
import TabListHeader from "../../molecules/CardHeader/CardHeader";

interface Allergy {
  id: string;
  allergen: string;
  type: string;
  title: string;
  begdate: string;
  enddate: string;
  diagnosis: string;
  reaction?: string;
  severity: string;
}

interface AllergyTableProps {
  data: Allergy[];
}

const AllergyTable: React.FC<AllergyTableProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState("Active");
  const tabs = [
    { label: "Active", count: data.length },
    { label: "Medication" },
    { label: "Others", count: data.length },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      {/* Tabs */}
      
      <TabListHeader tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />

      {/* Table */}
      <div className="mt-4">
        <div className="w-full rounded-md overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 top-0">
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
              {data.map((allergy) => (
                <tr key={allergy.id} className="hover:bg-gray-50">
                  <td className="pl-1 pr-2 py-4 align-middle text-xs font-medium">
                    {allergy.allergen}
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-500 border border-gray-200 text-[10px]">
                      {allergy.type}
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-700 text-[10px]">
                      {allergy.severity}
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium bg-gray-100 text-gray-700 text-[10px]">
                      Active
                    </div>
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs">
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
                  <td className="pl-1 pr-2 py-1 align-middle text-xs text-gray-500">
                    {allergy.begdate}
                  </td>
                  <td className="pl-1 pr-2 py-1 align-middle text-xs text-gray-500">
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
